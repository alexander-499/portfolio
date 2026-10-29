interface Env {
  ABACUS_TOKEN: string;
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/abacus-counter") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

      try {
        const { value } = await request.json() as { value: unknown };
        if (!Number.isSafeInteger(value) || Math.abs(value as number) > 100) return new Response("Invalid value", { status: 400 });

        const response = await fetch(`https://abacus.jasoncameron.dev/update/alexander499.de/counter?value=${value as any}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${env.ABACUS_TOKEN}` }
        });

        if (!response.ok) return new Response("Counter update failed", { status: 502 });
        return new Response(response.body, { headers: { "Content-Type": "application/json" } });
      } catch {
        return new Response("Invalid request", { status: 400 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};