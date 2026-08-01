import type { Currency, Product, Vendor, Category, User, AIInsight } from "./types";

export const BRAND_NAME = "ComNestra";
export const BRAND_TAGLINE = "Africa's Commerce Enablement Platform";

/* ==============================
   ComNestra Design System Tokens
   ============================== */

/* Button Classes */
export const BTN = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  ai: "btn-ai",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "btn-icon",
  iconSm: "btn-icon-sm",
} as const;

/* Input Classes */
export const INPUT = {
  base: "input-standard",
  error: "input-standard input-error",
  withIcon: "input-standard input-with-icon",
} as const;

/* Card Classes */
export const CARD = {
  standard: "card-standard",
  interactive: "card-interactive",
  ai: "card-ai",
} as const;

/* Badge Classes */
export const BADGE = {
  emerald: "badge-emerald",
  amber: "badge-amber",
  blue: "badge-blue",
  red: "badge-red",
  purple: "badge-purple",
  ai: "badge-ai",
  outline: "badge-outline",
} as const;

/* Status Badge Color Map */
export const STATUS_BADGE: Record<string, string> = {
  pending: "badge-amber",
  processing: "badge-blue",
  shipped: "badge-purple",
  delivered: "badge-emerald",
  cancelled: "badge-red",
  open: "badge-amber",
  resolved: "badge-emerald",
  escalated: "badge-red",
};

/* Typography Classes */
export const TYPO = {
  display: "text-display",
  h2: "text-h2",
  h3: "text-h3",
  body: "text-body",
  micro: "text-micro",
  price: "text-price",
} as const;

/* Role Configuration */
export const ROLES = [
  { value: "buyer" as const, label: "Buyer", icon: "ShoppingCart" },
  { value: "seller" as const, label: "Seller", icon: "Store" },
  { value: "admin" as const, label: "Admin", icon: "Shield" },
] as const;

export const CURRENCIES: Currency[] = [
  { code: "KES", symbol: "Ksh", name: "Kenyan Shilling", rate: 150, locale: "en-KE" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 1500, locale: "en-NG" },
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi", rate: 14, locale: "en-GH" },
  { code: "ZAR", symbol: "R", name: "South African Rand", rate: 18, locale: "en-ZA" },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1, locale: "en-US" },
];

export const USERS: User[] = [
  { id: "u1", name: "Amara Okafor", email: "amara@example.com", role: "buyer", region: "Nigeria", joinedAt: "2024-01-15" },
  { id: "u2", name: "Kwame Mensah", email: "kwame@example.com", role: "seller", region: "Ghana", joinedAt: "2024-02-20" },
  { id: "u3", name: "Zuri Mwangi", email: "zuri@example.com", role: "admin", region: "Kenya", joinedAt: "2024-01-01" },
  { id: "u4", name: "Thabo Ndlovu", email: "thabo@example.com", role: "buyer", region: "South Africa", joinedAt: "2024-03-10" },
  { id: "u5", name: "Amina Hassan", email: "amina@example.com", role: "seller", region: "Kenya", joinedAt: "2024-02-01" },
];

export const CATEGORIES: Category[] = [
  { id: "cat1", name: "Electronics & Gadgets", slug: "electronics", icon: "Smartphone", region: "Pan-Africa" },
  { id: "cat2", name: "Fashion & Textiles", slug: "fashion", icon: "Palette", region: "Pan-Africa" },
  { id: "cat3", name: "Arts & Crafts", slug: "arts-crafts", icon: "Sparkles", region: "Pan-Africa" },
  { id: "cat4", name: "Fresh Produce", slug: "produce", icon: "Package", region: "Pan-Africa" },
  { id: "cat5", name: "Home & Living", slug: "home-living", icon: "Building2", region: "Pan-Africa" },
  { id: "cat6", name: "Beauty & Wellness", slug: "beauty", icon: "Smile", region: "Pan-Africa" },
];

