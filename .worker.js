export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Redirect http -> https
    if (url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    // Serve static assets
    return env.ASSETS.fetch(request);
  },
};
