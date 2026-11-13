/**
 * Cloudflare Worker: Giữ ấm Supabase Database mỗi sáng lúc 07:00 ICT
 * Cron expression: 0 0 * * * (00:00 UTC tương đương 07:00 Giờ Việt Nam)
 */

export default {
  async scheduled(event, env, ctx) {
    const targetUrl = env.HEALTH_CHECK_URL || 'https://quenha-internal.vercel.app/api/cron/health';
    const cronSecret = env.CRON_SECRET || 'quenha_internal_cron_secret_secure_key_2026';

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'x-cron-secret': cronSecret,
          'User-Agent': 'QueNha-Cloudflare-Cron-Keeper/1.0',
        },
      });

      const data = await response.json();
      console.log(`[Health Cron] Status: ${response.status}`, data);
    } catch (err) {
      console.error('[Health Cron] Failed to ping:', err);
    }
  },

  async fetch(request, env, ctx) {
    return new Response('Que Nha Supabase Keeper Worker is active. Next scheduled trigger: 07:00 ICT daily.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  },
};