export const VENDORS: Vendor[] = [
  { id: "v1", name: "Lagos TechHub", description: "Premium electronics and gadgets from Nigeria's innovation hub", logo: "", region: "Nigeria", country: "NG", rating: 4.8, totalProducts: 24, totalOrders: 1560, joinedAt: "2024-01-10", verified: true, active: true, aiTrustScore: 92 },
  { id: "v2", name: "Nairobi Crafts Co", description: "Handcrafted artisan goods from Kenya's finest makers", logo: "", region: "Kenya", country: "KE", rating: 4.6, totalProducts: 18, totalOrders: 892, joinedAt: "2024-02-14", verified: true, active: true, aiTrustScore: 88 },
  { id: "v3", name: "Accra Textile Guild", description: "Authentic West African fabrics and fashion", logo: "", region: "Ghana", country: "GH", rating: 4.9, totalProducts: 32, totalOrders: 2100, joinedAt: "2024-01-05", verified: true, active: true, aiTrustScore: 95 },
  { id: "v4", name: "Cape Town Artisans", description: "Contemporary South African design and homeware", logo: "", region: "South Africa", country: "ZA", rating: 4.5, totalProducts: 15, totalOrders: 675, joinedAt: "2024-03-01", verified: true, active: true, aiTrustScore: 84 },
  { id: "v5", name: "Cairo Bazaar Online", description: "Egyptian treasures and Mediterranean goods", logo: "", region: "Egypt", country: "EG", rating: 4.3, totalProducts: 20, totalOrders: 450, joinedAt: "2024-03-20", verified: false, active: true, aiTrustScore: 72 },
];

