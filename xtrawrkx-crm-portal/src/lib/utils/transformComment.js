/**
 * Transform Strapi comment data to frontend format
 * @param {Object} strapiComment - Comment from Strapi API
 * @returns {Object} - Transformed comment
 */
export const transformComment = (strapiComment) => {
  if (!strapiComment) return null;

  // Handle Strapi v4 response format
  const comment = strapiComment.attributes || strapiComment;
  const commentId = strapiComment.id || comment.id;

  // Transform user
  let user = null;
  if (comment.user) {
    const userData = comment.user.data?.attributes || comment.user.attributes || comment.user;
    user = {
      id: comment.user.data?.id || comment.user.id || userData.id,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'Unknown User',
      email: userData.email || ''
    };
  }

  // Transform parent comment if exists
  let parentComment = null;
  if (comment.parentComment) {
    parentComment = transformComment(comment.parentComment);
  }

  // Transform replies
  let replies = [];
  if (comment.replies) {
    const repliesData = comment.replies.data || comment.replies;
    if (Array.isArray(repliesData)) {
      replies = repliesData.map(reply => transformComment(reply)).filter(Boolean);
    }
  }

  return {
    id: commentId,
    content: comment.content || '',
    commentableType: comment.commentableType,
    commentableId: comment.commentableId,
    user: user,
    parentComment: parentComment,
    replies: replies,
    mentions: comment.mentions || null,
    createdAt: comment.createdAt || comment.created_at,
    updatedAt: comment.updatedAt || comment.updated_at,
    timestamp: comment.createdAt || comment.created_at
  };
};

