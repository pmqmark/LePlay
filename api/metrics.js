export default async function handler(req, res) {
  const BASE_URL = 'http://zenon-alb-staging-1894668587.ap-south-1.elb.amazonaws.com/api/v1/metrics';
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Extract the metric path (e.g., /average-wait-times)
    const metricPath = req.url.split('?')[0].replace('/api/metrics', '');
    const url = new URL(`${BASE_URL}${metricPath}`);
    
    // Forward query parameters
    if (req.url.includes('?')) {
      url.search = req.url.split('?')[1];
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
    });
    
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Proxy request failed' });
  }
}
