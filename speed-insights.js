// Import and initialize Vercel Speed Insights
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights
// This will automatically track page performance metrics
// and send them to your Vercel dashboard when deployed
injectSpeedInsights();
