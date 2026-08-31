export type PortGuideDetail = {
  history: string;
  importantPlaces: readonly [string, string, string];
  latitude: number;
  longitude: number;
};

// Coordinates are approximate port/city centres and are used only to sort nearby guide suggestions.
export const portGuideDetails: Record<string, PortGuideDetail> = {
  nassau: {
    history: "Nassau grew from a colonial harbour into the political and commercial centre of The Bahamas; its forts, old town and Junkanoo traditions still frame the port day.",
    importantPlaces: ["Paradise Island", "Rose Island", "Clifton Heritage Park"],
    latitude: 25.078,
    longitude: -77.338,
  },
  cozumel: {
    history: "Cozumel has Maya roots and later developed around fishing and trade before tourism and cruise travel transformed San Miguel and the island waterfront.",
    importantPlaces: ["Palancar & Colombia Reefs", "El Cielo", "Punta Sur"],
    latitude: 20.423,
    longitude: -86.922,
  },
  roatan: {
    history: "Roatán’s story combines Indigenous settlement, colonial rivalry, Afro-Caribbean communities and Garifuna culture; today the reef and coastal villages remain central to the island’s identity.",
    importantPlaces: ["West Bay", "Punta Gorda", "East End mangroves"],
    latitude: 16.315,
    longitude: -86.537,
  },
  "costa-maya": {
    history: "Costa Maya is a modern cruise gateway on Mexico’s Caribbean coast, close to ancient Maya sites and the fishing village of Mahahual.",
    importantPlaces: ["Chacchoben", "Bacalar Lagoon", "Mahahual"],
    latitude: 18.714,
    longitude: -87.709,
  },
  "san-juan": {
    history: "Founded in the Spanish colonial era, San Juan became a fortified Caribbean port; Old San Juan preserves its walls, forts and colourful historic core.",
    importantPlaces: ["Old San Juan", "El Yunque National Forest", "Santurce"],
    latitude: 18.466,
    longitude: -66.105,
  },
  "st-thomas": {
    history: "Charlotte Amalie developed as a Danish Caribbean trading port; historic streets and harbour fortifications now sit alongside beaches and modern cruise docks.",
    importantPlaces: ["Magens Bay", "Charlotte Amalie", "St. John"],
    latitude: 18.341,
    longitude: -64.93,
  },
  "st-maarten": {
    history: "The island’s Dutch and French sides reflect centuries of European rivalry and shared Caribbean culture; Philipsburg became the main cruise gateway on the Dutch side.",
    importantPlaces: ["Maho Beach", "Marigot", "Grand Case"],
    latitude: 18.041,
    longitude: -63.108,
  },
  "grand-cayman": {
    history: "George Town grew as the commercial centre of the Cayman Islands, whose maritime history, seafaring traditions and coral coastline remain central to the visitor experience.",
    importantPlaces: ["Stingray City", "Seven Mile Beach", "East End"],
    latitude: 19.286,
    longitude: -81.367,
  },
  "puerto-plata": {
    history: "Puerto Plata is one of the Dominican Republic’s oldest Atlantic ports, with Victorian-era architecture, rum and amber traditions, and a mountain-backed coastline.",
    importantPlaces: ["27 Waterfalls of Damajagua", "Mount Isabel de Torres", "Historic Puerto Plata"],
    latitude: 19.794,
    longitude: -70.689,
  },
  "ocho-rios": {
    history: "Once a fishing and banana-shipping town, Ocho Rios grew into a major resort and cruise port around Jamaica’s waterfalls, rivers and north-coast scenery.",
    importantPlaces: ["Dunn’s River Falls", "Blue Hole", "White River"],
    latitude: 18.407,
    longitude: -77.103,
  },
  bridgetown: {
    history: "Bridgetown developed as a British colonial port and commercial centre; its historic core and garrison are UNESCO-listed and connect directly to Barbados’s maritime story.",
    importantPlaces: ["Carlisle Bay", "Historic Bridgetown & Garrison", "Bathsheba"],
    latitude: 13.097,
    longitude: -59.616,
  },
  castries: {
    history: "Castries grew around a sheltered harbour that became Saint Lucia’s commercial centre; the island’s colonial history and volcanic landscape shape excursions beyond the port.",
    importantPlaces: ["The Pitons & Soufrière", "Castries Market", "Tet Paul Nature Trail"],
    latitude: 14.01,
    longitude: -60.99,
  },
  barcelona: {
    history: "Barcelona’s Mediterranean port has served commerce for centuries; Roman origins, medieval quarters and the modernist expansion give the city unusually layered history.",
    importantPlaces: ["Sagrada Família", "Gothic Quarter", "Montserrat"],
    latitude: 41.353,
    longitude: 2.169,
  },
  "civitavecchia-rome": {
    history: "Civitavecchia has long served as Rome’s maritime gateway, with its harbour historically tied to the capital; most cruise visits use it as the launch point for Rome.",
    importantPlaces: ["Colosseum & Roman Forum", "Vatican City", "Cerveteri"],
    latitude: 42.092,
    longitude: 11.795,
  },
  "livorno-florence": {
    history: "Livorno was developed as a major Tuscan port and free-port city, becoming a cosmopolitan maritime gateway to Florence, Pisa and the wider region.",
    importantPlaces: ["Florence historic centre", "Pisa", "Livorno’s Venezia Nuova"],
    latitude: 43.548,
    longitude: 10.307,
  },
  naples: {
    history: "Naples is one of Europe’s oldest continuously inhabited urban centres, shaped by Greek, Roman and later Mediterranean powers; its bay links the city to Pompeii and Vesuvius.",
    importantPlaces: ["Pompeii", "Historic Naples", "Mount Vesuvius"],
    latitude: 40.84,
    longitude: 14.259,
  },
  marseille: {
    history: "Founded by Greek settlers, Marseille is France’s oldest major city and a historic Mediterranean port whose Vieux-Port still anchors the urban core.",
    importantPlaces: ["Vieux-Port", "Calanques National Park", "Le Panier"],
    latitude: 43.296,
    longitude: 5.369,
  },
  "palma-de-mallorca": {
    history: "Palma’s history reflects Roman, Islamic and Christian rule, visible in the old city around the cathedral and the Almudaina palace.",
    importantPlaces: ["Palma Cathedral", "Palma Old Town", "Bellver Castle"],
    latitude: 39.555,
    longitude: 2.626,
  },
  "athens-piraeus": {
    history: "Piraeus has served as Athens’ port since antiquity; today it remains the maritime gateway to the Greek capital and its classical sites.",
    importantPlaces: ["Acropolis", "Plaka", "Ancient Agora"],
    latitude: 37.942,
    longitude: 23.646,
  },
  santorini: {
    history: "Santorini’s settlements sit on the rim of a volcanic caldera shaped by one of the ancient Mediterranean’s most powerful eruptions; whitewashed villages now frame the cruise arrival.",
    importantPlaces: ["Oia", "Fira", "Akrotiri"],
    latitude: 36.416,
    longitude: 25.431,
  },
  mykonos: {
    history: "Mykonos grew from a Cycladic island community into an international travel destination, while nearby Delos preserves one of Greece’s most important ancient sacred sites.",
    importantPlaces: ["Mykonos Town", "Delos", "Ano Mera"],
    latitude: 37.446,
    longitude: 25.329,
  },
  dubrovnik: {
    history: "Dubrovnik was the centre of the maritime Republic of Ragusa, a wealthy Adriatic trading state whose walls and old town remain exceptionally intact.",
    importantPlaces: ["Dubrovnik Old Town", "City Walls", "Mount Srđ"],
    latitude: 42.65,
    longitude: 18.086,
  },
  split: {
    history: "Split grew around the late-Roman palace of Emperor Diocletian, whose structures became part of the living medieval and modern city.",
    importantPlaces: ["Diocletian’s Palace", "Marjan Hill", "Trogir"],
    latitude: 43.508,
    longitude: 16.44,
  },
  kotor: {
    history: "Kotor developed as a fortified Adriatic trading town under multiple rulers; its old town and bay are part of a UNESCO-listed cultural landscape.",
    importantPlaces: ["Kotor Old Town", "Perast", "Our Lady of the Rocks"],
    latitude: 42.424,
    longitude: 18.771,
  },
  corfu: {
    history: "Corfu’s strategic position at the entrance to the Adriatic brought Venetian, French and British influence, visible in its fortresses and elegant old town.",
    importantPlaces: ["Corfu Old Town", "Paleokastritsa", "Achilleion"],
    latitude: 39.624,
    longitude: 19.922,
  },
  "kusadasi-ephesus": {
    history: "Kuşadası is a modern Aegean port near Ephesus, one of the best-preserved ancient cities of the eastern Mediterranean and the main historical draw for cruise visitors.",
    importantPlaces: ["Ephesus", "Terrace Houses", "House of the Virgin Mary"],
    latitude: 37.86,
    longitude: 27.257,
  },
  valletta: {
    history: "Valletta was built by the Knights of St John after the Great Siege of 1565, creating a fortified harbour city dense with Baroque architecture.",
    importantPlaces: ["St John’s Co-Cathedral", "Mdina", "Three Cities"],
    latitude: 35.899,
    longitude: 14.514,
  },
  "messina-taormina": {
    history: "Messina has long guarded the strait between Sicily and mainland Italy; repeated earthquakes reshaped the city, while nearby Taormina preserves Greek and Roman heritage above the Ionian coast.",
    importantPlaces: ["Taormina Greek Theatre", "Messina Cathedral", "Mount Etna"],
    latitude: 38.193,
    longitude: 15.555,
  },
  juneau: {
    history: "Juneau grew during the late-19th-century Alaska gold rush and became the state capital; its waterfront now opens directly to glaciers, mountains and whale-rich channels.",
    importantPlaces: ["Mendenhall Glacier", "Nugget Falls", "Mount Roberts"],
    latitude: 58.301,
    longitude: -134.42,
  },
  ketchikan: {
    history: "Ketchikan developed around fishing, canneries and timber and is also a gateway to Tlingit, Haida and Tsimshian cultural heritage in Southeast Alaska.",
    importantPlaces: ["Creek Street", "Misty Fjords", "Totem Bight"],
    latitude: 55.342,
    longitude: -131.647,
  },
  skagway: {
    history: "Skagway boomed during the Klondike Gold Rush as a gateway to the White Pass trail; much of its historic centre preserves that frontier-era story.",
    importantPlaces: ["White Pass", "Klondike Gold Rush historic district", "Dyea"],
    latitude: 59.458,
    longitude: -135.314,
  },
  sitka: {
    history: "Sitka reflects deep Tlingit history as well as Russian colonial rule; it later became the site of the 1867 transfer of Alaska to the United States.",
    importantPlaces: ["Sitka National Historical Park", "St. Michael’s Cathedral", "Sitka Sound"],
    latitude: 57.053,
    longitude: -135.33,
  },
  "icy-strait-point": {
    history: "Icy Strait Point was developed from a historic salmon cannery near the Tlingit community of Hoonah and is now a locally rooted cruise destination focused on wildlife and culture.",
    importantPlaces: ["Hoonah", "Historic Cannery", "Icy Strait"],
    latitude: 58.129,
    longitude: -135.462,
  },
  "cabo-san-lucas": {
    history: "Cabo San Lucas grew from a fishing community into a resort and cruise stop at the meeting point of the Pacific Ocean and the Sea of Cortez.",
    importantPlaces: ["Land’s End & The Arch", "Médano Beach", "San José del Cabo"],
    latitude: 22.89,
    longitude: -109.916,
  },
  "puerto-vallarta": {
    history: "Puerto Vallarta developed from a small Pacific port into a major resort city, retaining a walkable historic centre along the Río Cuale and Malecón.",
    importantPlaces: ["Malecón", "Zona Romántica", "Marietas Islands"],
    latitude: 20.657,
    longitude: -105.241,
  },
  "cartagena-colombia": {
    history: "Cartagena was a major Spanish colonial port fortified against attack; its walled city, Caribbean architecture and Afro-Colombian heritage remain central to the experience.",
    importantPlaces: ["Walled City", "Getsemaní", "Castillo San Felipe"],
    latitude: 10.391,
    longitude: -75.514,
  },
  copenhagen: {
    history: "Copenhagen grew from a medieval harbour into Denmark’s capital and a major Baltic trading city; royal, maritime and modern design layers sit close together.",
    importantPlaces: ["Nyhavn", "Rosenborg Castle", "Christiansborg Palace"],
    latitude: 55.692,
    longitude: 12.599,
  },
  stockholm: {
    history: "Stockholm developed across islands at a strategic Baltic trade point; Gamla Stan preserves the medieval core while museums trace Sweden’s maritime power.",
    importantPlaces: ["Gamla Stan", "Vasa Museum", "Djurgården"],
    latitude: 59.329,
    longitude: 18.068,
  },
  tallinn: {
    history: "Tallinn was a Hanseatic trading city whose remarkably preserved medieval walls, streets and merchant houses define the old town.",
    importantPlaces: ["Tallinn Old Town", "Toompea", "Kadriorg"],
    latitude: 59.444,
    longitude: 24.768,
  },
  bergen: {
    history: "Bergen was a medieval Norwegian capital and later a major Hanseatic trading port; Bryggen’s timber warehouses remain its best-known historic landmark.",
    importantPlaces: ["Bryggen", "Fløibanen", "Fish Market"],
    latitude: 60.392,
    longitude: 5.322,
  },
  geiranger: {
    history: "Geiranger is a small fjord community whose modern visitor economy grew around the dramatic UNESCO-listed West Norwegian Fjords landscape.",
    importantPlaces: ["Seven Sisters waterfall", "Flydalsjuvet", "Dalsnibba"],
    latitude: 62.101,
    longitude: 7.205,
  },
  reykjavik: {
    history: "Reykjavík grew from Iceland’s earliest permanent settlement into the national capital; its harbour links the compact city to volcanic, geothermal and coastal landscapes.",
    importantPlaces: ["Hallgrímskirkja", "Golden Circle", "Old Harbour"],
    latitude: 64.152,
    longitude: -21.94,
  },
  belfast: {
    history: "Belfast expanded rapidly through linen, engineering and shipbuilding; the Titanic story and the city’s more recent political history are key parts of its identity.",
    importantPlaces: ["Titanic Belfast", "Belfast City Hall", "Giant’s Causeway"],
    latitude: 54.61,
    longitude: -5.909,
  },
  "le-havre-paris": {
    history: "Le Havre was founded as a French Atlantic port and was extensively rebuilt after World War II; its modernist centre is UNESCO-listed, while many cruise calls continue into Normandy or Paris.",
    importantPlaces: ["Auguste Perret city centre", "Étretat", "Honfleur"],
    latitude: 49.494,
    longitude: 0.107,
  },
  singapore: {
    history: "Singapore grew from a 19th-century trading port into a global city-state; historic Malay, Chinese, Indian and colonial districts remain visible amid its modern skyline.",
    importantPlaces: ["Marina Bay", "Gardens by the Bay", "Chinatown & hawker centres"],
    latitude: 1.265,
    longitude: 103.82,
  },
  "tokyo-yokohama": {
    history: "Yokohama expanded after Japan opened to international trade in the 19th century and became the main cruise gateway for Tokyo and the wider capital region.",
    importantPlaces: ["Yokohama waterfront", "Asakusa", "Meiji Shrine & central Tokyo"],
    latitude: 35.454,
    longitude: 139.638,
  },
  "kobe-kyoto": {
    history: "Kobe developed as an international port after Japan opened to foreign trade; cruise calls can combine its cosmopolitan waterfront with Kyoto’s historic temples.",
    importantPlaces: ["Kobe Harborland", "Fushimi Inari", "Kiyomizu-dera"],
    latitude: 34.69,
    longitude: 135.195,
  },
  "hong-kong": {
    history: "Hong Kong’s harbour shaped its rise as a trading and financial centre; dense urban districts, markets and waterfront viewpoints reflect layers of Chinese and colonial history.",
    importantPlaces: ["Victoria Peak", "Victoria Harbour & Star Ferry", "Temple Street"],
    latitude: 22.293,
    longitude: 114.169,
  },
  phuket: {
    history: "Phuket’s wealth once came from tin mining and maritime trade; Sino-Portuguese architecture in Phuket Old Town contrasts with the island’s beaches and limestone seascapes.",
    importantPlaces: ["Phuket Old Town", "Phang Nga Bay", "Wat Chalong"],
    latitude: 7.88,
    longitude: 98.392,
  },
  sydney: {
    history: "Sydney grew around one of the world’s great natural harbours; Aboriginal heritage, colonial-era districts and 20th-century landmarks all cluster around the waterfront.",
    importantPlaces: ["Sydney Opera House", "The Rocks", "Sydney Harbour Bridge"],
    latitude: -33.858,
    longitude: 151.211,
  },
  auckland: {
    history: "Auckland sits on an isthmus shaped by Māori settlement, volcanic landscapes and later colonial growth; its harbours remain central to the city’s identity.",
    importantPlaces: ["Waiheke Island", "Mount Eden", "Viaduct Harbour"],
    latitude: -36.842,
    longitude: 174.768,
  },
  tauranga: {
    history: "Tauranga has deep Māori history and later developed as a major Bay of Plenty port; Mount Maunganui and Rotorua make it a gateway to coast and geothermal country.",
    importantPlaces: ["Mount Maunganui", "Rotorua", "Te Puia"],
    latitude: -37.686,
    longitude: 176.167,
  },
  dubai: {
    history: "Dubai grew from a Gulf trading and pearling settlement into a global city; the creek, souks and historic districts reveal the pre-skyscraper port city.",
    importantPlaces: ["Al Fahidi Historic District", "Dubai Creek & souks", "Burj Khalifa"],
    latitude: 25.27,
    longitude: 55.279,
  },
  "abu-dhabi": {
    history: "Abu Dhabi developed from a coastal settlement tied to pearling and trade into the capital of the United Arab Emirates; monumental cultural and religious sites now shape the visitor route.",
    importantPlaces: ["Sheikh Zayed Grand Mosque", "Louvre Abu Dhabi", "Qasr Al Watan"],
    latitude: 24.474,
    longitude: 54.336,
  },
  muscat: {
    history: "Muscat has long been a strategic Arabian Sea port, influenced by Omani maritime trade and periods of Portuguese control; forts and Mutrah’s waterfront preserve that history.",
    importantPlaces: ["Sultan Qaboos Grand Mosque", "Mutrah Souq", "Al Jalali & Al Mirani forts"],
    latitude: 23.621,
    longitude: 58.569,
  },
  "cape-town": {
    history: "Cape Town developed around Table Bay as a refreshment station and colonial port; its history is inseparable from Indigenous, colonial, enslaved and apartheid-era stories.",
    importantPlaces: ["Table Mountain", "Bo-Kaap", "Cape Peninsula"],
    latitude: -33.908,
    longitude: 18.421,
  },
  "port-louis": {
    history: "Port Louis grew as a French colonial harbour and later a British commercial port, bringing together African, Asian and European influences that remain visible in its markets and waterfront.",
    importantPlaces: ["Central Market", "Caudan Waterfront", "Pamplemousses Botanical Garden"],
    latitude: -20.161,
    longitude: 57.498,
  },
  "buenos-aires": {
    history: "Buenos Aires grew around the Río de la Plata as Argentina’s principal port, shaped by immigration, trade and neighbourhood cultures such as San Telmo and La Boca.",
    importantPlaces: ["Plaza de Mayo", "San Telmo", "La Boca"],
    latitude: -34.602,
    longitude: -58.371,
  },
  "rio-de-janeiro": {
    history: "Rio de Janeiro developed around Guanabara Bay and served as colonial capital, imperial capital and later national capital; mountains, beaches and monumental viewpoints define the city.",
    importantPlaces: ["Christ the Redeemer", "Sugarloaf Mountain", "Copacabana"],
    latitude: -22.898,
    longitude: -43.18,
  },
  ushuaia: {
    history: "Ushuaia grew from Indigenous Yaghan territory and a remote settlement into the world’s southernmost major cruise gateway, closely tied to Tierra del Fuego and Antarctic travel.",
    importantPlaces: ["Beagle Channel", "Tierra del Fuego National Park", "End of the World Train"],
    latitude: -54.806,
    longitude: -68.303,
  },
};

export function getPortGuideDetail(slug: string) {
  return portGuideDetails[slug];
}
