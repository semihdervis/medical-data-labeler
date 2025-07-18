# CapRover Deployment Guide for Medical Data Labeler

## Prerequisites

1. CapRover instance running and accessible
2. Domain configured for CapRover
3. MongoDB database (you can use MongoDB Atlas or deploy MongoDB on CapRover)

## Deployment Steps

### Step 1: Prepare Your CapRover Instance

1. Ensure CapRover is installed and running
2. Have a domain pointed to your CapRover instance
3. Install CapRover CLI: `npm install -g caprover`
4. Login to CapRover: `caprover login`

### Step 2: Prepare Environment Variables

Create these environment variables in CapRover for your app (see `.env.template` for details):

```
MONGODB_URI=mongodb+srv://your-mongodb-connection-string
PORT=3001
JWT_SECRET=your-jwt-secret-here
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
NODE_ENV=production
```

### Step 3: Deploy to CapRover

**Quick Deployment (Recommended):**
```bash
# For Linux/Mac
./deploy.sh

# For Windows PowerShell
./deploy.ps1
```

**Manual Deployment Options:**

1. **Option A: Deploy from Git Repository**
   - In CapRover dashboard, create a new app
   - Connect your GitHub repository
   - Set branch to `main`
   - CapRover will automatically build and deploy using the Dockerfile

2. **Option B: Deploy using CapRover CLI**
   ```bash
   npm install -g caprover
   caprover login
   caprover deploy
   ```

3. **Option C: Deploy via Tarball**
   - Create a tarball of your project
   - Upload it through CapRover web interface

### Step 4: Configure App Settings

1. **Enable HTTPS**: Enable HTTPS in CapRover app settings
2. **Set Environment Variables**: Add all required environment variables
3. **Configure Port**: Ensure port 3001 is configured (should be automatic)

### Step 5: Database Setup

If you don't have MongoDB yet:

1. **Option A: MongoDB Atlas** (Recommended)
   - Create a free cluster at https://cloud.mongodb.com
   - Get connection string and use it as MONGODB_URI

2. **Option B: Deploy MongoDB on CapRover**
   - Use CapRover's one-click MongoDB deployment
   - Configure internal networking between apps

### Step 6: Post-Deployment Configuration

1. **Create Admin User**: After deployment, you may need to create an initial admin user
2. **Test Upload Functionality**: Ensure file uploads work correctly
3. **Configure Email**: Test password recovery emails

## File Structure for CapRover

Your project should have this structure for CapRover deployment:
```
medical-data-labeler/
├── captain-definition
├── Dockerfile
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
└── server/
    ├── package.json
    ├── server.js
    └── ...
```

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check that all package.json files are correct
   - Ensure Node.js version compatibility

2. **Database Connection**
   - Verify MongoDB URI is correct
   - Check network connectivity

3. **File Uploads**
   - Ensure uploads directory exists and has correct permissions
   - Check if volume persistence is needed for file storage

4. **CORS Issues**
   - Update CORS configuration in server if needed
   - Ensure frontend makes requests to correct backend URL

### Environment Variables for Production:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medical-labeler

# Server
PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret

# Email Configuration
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-app-specific-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

## Scaling Considerations

1. **File Storage**: Consider using external storage (AWS S3, etc.) for uploaded images
2. **Database**: Use MongoDB Atlas or properly configured MongoDB replica set
3. **Load Balancing**: CapRover handles this automatically
4. **Monitoring**: Enable CapRover monitoring and set up alerts

## Security Notes

1. **JWT Secret**: Use a strong, unique JWT secret
2. **Database Security**: Ensure MongoDB has authentication enabled
3. **HTTPS**: Always enable HTTPS in production
4. **File Upload**: Implement file size limits and type validation
5. **Environment Variables**: Never commit sensitive data to git
