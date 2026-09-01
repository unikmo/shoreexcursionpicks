export type CuratedViatorSlot = {
  conceptTitle: string;
  productCodes: readonly string[];
};

export type CuratedViatorSet = readonly [
  CuratedViatorSlot,
  CuratedViatorSlot,
  CuratedViatorSlot,
  CuratedViatorSlot,
  CuratedViatorSlot,
  CuratedViatorSlot,
];

/**
 * Exact Viator products approved for merchandising on each port page.
 *
 * Product discovery is deliberately separated from the customer request path:
 * visitors never receive a generic Viator search result. Each slot resolves only
 * against the product codes listed here, in order, so backup codes can be added
 * later without changing the 3 + 3 page promise.
 */
const curatedViatorProducts: Record<string, CuratedViatorSet> = {
  roatan: [
    {
      conceptTitle: "Sloth sanctuary & island highlights",
      productCodes: ["11252P31"],
    },
    {
      conceptTitle: "West Bay reef snorkel & beach",
      productCodes: ["426735P14"],
    },
    {
      conceptTitle: "Custom private driver tour",
      productCodes: ["39620P6"],
    },
    {
      conceptTitle: "Garifuna culture in Punta Gorda",
      productCodes: ["107493P50"],
    },
    {
      conceptTitle: "Mangrove tunnel boat trip",
      productCodes: ["236968P2"],
    },
    {
      conceptTitle: "Roatán craft brewery & food tasting",
      productCodes: ["236968P29"],
    },
  ],
};

export function getCuratedViatorSet(portSlug: string) {
  return curatedViatorProducts[portSlug];
}
