const categories = ["shoes", "clothing", "accessories", "bags"];

const brands = [
  "Veltra", "Marso", "Zalune", "Nord & Co", "Lumen", "Atelier 14", "Kairos",
  "Bloom Street", "Riviera Lab", "Monoform", "Haven", "Stitch & Stone",
  "Cinder", "Northline", "Petit Atlas", "Urban Drift", "Silk & Steel",
  "Marrow", "Fable", "Driftwood", "Capsule 9", "Meridian", "Echo Park",
  "Basalt", "Softline", "Harbor", "Velour", "Tangent", "Solstice",
];

const adjectives = [
  "Classic", "Modern", "Vintage", "Urban", "Sport", "Casual", "Premium",
  "Essential", "Slim", "Bold", "Minimal", "Oversized", "Tailored", "Relaxed",
  "Structured", "Soft", "Crisp", "Matte", "Glossy", "Breathable", "Waterproof",
  "Insulated", "Lightweight", "Heritage", "Limited", "Signature", "Seasonal",
  "Recycled", "Organic", "Merino", "Linen", "Corduroy", "Technical", "Retro",
  "Monochrome", "Two-tone", "Quilted", "Ribbed", "Waxed", "Brushed", "Raw",
];

const materials = [
  "cuir pleine fleur", "toile waxee", "coton bio", "laine merinos",
  "lin europeen", "polyamide recycle", "gore-tex", "velours cotele",
  "denim japonais", "soie sauvage", "cachemire", "nylon ripstop",
  "suède vegetal", "tweed", "jersey peigne", "mesh technique",
];

const vibes = [
  "ideal pour la ville", "parfait entre deux saisons", "coupe intemporelle",
  "details soignes", "confort toute la journee", "finition premium",
  "ligne epuree", "inspiration archive", "edition limitee",
  "pense pour les trajets quotidiens", "allie style et fonction",
];

const names = {
  shoes: [
    "Sneakers", "Boots", "Loafers", "Sandals", "Oxford", "Flip Flops",
    "Slippers", "Derbies", "Chelsea Boots", "Moccasins", "Espadrilles",
    "Brogues", "Monk Straps", "Clogs", "Trail Runners", "Court Shoes",
    "High-tops", "Low-tops", "Slides", "Mules", "Wedge Sandals",
    "Hiking Boots", "Rain Boots", "Boat Shoes", "Ballet Flats", "Mary Janes",
    "Platform Sneakers", "Sock Sneakers", "Desert Boots", "Combat Boots",
    "Chukka Boots", "Penny Loafers", "Tassel Loafers", "Driving Shoes",
    "Basketball Shoes", "Tennis Shoes", "Cross-trainers", "Walking Shoes",
    "Winter Boots", "Ankle Boots", "Knee Boots", "Western Boots",
    "Studded Boots", "Velcro Sneakers", "Knit Runners", "Golf Shoes",
  ],
  clothing: [
    "T-Shirt", "Jacket", "Hoodie", "Jeans", "Shirt", "Trouser", "Blazer",
    "Cardigan", "Polo", "Tank Top", "Crop Top", "Sweatshirt", "Parka",
    "Trench Coat", "Bomber", "Denim Jacket", "Field Jacket", "Peacoat",
    "Puffer", "Gilet", "Shorts", "Chinos", "Cargo Pants", "Leggings",
    "Skirt", "Midi Dress", "Maxi Dress", "Shirt Dress", "Knit Dress",
    "Turtleneck", "Henley", "Oxford Shirt", "Flannel Shirt", "Raincoat",
    "Windbreaker", "Tracksuit", "Joggers", "Suit Trousers", "Waistcoat",
    "Romper", "Jumpsuit", "Pajama Set", "Robe", "Kimono", "Wrap Top",
    "Blouse", "Camisole", "Sweater Vest", "Cable Knit", "Quarter-zip",
  ],
  accessories: [
    "Watch", "Belt", "Cap", "Sunglasses", "Scarf", "Hat", "Gloves",
    "Tie", "Bow Tie", "Pocket Square", "Cufflinks", "Bracelet", "Necklace",
    "Earrings", "Ring", "Brooch", "Hair Clip", "Headband", "Beanie",
    "Beret", "Fedora", "Bucket Hat", "Visor", "Socks", "Tights",
    "Tights Opaque", "Leg Warmers", "Ankle Socks", "Tote Insert",
    "Keychain", "Lanyard", "Wallet Chain", "Pin Set", "Bandana",
    "Silk Square", "Winter Scarf", "Infinity Scarf", "Driving Gloves",
    "Touchscreen Gloves", "Aviator Shades", "Wayfarers", "Reading Glasses",
    "Chronograph", "Dress Watch", "Smartwatch Strap", "Watch Roll",
  ],
  bags: [
    "Backpack", "Tote", "Clutch", "Duffel", "Messenger", "Wallet", "Handbag",
    "Crossbody", "Belt Bag", "Weekender", "Gym Bag", "Laptop Sleeve",
    "Briefcase", "Satchel", "Bucket Bag", "Hobo", "Shoulder Bag",
    "Mini Bag", "Chain Bag", "Shopper", "Beach Bag", "Cooler Bag",
    "Camera Bag", "Saddle Bag", "Pouch", "Card Holder", "Coin Purse",
    "Passport Holder", "Toiletry Kit", "Garment Bag", "Rolling Suitcase",
    "Carry-on", "Packing Cubes Set", "Bike Pannier", "Dry Bag",
    "Tote Mini", "Structured Tote", "Soft Clutch", "Envelope Clutch",
    "Wristlet", "Fanny Pack", "Sling Bag", "Tactical Pack", "Daypack",
  ],
};

function pick(arr, seed) {
  return arr[Math.abs(seed) % arr.length];
}

function mixSeed(i, salt) {
  return i * 1103515245 + salt * 12345;
}

const products = [];

for (let i = 1; i <= 5000; i++) {
  const catIndex = i % categories.length;
  const category = categories[catIndex];
  const nameList = names[category];

  const s1 = mixSeed(i, 1);
  const s2 = mixSeed(i, 2);
  const s3 = mixSeed(i, 3);
  const s4 = mixSeed(i, 4);

  const brand = pick(brands, s1);
  const adj = pick(adjectives, s2);
  const baseName = pick(nameList, s3);
  const variant = pick(adjectives, s1 + s2); // second adj for some variety

  const useLongName = i % 7 !== 0;
  const name = useLongName
    ? brand + " — " + adj + " " + baseName + " (" + variant + ")"
    : adj + " " + baseName;

  const mat = pick(materials, s4);
  const vibe = pick(vibes, s1 + s4);
  const description =
    "Un(e) " +
    adj.toLowerCase() +
    " " +
    baseName.toLowerCase() +
    " (" +
    mat +
    "). " +
    vibe.charAt(0).toUpperCase() +
    vibe.slice(1) +
    ".";

  products.push({
    name,
    description,
    price: Math.round((9.99 + (i % 29) * 10 + (s2 % 17) * 0.5) * 100) / 100,
    category,
    stock: (i * 7) % 100,
    createdAt: new Date(Date.now() - i * 86400000),
  });
}

db = db.getSiblingDB("shop");
db.products.drop();
db.products.insertMany(products);
print("Seed OK - " + products.length + " produits inseres dans shop.products");
