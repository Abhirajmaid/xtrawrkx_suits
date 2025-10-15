# Deployment Checklist for Xtrawrkx Accounts App

Use this checklist to ensure your deployment is production-ready and secure.

## Pre-Deployment Checklist

### 1. Code Quality & Security

- [ ] All hardcoded credentials have been removed
- [ ] Auto-login is disabled in production (`NODE_ENV=production`)
- [ ] All API endpoints use environment variables
- [ ] No sensitive data in git history
- [ ] All dependencies are up to date
- [ ] No security vulnerabilities in dependencies (`npm audit`)
- [ ] Code has been linted (`npm run lint`)
- [ ] All console.log statements removed or conditional

### 2. Environment Configuration

- [ ] `.env.example` file is up to date
- [ ] `.env` file is added to `.gitignore`
- [ ] All required environment variables are documented
- [ ] Environment variables are set in deployment platform
- [ ] `NEXT_PUBLIC_STRAPI_URL` points to production backend
- [ ] `NODE_ENV` is set to `production`
- [ ] Demo credentials (`NEXT_PUBLIC_DEMO_EMAIL`, `NEXT_PUBLIC_DEMO_PASSWORD`) are NOT set in production

### 3. Backend Integration

- [ ] Strapi backend is deployed and accessible
- [ ] Backend CORS is configured to allow frontend domain
- [ ] Authentication endpoints are working
- [ ] API endpoints are accessible from frontend
- [ ] Database is properly configured and migrated
- [ ] SSL/TLS is enabled on backend

### 4. Build & Test

- [ ] Production build completes successfully (`npm run build`)
- [ ] No build errors or warnings
- [ ] Application starts without errors (`npm start`)
- [ ] All pages load correctly
- [ ] Authentication flow works end-to-end
- [ ] User management functions properly
- [ ] Permissions and roles are enforced

### 5. Performance

- [ ] Images are optimized
- [ ] Static assets are properly cached
- [ ] No unnecessary re-renders
- [ ] API calls are optimized
- [ ] Loading states are implemented

### 6. Deployment Platform

- [ ] Deployment platform account is set up (Railway/Vercel)
- [ ] Project is created on platform
- [ ] GitHub repository is connected
- [ ] Environment variables are configured
- [ ] Build settings are correct
- [ ] Domain/subdomain is configured (if applicable)

### 7. Monitoring & Logging

- [ ] Error tracking is set up (optional)
- [ ] Analytics are configured (optional)
- [ ] Logging is configured appropriately
- [ ] Health check endpoint exists (if needed)

## Deployment Steps

### For Railway

1. **Prepare Repository**

   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Create Railway Project**

   - Navigate to [Railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `xtrawrkx-accounts` repository

3. **Configure Environment**

   - Go to project settings → Variables
   - Add all environment variables:
     - `NEXT_PUBLIC_STRAPI_URL` (your backend URL)
     - `NODE_ENV=production`
     - `PORT=3003` (optional)

4. **Deploy**

   - Railway will automatically build using `railway.json`
   - Monitor build logs for errors
   - Wait for deployment to complete

5. **Verify Deployment**
   - Visit the generated Railway URL
   - Test login functionality
   - Verify API calls to backend
   - Check all major features

### For Vercel

1. **Prepare Repository**

   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Import to Vercel**

   - Navigate to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Project**

   - Framework: `Next.js`
   - Root Directory: Leave as is (or set to `xtrawrkx-accounts` if monorepo)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Set Environment Variables**

   - Go to Settings → Environment Variables
   - Add all required variables for Production:
     - `NEXT_PUBLIC_STRAPI_URL`
     - `NODE_ENV=production`

5. **Deploy**

   - Click "Deploy"
   - Monitor deployment progress
   - Wait for completion

6. **Verify Deployment**
   - Visit the Vercel URL
   - Test all functionality
   - Check browser console for errors

## Post-Deployment Verification

### Functional Testing

- [ ] Home page loads correctly
- [ ] Login page works
- [ ] User can log in with valid credentials
- [ ] Protected routes require authentication
- [ ] User management pages work
- [ ] Organization pages work
- [ ] Settings pages work
- [ ] Profile page works
- [ ] Logout works correctly
- [ ] API error handling works

### Security Testing

- [ ] HTTPS is enforced
- [ ] Authentication tokens are secure
- [ ] Unauthorized access is blocked
- [ ] CORS is properly configured
- [ ] No sensitive data exposed in responses
- [ ] XSS protection is active
- [ ] CSRF protection is active

### Performance Testing

- [ ] Page load times are acceptable (< 3s)
- [ ] API response times are good (< 1s)
- [ ] No memory leaks
- [ ] Images load properly
- [ ] Caching works as expected

## Rollback Plan

If deployment fails or issues are discovered:

1. **Railway**

   - Go to Deployments tab
   - Click on previous successful deployment
   - Click "Redeploy"

2. **Vercel**

   - Go to Deployments tab
   - Find previous working deployment
   - Click "..." → "Promote to Production"

3. **Git Revert**
   ```bash
   git revert HEAD
   git push origin main
   ```

## Common Issues & Solutions

### Issue: "Authentication Failed"

**Solution**: Verify `NEXT_PUBLIC_STRAPI_URL` is correct and backend is accessible

### Issue: "CORS Error"

**Solution**: Configure CORS in Strapi backend to allow your frontend domain

### Issue: "Build Failed"

**Solution**: Check build logs, ensure all dependencies are installed, verify Node.js version

### Issue: "Environment Variables Not Working"

**Solution**: Ensure variables start with `NEXT_PUBLIC_` for client-side access, rebuild after changing variables

### Issue: "500 Internal Server Error"

**Solution**: Check server logs, verify backend connectivity, check environment configuration

## Maintenance

### Regular Tasks

- [ ] Monitor error logs weekly
- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Backup configuration
- [ ] Test disaster recovery

### Updates

When updating the application:

1. Test changes locally
2. Deploy to staging (if available)
3. Run full test suite
4. Deploy to production
5. Monitor for issues
6. Have rollback ready

## Support Contacts

- **Technical Issues**: [Support Email]
- **Infrastructure**: [Infrastructure Team]
- **Security**: [Security Team]

## Documentation References

- [README.md](./README.md) - Setup and configuration
- [Strapi Backend](../xtrawrkx-backend-strapi/README.md) - Backend documentation
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation
- [Railway Docs](https://docs.railway.app/) - Deployment platform
- [Vercel Docs](https://vercel.com/docs) - Deployment platform