export const PRODUCTS: Product[] = [
  { id: "p1", vendorId: "v1", name: "SmartPro X1 Laptop", description: "High-performance laptop for professionals and creators. Features AMD Ryzen 7, 16GB RAM, 512GB SSD.", price: 850, currency: "USD", category: "electronics", region: "Nigeria", images: ["https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/smartpro-laptop-1f93d63e-1785541500475.webp"], stock: 45, rating: 4.7, reviews: 128, createdAt: "2024-04-01", aiSummary: "Top-rated business laptop with excellent battery life for remote work across Africa", aiRecommended: true, brand: "SmartPro", sku: "SP-X1-001", countryOfOrigin: "Nigeria", sellerName: "Lagos TechHub", verifiedSeller: true, location: "Lagos, Nigeria", originalPrice: 950, stockStatus: "in-stock", deliveryEstimate: "3-5 business days", isAiPick: true },
  { id: "p2", vendorId: "v1", name: "Wireless Pro Earbuds", description: "Noise-cancelling earbuds with 30hr battery life. IPX5 water resistant.", price: 120, currency: "USD", category: "electronics", region: "Nigeria", images: ["https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/wireless-earbuds-47197f84-1785541496778.webp"], stock: 200, rating: 4.5, reviews: 89, createdAt: "2024-04-05", aiSummary: "Best-selling audio accessory with great call quality for mobile professionals", aiRecommended: true, brand: "AudioTech", sku: "AT-WE-002", countryOfOrigin: "Nigeria", sellerName: "Lagos TechHub", verifiedSeller: true, location: "Lagos, Nigeria", originalPrice: 150, stockStatus: "in-stock", deliveryEstimate: "2-4 business days", isAiPick: true },
  { id: "p3", vendorId: "v2", name: "Handwoven Kikoy Blanket", description: "Traditional Kenyan kikoy blanket, handwoven by artisans in the Rift Valley.", price: 65, currency: "USD", category: "home-living", region: "Kenya", images: ["https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/handwoven-kikoy-blanket-967980cf-1785541497636.webp"], stock: 30, rating: 4.9, reviews: 56, createdAt: "2024-03-15", aiSummary: "Authentic Kenyan artisan piece, perfect gift for cultural enthusiasts", aiRecommended: true, brand: "Rift Valley Crafts", sku: "RVC-KB-003", countryOfOrigin: "Kenya", sellerName: "Nairobi Crafts Co", verifiedSeller: true, location: "Nairobi, Kenya", stockStatus: "in-stock", deliveryEstimate: "5-7 business days", isAiPick: true },
  { id: "p4", vendorId: "v2", name: "Maasai Beaded Jewelry Set", description: "Hand-beaded necklace and earrings set by Maasai women artisans.", price: 45, currency: "USD", category: "fashion", region: "Kenya", images: ["https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/maasai-beaded-jewelry-d2b0d4cf-1785541497184.webp"], stock: 25, rating: 4.8, reviews: 42, createdAt: "2024-03-20", aiSummary: "Ethically sourced artisan jewelry supporting women cooperatives in Kenya", aiRecommended: false, brand: "Maasai Heritage", sku: "MH-BJ-004", countryOfOrigin: "Kenya", sellerName: "Nairobi Crafts Co", verifiedSeller: true, location: "Nairobi, Kenya", stockStatus: "in-stock", deliveryEstimate: "5-7 business days", isAiPick: false },
  { id: "p5", vendorId: "v3", name: "Kente Cloth Stole", description: "Premium handwoven Kente cloth stole from Ghana's Volta Region. Each piece is unique.", price: 180, currency: "USD", category: "fashion", region: "Ghana", images: ["https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/kente-cloth-stole-c69b4644-1785541497351.webp"], stock: 15, rating: 5.0, reviews: 34, createdAt: "2024-02-10", aiSummary: "Premium ceremonial Kente stole, highly sought-after for weddings and graduations", aiRecommended: true, brand: "Volta Weavers", sku: "VW-KC-005", countryOfOrigin: "Ghana", sellerName: "Accra Textile Guild", verifiedSeller: true, location: "Accra, Ghana", originalPrice: 220, stockStatus: "low-stock", deliveryEstimate: "7-10 business days", isAiPick: true },
  { id: "p6", vendorId: "v3", name: "Batik Print Shirt", description: "Modern fit cotton shirt with traditional Ghanaian batik print design.", price: 55, currency: "USD", category: "fashion", region: "Ghana", images: ["https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/batik-print-shirt-be1c67ae-1785541499637.webp"], stock: 50, rating: 4.6, reviews: 71, createdAt: "2024-03-01", aiSummary: "Trending fusion wear blending traditional batik with contemporary styling", aiRecommended: false, brand: "Ghana Batik Co", sku: "GBC-BS-006", countryOfOrigin: "Ghana", sellerName: "Accra Textile Guild", verifiedSeller: true, location: "Accra, Ghana", stockStatus: "in-stock", deliveryEstimate: "7-10 business days", isAiPick: false },
  { id: "p7", vendorId: "v4", name: "Protea Candle Collection", description: "Hand-poured soy candles inspired by South Africa's national flower.", price: 35, currency: "USD", category: "home-living", region: "South Africa", images: ["https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/protea-candle-collection-eadefabe-1785541500702.webp"], stock: 40, rating: 4.4, reviews: 28, createdAt: "2024-04-10", aiSummary: "Luxury home fragrance collection, popular gift item for international buyers", aiRecommended: false, brand: "Protea Home", sku: "PH-CC-007", countryOfOrigin: "South Africa", sellerName: "Cape Town Artisans", verifiedSeller: true, location: "Cape Town, South Africa", stockStatus: "in-stock", deliveryEstimate: "4-6 business days", isAiPick: false },
  { id: "p8", vendorId: "v4", name: "African Oak Serving Board", description: "Handcrafted serving board from sustainably harvested African oak.", price: 75, currency: "USD", category: "home-living", region: "South Africa", images: ["https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/african-oak-serving-board-80d97430-1785541500429.webp"], stock: 20, rating: 4.7, reviews: 19, createdAt: "2024-03-25", aiSummary: "Sustainable kitchenware from Cape Town's premier woodworking collective", aiRecommended: true, brand: "Cape Woodworks", sku: "CW-SB-008", countryOfOrigin: "South Africa", sellerName: "Cape Town Artisans", verifiedSeller: true, location: "Cape Town, South Africa", stockStatus: "in-stock", deliveryEstimate: "4-6 business days", isAiPick: true },
  { id: "p9", vendorId: "v5", name: "Egyptian Cotton Bed Set", description: "Luxury 1000-thread count Egyptian cotton bed sheet set.", price: 250, currency: "USD", category: "home-living", region: "Egypt", images: ["https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/egyptian-cotton-bed-set-d15bfa6a-1785541502010.webp"], stock: 35, rating: 4.2, reviews: 63, createdAt: "2024-04-01", aiSummary: "Premium hotel-quality bedding from Egypt's Nile Delta cotton region", aiRecommended: false, brand: "Nile Luxury Textiles", sku: "NLT-CB-009", countryOfOrigin: "Egypt", sellerName: "Cairo Bazaar Online", verifiedSeller: false, location: "Cairo, Egypt", originalPrice: 300, stockStatus: "in-stock", deliveryEstimate: "10-14 business days", isAiPick: false },
  { id: "p10", vendorId: "v1", name: "Solar Power Bank 20K", description: "20000mAh solar power bank with dual USB-C output. Ideal for off-grid charging.", price: 40, currency: "USD", category: "electronics", region: "Nigeria", images: ["https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/solar-power-bank-d15a7348-1785541502890.webp"], stock: 150, rating: 4.3, reviews: 95, createdAt: "2024-04-15", aiSummary: "Essential travel accessory for power reliability across Africa's varied grid conditions", aiRecommended: true, brand: "SolarTech", sku: "ST-PB-010", countryOfOrigin: "Nigeria", sellerName: "Lagos TechHub", verifiedSeller: true, location: "Lagos, Nigeria", stockStatus: "in-stock", deliveryEstimate: "2-4 business days", isAiPick: true },
];

