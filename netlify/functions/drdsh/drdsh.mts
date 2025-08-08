import { Context } from '@netlify/functions'
import { StatsigOnDeviceEvalClient, StatsigSpecsDataAdapter } from '@statsig/js-on-device-eval-client';

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

    client.logEvent('drdsh_redirect', user, request.url);
    await client.flush();

    return new Response(null,{
      status: 301,
      headers: {
        Location: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    });
  } catch (error) {
    return new Response(error.toString(), {
      status: 301,
      headers: {
        Location: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    });
  }
}
