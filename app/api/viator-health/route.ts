import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.VIATOR_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ configured: false, reachable: false, reason: "VIATOR_API_KEY is not configured." });
  }

  try {
    const response = await fetch("https://api.viator.com/partner/products/46406P1", {
      headers: {
        "Accept-Language": "en-US",
        Accept: "application/json;version=2.0",
        "exp-api-key": apiKey,
      },
      cache: "no-store",
    });

    return NextResponse.json({
      configured: true,
      reachable: response.ok,
      status: response.status,
    });
  } catch {
    return NextResponse.json({ configured: true, reachable: false, reason: "Request failed." });
  }
}