export const AI_INSIGHTS: Record<string, AIInsight[]> = {
  buyer: [
    { id: "ai1", type: "buyer", title: "Gift Finder", description: "Let me find the perfect gift for someone special based on their interests", actionLabel: "Find Gift", severity: "info" },
    { id: "ai2", type: "buyer", title: "Price Alert", description: "I can notify you when products you like go on sale or drop in price", actionLabel: "Set Alert", severity: "info" },
    { id: "ai3", type: "buyer", title: "Best Value", description: "SmartPro X1 Laptop is the best-rated electronics item this week", actionLabel: "View Deal", severity: "success" },
  ],
  seller: [
    { id: "ai4", type: "seller", title: "Optimize Listing", description: "Your Kente Stole listing could reach 3x more buyers with better keywords and photos", actionLabel: "Enhance Now", severity: "info" },
    { id: "ai5", type: "seller", title: "Stock Alert", description: "Wireless Earbuds are trending. Consider restocking to avoid missed sales", actionLabel: "Restock", severity: "warning" },
    { id: "ai6", type: "seller", title: "Pricing Insight", description: "Your pricing is 15% above market average. A small adjustment could boost sales by 40%", actionLabel: "Adjust Price", severity: "info" },
  ],
  admin: [
    { id: "ai7", type: "admin", title: "Risk Flag", description: "Unusual return pattern detected from Cairo Bazaar Online - 3 disputes in 48 hours", actionLabel: "Review", severity: "warning" },
    { id: "ai8", type: "admin", title: "Growth Opportunity", description: "West African fashion category growing 28% MoM. Consider featuring more vendors", actionLabel: "Explore", severity: "success" },
    { id: "ai9", type: "admin", title: "Trust Score Update", description: "Accra Textile Guild maintains highest trust score (95) across all vendors", actionLabel: "View Report", severity: "info" },
  ],
};

export const SELLER_KPIS = {
  totalRevenue: 45800,
  totalOrders: 2340,
  activeListings: 28,
  rating: 4.7,
  revenueChange: 12.6,
  ordersChange: 8.3,
  listingsChange: 4,
  ratingChange: 0.2,
};

