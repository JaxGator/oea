import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface StatusResponse {
  status: {
    indicator: string;
    description: string;
  };
}

async function checkGitHubStatus(): Promise<StatusResponse> {
  try {
    const response = await fetch('https://www.githubstatus.com/api/v2/status.json');
    return await response.json();
  } catch (error) {
    console.error('GitHub status check failed:', error);
    return {
      status: {
        indicator: 'error',
        description: 'Unable to fetch GitHub status'
      }
    };
  }
}

async function checkNetlifyStatus(): Promise<StatusResponse> {
  try {
    const response = await fetch('https://www.netlifystatus.com/api/v2/status.json');
    return await response.json();
  } catch (error) {
    console.error('Netlify status check failed:', error);
    return {
      status: {
        indicator: 'error',
        description: 'Unable to fetch Netlify status'
      }
    };
  }
}

async function checkLovableStatus(): Promise<StatusResponse> {
  try {
    const response = await fetch('https://lovable.dev/health');
    if (!response.ok) throw new Error('Lovable health check failed');
    
    return {
      status: {
        indicator: 'operational',
        description: 'Systems operational'
      }
    };
  } catch (error) {
    console.error('Lovable status check failed:', error);
    return {
      status: {
        indicator: 'error',
        description: 'Unable to fetch Lovable status'
      }
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting service status checks...');
    
    const startTime = performance.now();
    const [github, netlify, lovable] = await Promise.all([
      checkGitHubStatus(),
      checkNetlifyStatus(),
      checkLovableStatus()
    ]);
    const endTime = performance.now();

    const response = {
      github: {
        status: github.status.indicator === 'none' ? 'healthy' : 'error',
        latency: Math.round(endTime - startTime),
        error: github.status.indicator !== 'none' ? github.status.description : undefined
      },
      netlify: {
        status: netlify.status.indicator === 'none' ? 'healthy' : 'error',
        latency: Math.round(endTime - startTime),
        error: netlify.status.indicator !== 'none' ? netlify.status.description : undefined
      },
      lovable: {
        status: lovable.status.indicator === 'operational' ? 'healthy' : 'error',
        latency: Math.round(endTime - startTime),
        error: lovable.status.indicator !== 'operational' ? lovable.status.description : undefined
      }
    };

    console.log('Service status checks completed:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Service status check failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})