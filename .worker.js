export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Redirect http -> https
    const cfIp = request.headers.get('cf-connecting-ip');
    const isDevEnvironment = cfIp === '127.0.0.1' || cfIp === '::1';
    if (url.protocol === 'http:' && !isDevEnvironment) {
      return new Response(null, {
        status: 301,
        headers: {
          'Location': `https://${url.host}${url.pathname}${url.search}`
        }
      });
    }

    // Serve static assets
    return env.ASSETS.fetch(request);
  },
};
