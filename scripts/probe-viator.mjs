const apiKey = process.env.VIATOR_API_KEY;

if (!apiKey) {
  console.log("VIATOR_PROBE configured=false");
  process.exit(0);
}

const headers = {
  "Accept-Language": "en-US",
  Accept: "application/json;version=2.0",
  "exp-api-key": apiKey,
};

async function probe(label, url) {
  try {
    const response = await fetch(url, { headers });
    console.log(`VIATOR_PROBE ${label}=${response.status}`);
  } catch {
    console.log(`VIATOR_PROBE ${label}=network-error`);
  }
}

await Promise.all([
  probe("production", "https://api.viator.com/partner/products/46406P1"),
  probe("sandbox", "https://api.sandbox.viator.com/partner/products/46406P1"),
]);
