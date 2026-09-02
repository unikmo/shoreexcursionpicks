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
      productCodes: ["11252P31", "426735P15"],
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
      productCodes: ["107493P50", "11252P43", "62963P78", "62963P3"],
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
  barcelona: [
    {
      conceptTitle: "Sagrada Família & Gaudí highlights",
      productCodes: ["16168P10", "3731P214", "9866P20"],
    },
    {
      conceptTitle: "Gothic Quarter food walk",
      productCodes: ["16168P1", "6172P11", "25359P4"],
    },
    {
      conceptTitle: "Private Barcelona highlights drive",
      productCodes: ["2148SP001LF", "5689P12", "383905P8"],
    },
    {
      conceptTitle: "Montserrat monastery escape",
      productCodes: ["5716P4", "5716GOLFWINE"],
    },
    {
      conceptTitle: "Modernist architecture beyond Gaudí",
      productCodes: ["17377P55", "7173P9", "211674P1"],
    },
    {
      conceptTitle: "Barcelona vermouth workshop",
      productCodes: ["361486P2", "3394P17", "224689P4"],
    },
  ],
};

export function getCuratedViatorSet(portSlug: string) {
  return curatedViatorProducts[portSlug];
}
