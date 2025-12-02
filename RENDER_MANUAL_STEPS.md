# Render Deployment Configuration - Manual Steps

## ✅ Completed Automatically

1. **Updated render.yaml** with:
   - `rootDir: backend` - Points to backend folder as root
   - `buildCommand: npm install` - Build command
   - `startCommand: npm start` - Start command  
   - `nodeVersion: 18` - Node.js version specification
   - All environment variables configured

2. **Pushed to GitHub** - Changes are live in the repository

3. **Configured in Render UI**:
   - ✅ Root Directory: `backend`
   - ✅ Build Command: `npm install`
   - ✅ Start Command: `npm start`

## 🔧 Manual Steps Required

Please complete these final steps in your Render dashboard (https://dashboard.render.com):

### Step 1: Set Node.js Version
1. On the UniEngage-2 service page, go to **Settings** tab
2. Scroll to find **"Node Version"** or **"Runtime"** section
3. Click **Edit** next to Node Version
4. Enter: `18`
5. Click **Save Changes**

### Step 2: Trigger Deployment
1. Go to the main service page (click "Events" tab or service name)
2. Click **"Manual Deploy"** button (top right)
3. Select **"Deploy latest commit"**
4. Click **Deploy**

### Step 3: Monitor Deployment
Watch the deployment logs. You should see:
- ✅ Using Node 18.x
- ✅ Found package.json in backend folder
- ✅ npm install succeeded  
- ✅ npm start running
- ✅ "Server running on port XXXX"
- ✅ "MongoDB Connected: ..."

### Step 4: Get Service URL
Once deployment status shows **"Live"**:
- Copy the service URL from the top of the page
- It should be: `https://uniengage-2.onrender.com` or similar

## Expected Result

Once deployed successfully, your backend will be:
- ✅ Running on Node.js 18.x
- ✅ Using the backend folder as root
- ✅ npm install runs correctly
- ✅ npm start launches the server
- ✅ Connected to MongoDB
- ✅ Accessible via the Render URL

## Troubleshooting

If deployment fails:
1. Check logs for specific error messages
2. Verify MongoDB connection string is set in environment variables
3. Ensure JWT_SECRET is set
4. Check that all dependencies are in package.json

Let me know when deployment is complete and I'll verify the backend is working!
