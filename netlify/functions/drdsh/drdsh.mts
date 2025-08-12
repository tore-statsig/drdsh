import { Context } from '@netlify/functions'
import { StatsigOnDeviceEvalClient, StatsigSpecsDataAdapter } from '@statsig/js-on-device-eval-client';
import { readFileSync } from 'fs';
import { join } from 'path';

const config = '{"dynamic_configs":[],"feature_gates":[],"layers":{},"layer_configs":[],"has_updates":true,"time":1754608437048,"company_id":"1uYITXXXQ194aXOL4EqtF7","response_format":"dcs-v1","session_replay_info":{"sampling_rate":1,"recording_blocked":false},"id_lists":{},"diagnostics":{"initialize":10000,"dcs":1000,"download_config_specs":1000,"idlist":100,"get_id_list":100,"get_id_list_sources":100,"log":100,"log_event":100,"api_call":100},"sdk_flags":{},"sdk_configs":{"event_queue_size":2000,"event_content_encoding":"gzip","sampling_mode":"none"}}';

export default async (request: Request, context: Context) => {
  try {
    const requestID = crypto.randomUUID();
    const user = { customIDs: { requestID } };
    const start = performance.now();

    const client = new StatsigOnDeviceEvalClient(
        'client-UJkQ3iTA4F89BoFfihUgroEvfdntf5yeb7mlUzego3c',
        {
            loggingEnabled: 'always',
        }
    );
    client.dataAdapter.setData(config);
    client.initializeSync({
        disableBackgroundCacheRefresh: true,
    });

    // Check if this is the root path
    const url = new URL(request.url);
    const isRootPath = url.pathname === '/' || url.pathname === '';
    
    if (isRootPath) {
      // Serve the static HTML page for root path
      try {
        const htmlPath = join(process.cwd(), 'index.html');
        const html = readFileSync(htmlPath, 'utf-8');
        
        client.logEvent('drdsh_homepage_view', user, request.url);
        await client.flush();
        
        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        });
      } catch (fileError) {
        // If file read fails, fall back to redirect
        console.error('Failed to read index.html:', fileError);
        client.logEvent('drdsh_redirect', user, request.url);
        await client.flush();

        return new Response(null, {
          status: 301,
          headers: {
            Location: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          },
        });
      }
    } else {
      // For all other paths, serve the redirect HTML page with controlled meta tags
      try {
        const redirectPath = join(process.cwd(), 'redirect.html');
        const redirectHTML = readFileSync(redirectPath, 'utf-8');
        
        client.logEvent('drdsh_redirect', user, request.url);
        await client.flush();

        return new Response(redirectHTML, {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        });
      } catch (fileError) {
        // If redirect.html read fails, fall back to direct redirect
        console.error('Failed to read redirect.html:', fileError);
        client.logEvent('drdsh_redirect', user, request.url);
        await client.flush();

        return new Response(null, {
          status: 301,
          headers: {
            Location: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          },
        });
      }
    }
  } catch (error) {
    // If there's an error, fall back to direct redirect
    return new Response(null, {
      status: 301,
      headers: {
        Location: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    });
  }
}
