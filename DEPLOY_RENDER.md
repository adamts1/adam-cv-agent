# Deploying to Render

This guide will walk you through deploying your Adam CV Agent to Render.

## Prerequisites

Before deploying, make sure you have:

1. A [Render account](https://render.com) (free tier available)
2. Your OpenAI API key
3. Your Pinecone API key and index configuration
4. This repository pushed to GitHub/GitLab

## Deployment Options

You can deploy to Render in two ways:

### Option 1: Using render.yaml (Recommended)

This is the easiest method as it uses the included `render.yaml` configuration file.

1. **Push your code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub/GitLab account if you haven't already
   - Select this repository
   - Render will automatically detect the `render.yaml` file

3. **Set Environment Variables**
   
   Render will prompt you to set the following environment variables:
   
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `PINECONE_API_KEY` - Your Pinecone API key
   - `PINECONE_INDEX_NAME` - Your Pinecone index name (e.g., "adam-cv-agent")
   - `PINECONE_ENVIRONMENT` - Your Pinecone environment (e.g., "us-east-1-aws")
   
   **Note**: The `NODE_ENV` and `PORT` are already configured in the render.yaml.

4. **Deploy**
   - Click "Apply" to create the service
   - Render will:
     - Install dependencies
     - Build your frontend (Vite)
     - Compile your TypeScript backend
     - Initialize your Pinecone vectors (run setup:all)
     - Start your server

5. **Access Your App**
   - Once deployment is complete, Render will provide you with a URL like:
     `https://adam-cv-agent.onrender.com`

### Option 2: Manual Setup

If you prefer to configure manually:

1. **Create a New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your repository

2. **Configure the Service**
   - **Name**: adam-cv-agent (or your preferred name)
   - **Runtime**: Node
   - **Branch**: main
   - **Build Command**: 
     ```
     npm install && npm run build && npm run setup:all
     ```
   - **Start Command**: 
     ```
     npm start
     ```

3. **Set Environment Variables**
   
   In the "Environment" section, add:
   
   | Key | Value | Notes |
   |-----|-------|-------|
   | `NODE_ENV` | `production` | Required |
   | `PORT` | Auto-assigned by Render | Leave empty, Render will set this |
   | `OPENAI_API_KEY` | Your OpenAI key | Required |
   | `PINECONE_API_KEY` | Your Pinecone key | Required |
   | `PINECONE_INDEX_NAME` | Your index name | Required |
   | `PINECONE_ENVIRONMENT` | Your Pinecone env | Required |

4. **Select Plan**
   - Choose the Free plan to start (or a paid plan for better performance)

5. **Deploy**
   - Click "Create Web Service"

## Important Notes

### First Deployment

The first deployment may take 5-10 minutes because:
1. Dependencies need to be installed
2. Frontend needs to be built
3. Backend needs to be compiled
4. Pinecone vectors need to be initialized (`setup:all` script)

### Subsequent Deployments

Render will automatically redeploy when you push to your main branch. The vector setup will run each time, which ensures your data is always up to date.

### Free Tier Limitations

If using Render's free tier:
- Your service will spin down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds (cold start)
- Consider upgrading to a paid plan for production use

### Pinecone Index

Make sure your Pinecone index exists before deploying. If not, the build will fail during the `setup:all` step.

You can create it locally first:
```bash
npm run setup:career
npm run setup:funfacts
```

Or create an empty index in the Pinecone dashboard and let the deployment populate it.

## Troubleshooting

### Build Fails

If the build fails, check the Render logs for errors. Common issues:

1. **Missing environment variables** - Make sure all required env vars are set
2. **Pinecone connection fails** - Verify your Pinecone API key and index name
3. **TypeScript compilation errors** - Check that your code compiles locally with `npm run build`

### App Won't Start

Check the Render logs for startup errors:

```bash
# In Render dashboard, go to your service → Logs
```

Common issues:
- Port binding issues (make sure PORT env var is not hardcoded)
- Missing dependencies (clear build cache and redeploy)

### API Calls Failing

If the frontend loads but API calls fail:
1. Check that environment variables are set correctly
2. Verify the `/health` endpoint works: `https://your-app.onrender.com/health`
3. Check browser console for CORS errors

## Updating Environment Variables

To update environment variables after deployment:

1. Go to your service in Render Dashboard
2. Click "Environment" in the left sidebar
3. Update the variables
4. Click "Save Changes"
5. Your service will automatically redeploy

## Custom Domain

To use a custom domain:

1. Go to your service → "Settings"
2. Scroll to "Custom Domain"
3. Add your domain
4. Update your DNS records as instructed by Render

## Monitoring

Render provides:
- **Logs**: Real-time logs of your application
- **Metrics**: CPU, Memory, and Request metrics
- **Events**: Deployment and service events

Access these from your service dashboard.

## Support

If you encounter issues:

1. Check [Render Documentation](https://render.com/docs)
2. Check Render Status Page
3. Contact Render Support (available on paid plans)

## Local Testing of Production Build

Before deploying, test the production build locally:

```bash
# Build the application
npm run build

# Start in production mode
npm start
```

Then visit `http://localhost:3001` to test the production build.

## Next Steps

After successful deployment:

1. ✅ Test all functionality
2. ✅ Set up monitoring/alerts (if needed)
3. ✅ Configure custom domain (optional)
4. ✅ Set up automatic backups for Pinecone data (optional)
5. ✅ Consider upgrading to paid tier for better performance

---

**Your app should now be live! 🚀**

