# UniEngage Backend Deployment Guide

This guide will walk you through deploying the UniEngage backend to Render.com.

## Prerequisites

- GitHub repository with the UniEngage code pushed
- MongoDB Atlas account (free tier available)
- Render account (free tier available)

## Step 1: Set Up MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Create" or "Build a Database"
   - Choose the **FREE** tier (M0 Sandbox)
   - Select a cloud provider and region (choose one closest to your Render region)
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these securely!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add `0.0.0.0/0`)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
   - **Important**: Replace `<password>` with your actual database user password
   - Add the database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/uniengage`

## Step 2: Deploy to Render

### Option A: Deploy Using Render Blueprint (Recommended)

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up using your GitHub account

3. **Create New Blueprint Instance**
   - Click "New +" in the top right
   - Select "Blueprint"
   - Connect your GitHub repository
   - Select the `UniEngage` repository
   - Render will automatically detect the `render.yaml` file

4. **Configure Environment Variables**
   - In the Blueprint setup, you'll see the environment variables
   - Set `MONGO_URI` to your MongoDB Atlas connection string from Step 1
   - `JWT_SECRET` will be auto-generated
   - Click "Apply"

5. **Deploy**
   - Render will automatically build and deploy your backend
   - Wait for the deployment to complete (this may take a few minutes)
   - Once complete, you'll see your backend URL (e.g., `https://uniengage-backend.onrender.com`)

### Option B: Manual Web Service Deployment

If you prefer not to use the Blueprint:

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `UniEngage` repository
   - Configure the service:
     - **Name**: `uniengage-backend`
     - **Region**: Choose your preferred region
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

2. **Add Environment Variables**
   - Scroll down to "Environment Variables"
   - Add the following:
     - `MONGO_URI` = Your MongoDB Atlas connection string
     - `JWT_SECRET` = A secure random string (e.g., generate one at https://randomkeygen.com/)
     - `NODE_ENV` = `production`

3. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

## Step 3: Test Your Deployed Backend

1. **Check Deployment Logs**
   - In Render dashboard, click on your service
   - Go to "Logs" tab
   - Verify you see "MongoDB Connected" and "Server running on port..."

2. **Test the API**
   - Open your browser or use a tool like Postman
   - Test the login endpoint:
     ```
     POST https://your-backend-url.onrender.com/api/auth/login
     Body (JSON):
     {
       "email": "admin@gmu.edu",
       "password": "Admin@123"
     }
     ```
   - You should receive a JWT token if successful

## Step 4: Update Frontend to Use Production Backend

1. **Update API Base URL**
   - Open `frontend/Project/src/` and find where API calls are made
   - Look for API configuration (usually in a config file or at the top of API files)
   - Update the base URL from `http://localhost:5000` to your Render URL
   - Example:
     ```javascript
     const API_BASE_URL = 'https://your-backend-url.onrender.com';
     ```

2. **Test the Connection**
   - Run your frontend locally
   - Try logging in to verify it connects to the production backend

## Important Notes

> [!WARNING]
> **Free Tier Limitations**
> - Render's free tier instances spin down after 15 minutes of inactivity
> - The first request after inactivity may take 30-60 seconds to respond
> - Consider upgrading to a paid plan for production use

> [!TIP]
> **Auto-Deploy on Git Push**
> - With auto-deploy enabled, any push to your `main` branch will trigger a new deployment
> - Use this for continuous deployment

> [!IMPORTANT]
> **Environment Variables**
> - Never commit your `.env` file to GitHub
> - Always use Render's environment variable settings for sensitive data
> - Keep your MongoDB password secure

## Troubleshooting

### Deployment Fails
- Check Render logs for error messages
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is correct (including password)

### MongoDB Connection Errors
- Verify Network Access allows `0.0.0.0/0` in MongoDB Atlas
- Double-check the connection string format
- Ensure the database user has correct permissions

### API Not Responding
- Check if the Render service is running in the dashboard
- Verify the service URL is correct
- Check deployment logs for errors

## Next Steps

1. Deploy the frontend to a hosting service (Vercel, Netlify, or Render)
2. Update CORS settings in the backend to allow your frontend domain
3. Set up custom domains for both frontend and backend
4. Consider upgrading to paid tiers for better performance

## Support

If you encounter issues:
- Check Render documentation: https://render.com/docs
- Check MongoDB Atlas documentation: https://docs.atlas.mongodb.com
- Review the deployment logs carefully
