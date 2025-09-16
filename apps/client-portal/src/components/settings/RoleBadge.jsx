"use client";

export default function RoleBadge({ role }) {
  const getRoleStyles = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-blue-100 text-blue-600';
      case 'user':
        return 'bg-gray-100 text-gray-600';
      case 'staff':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleStyles(role)}`}>
      {role}
    </span>
  );
}
