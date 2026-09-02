export function viatorAffiliateUrl(productUrl: string, campaign?: string) {
  const url = new URL(productUrl);
  const pid = process.env.VIATOR_AFFILIATE_PID;
  const mcid = process.env.VIATOR_AFFILIATE_MCID;

  // Product URLs returned by the API can contain API-specific query parameters.
  // Start clean so Viator receives an ordinary affiliate deep link to this exact
  // product rather than an API/content link that may fall back to discovery.
  url.search = "";
  if (pid) url.searchParams.set("pid", pid);
  if (mcid) url.searchParams.set("mcid", mcid);
  if (pid || mcid) url.searchParams.set("medium", "link");
  if (campaign) url.searchParams.set("campaign", campaign);

  return url.toString();
}