export const ADMIN_METRICS = {
  gmv: 2450000,
  totalVendors: 48,
  totalBuyers: 12500,
  pendingApprovals: 3,
  activeDisputes: 7,
  gmvGrowth: 18.5,
  vendorGrowth: 12,
  buyerGrowth: 24,
  regions: [
    { name: "Nigeria", value: 35 },
    { name: "Kenya", value: 25 },
    { name: "Ghana", value: 20 },
    { name: "South Africa", value: 12 },
    { name: "Egypt", value: 8 },
  ],
};

export const REVIEWS: import("./types").Review[] = [
  // Product p1 - SmartPro X1 Laptop (4.7 rating, 128 reviews)
  { id: "r1", productId: "p1", userId: "u4", userName: "Thabo Ndlovu", country: "South Africa", rating: 5, title: "Best laptop for remote work", comment: "Absolutely love this laptop! The battery lasts me a full day of video calls and coding. Highly recommend for any professional working remotely across Africa.", createdAt: "2024-04-15T10:30:00Z", isVerified: true, helpfulCount: 24 },
  { id: "r2", productId: "p1", userId: "u1", userName: "Amara Okafor", country: "Nigeria", rating: 5, title: "Exceeded expectations", comment: "The Ryzen 7 processor handles everything I throw at it. Perfect for my graphic design work. Delivery was fast too!", createdAt: "2024-04-10T14:20:00Z", isVerified: true, helpfulCount: 18 },
  { id: "r3", productId: "p1", userId: "u6", userName: "Fatima Diallo", country: "Senegal", rating: 4, title: "Great but gets warm", comment: "Powerful machine but it does get warm under heavy load. A cooling pad solves this. Otherwise fantastic value for the price.", createdAt: "2024-04-05T09:15:00Z", isVerified: true, helpfulCount: 12 },
  { id: "r4", productId: "p1", userId: "u7", userName: "Kofi Annan", country: "Ghana", rating: 5, title: "Perfect for developers", comment: "As a software developer, this machine handles Docker, multiple IDEs, and databases without breaking a sweat.", createdAt: "2024-03-28T16:45:00Z", isVerified: true, helpfulCount: 31 },
  { id: "r5", productId: "p1", userId: "u8", userName: "Grace Mwangi", country: "Kenya", rating: 4, title: "Good value for money", comment: "Solid build quality and great performance. The only downside is the speaker quality could be better.", createdAt: "2024-03-20T11:00:00Z", isVerified: false, helpfulCount: 7 },
  // Product p2 - Wireless Pro Earbuds (4.5 rating, 89 reviews)
  { id: "r6", productId: "p2", userId: "u1", userName: "Amara Okafor", country: "Nigeria", rating: 5, title: "Best earbuds I've owned", comment: "Noise cancellation is incredible. I use them on my commute in Lagos and they block out the traffic completely. Battery life is as advertised.", createdAt: "2024-04-12T08:30:00Z", isVerified: true, helpfulCount: 42 },
  { id: "r7", productId: "p2", userId: "u4", userName: "Thabo Ndlovu", country: "South Africa", rating: 4, title: "Great sound, comfortable fit", comment: "The sound quality is superb and they fit comfortably for hours. Only wish they came in more colors.", createdAt: "2024-04-08T13:15:00Z", isVerified: true, helpfulCount: 15 },
  { id: "r8", productId: "p2", userId: "u9", userName: "Aisha Mohammed", country: "Tanzania", rating: 5, title: "Game changer for calls", comment: "Perfect for my daily Zoom meetings. The microphone quality is outstanding and my colleagues can hear me clearly even with background noise.", createdAt: "2024-04-02T10:45:00Z", isVerified: true, helpfulCount: 28 },
  { id: "r9", productId: "p2", userId: "u10", userName: "John Mensah", country: "Ghana", rating: 3, title: "Good but connection drops", comment: "Audio quality is excellent but I experience occasional Bluetooth drops when my phone is in my pocket. Might be a software issue.", createdAt: "2024-03-25T15:30:00Z", isVerified: true, helpfulCount: 9 },
  // Product p3 - Handwoven Kikoy Blanket (4.9 rating, 56 reviews)
  { id: "r10", productId: "p3", userId: "u1", userName: "Amara Okafor", country: "Nigeria", rating: 5, title: "Stunning craftsmanship", comment: "The colors are vibrant and the weaving is incredibly detailed. Feels luxurious and authentic. Makes a wonderful gift!", createdAt: "2024-04-05T12:00:00Z", isVerified: true, helpfulCount: 36 },
  { id: "r11", productId: "p3", userId: "u4", userName: "Thabo Ndlovu", country: "South Africa", rating: 5, title: "Authentic Kenyan artisan piece", comment: "You can feel the quality and love put into this blanket. It's become the centerpiece of my living room. Everyone compliments it!", createdAt: "2024-03-30T09:20:00Z", isVerified: true, helpfulCount: 22 },
  { id: "r12", productId: "p3", userId: "u11", userName: "Sarah Ochieng", country: "Kenya", rating: 5, title: "Proudly Kenyan", comment: "As a Kenyan, I'm so proud to see our traditional crafts represented so beautifully. The quality is exceptional and delivery was prompt.", createdAt: "2024-03-22T14:10:00Z", isVerified: true, helpfulCount: 45 },
  // Product p5 - Kente Cloth Stole (5.0 rating, 34 reviews)
  { id: "r13", productId: "p5", userId: "u1", userName: "Amara Okafor", country: "Nigeria", rating: 5, title: "Absolutely stunning Kente", comment: "Wore this to my cousin's wedding and received endless compliments. The colors are even more vibrant in person. Worth every penny!", createdAt: "2024-04-01T11:30:00Z", isVerified: true, helpfulCount: 33 },
  { id: "r14", productId: "p5", userId: "u4", userName: "Thabo Ndlovu", country: "South Africa", rating: 5, title: "Premium quality ceremonial stole", comment: "The craftsmanship is outstanding. Each thread tells a story. This is authentic Ghanaian Kente at its finest. Fast shipping to SA!", createdAt: "2024-03-18T16:00:00Z", isVerified: true, helpfulCount: 27 },
  { id: "r15", productId: "p5", userId: "u12", userName: "Nana Yaw", country: "Ghana", rating: 5, title: "Heritage piece", comment: "Proud to own such a beautiful piece of Ghanaian heritage. The weaving is intricate and the fabric feels premium. Highly recommend!", createdAt: "2024-03-10T08:45:00Z", isVerified: true, helpfulCount: 19 },
];

export const DISPUTE_LOGS: import("./types").DisputeLog[] = [
  { id: "d1", orderId: "ORD-001", vendorId: "v5", buyerId: "u1", issue: "Item not as described - fabric quality different from listing", status: "open", aiFlagged: true, createdAt: "2024-04-18" },
  { id: "d2", orderId: "ORD-002", vendorId: "v2", buyerId: "u4", issue: "Shipping delay - item overdue by 2 weeks", status: "open", aiFlagged: false, createdAt: "2024-04-16" },
  { id: "d3", orderId: "ORD-003", vendorId: "v5", buyerId: "u1", issue: "Wrong item received - sent size M instead of size L", status: "escalated", aiFlagged: true, createdAt: "2024-04-14" },
  { id: "d4", orderId: "ORD-004", vendorId: "v1", buyerId: "u4", issue: "Product defective - battery not charging", status: "resolved", aiFlagged: false, createdAt: "2024-04-10" },
  { id: "d5", orderId: "ORD-005", vendorId: "v5", buyerId: "u1", issue: "Return refused - vendor not accepting return", status: "open", aiFlagged: true, createdAt: "2024-04-19" },
];