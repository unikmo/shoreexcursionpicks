import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const endpoints = {
  production: "https://api.viator.com/partner/products/46406P1",
  sandbox: "https://api.sandbox.viator.com/partner/products/46406P1",
};

async function probe(url: string, apiKey: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "Accept-Language": "en-US",
        Accept: "application/json;version=2.0",
        "exp-api-key": apiKey,
      },
      cache: "no-store",
    });

    return { reachable: response.ok, status: response.status };
  } catch {
    return { reachable: false, status: null };
  }
}

export async function GET() {
  const apiKey = process.env.VIATOR_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ configured: false, production: null, sandbox: null });
  }

  const [production, sandbox] = await Promise.all([
    probe(endpoints.production, apiKey),
    probe(endpoints.sandbox, apiKey),
  ]);

  return NextResponse.json({ configured: true, production, sandbox });
}
