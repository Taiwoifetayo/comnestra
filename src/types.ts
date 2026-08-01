export type UserRole = "buyer" | "seller" | "admin";

export type CurrencyCode = "KES" | "NGN" | "GHS" | "ZAR" | "USD";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";

export type PaymentMethod = "mpesa" | "mobile_money" | "card" | "bank_transfer";

export type DeliveryStage = "pending" | "confirmed" | "processing" | "shipped" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number;
  locale: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  region: string;
  joinedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  region: string;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  currency: CurrencyCode;
  category: string;
  region: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  createdAt: string;
  aiSummary?: string;
  aiRecommended?: boolean;
  brand?: string;
  sku?: string;
  countryOfOrigin?: string;
  sellerName?: string;
  verifiedSeller?: boolean;
  location?: string;
  originalPrice?: number;
  stockStatus?: string;
  deliveryEstimate?: string;
  isAiPick?: boolean;
}

export type AppView = "browse" | "product" | "cart" | "order-success" | "orders";

export interface TrackingEvent {
  stage: DeliveryStage;
  label: string;
  description: string;
  timestamp: string;
  location?: string;
}

export interface OrderTrackingData {
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  stages: DeliveryStage[];
  currentStage: DeliveryStage;
  events: TrackingEvent[];
  shippedFrom: string;
  shippedTo: string;
}

export interface DeliveryTimelineStep {
  completed: boolean;
  icon: string;
  label: string;
  description: string;
  timestamp?: string;
}

export interface OrderDetails {
  id: string;
  items: CartItem[];
  total: number;
  currency: CurrencyCode;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  createdAt: string;
  estimatedDelivery: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  logo: string;
  region: string;
  country: string;
  rating: number;
  totalProducts: number;
  totalOrders: number;
  joinedAt: string;
  verified: boolean;
  active: boolean;
  aiTrustScore: number;
}

export interface Order {
  id: string;
  buyerId: string;
  vendorId: string;
  items: CartItem[];
  total: number;
  currency: CurrencyCode;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  tracking?: OrderTrackingData;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveryTimeline?: DeliveryTimelineStep[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendorId: string;
  vendorName: string;
}

export interface AIInsight {
  id: string;
  type: "buyer" | "seller" | "admin";
  title: string;
  description: string;
  actionLabel?: string;
  severity?: "info" | "warning" | "success";
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  avatar?: string;
  country: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  isVerified: boolean;
  helpfulCount: number;
}

export type StockAdjustmentReason = "restock" | "damaged" | "audit" | "return" | "sale" | "other";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: StockAdjustmentReason;
  notes?: string;
  adjustedBy: string;
  timestamp: string;
}

export interface InventoryAlert {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  status: StockStatus;
  daysUntilStockout: number | null;
  suggestedRestock: number;
  aiRecommendation?: string;
}

export interface DisputeLog {
  id: string;
  orderId: string;
  vendorId: string;
  buyerId: string;
  issue: string;
  status: "open" | "resolved" | "escalated";
  aiFlagged: boolean;
  createdAt: string;
}

/* ==============================
   Seller Analytics Types
   ============================== */

export interface AnalyticsSummaryCard {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: string;
  color: string;
  subtitle?: string;
}

export interface SalesDataPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
  units: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  unitsSold: number;
  revenue: number;
  stock: number;
  trend: number;
  category: string;
}

export interface InventoryHealthItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  status: "low_stock" | "out_of_stock" | "fast_moving" | "slow_moving";
  suggestedRestock: number;
  monthlySales: number;
  daysUntilStockout: number | null;
}

export interface CustomerInsight {
  newCustomers: number;
  returningCustomers: number;
  repeatPurchaseRate: number;
  topBuyers: { name: string; orders: number; totalSpent: number; avatar?: string }[];
  locationData: { name: string; value: number }[];
}

export interface FinancialSummary {
  grossRevenue: number;
  marketplaceFees: number;
  netEarnings: number;
  pendingWithdrawals: number;
  availableBalance: number;
  currency: string;
}

export interface AICoachRecommendation {
  id: string;
  type: "promote" | "demand_loss" | "restock" | "revenue_hack" | "pricing" | "forecast";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  actionLabel: string;
  icon: string;
}