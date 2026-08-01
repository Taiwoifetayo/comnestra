import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  TrendingUp, DollarSign, ShoppingCart, Users, BarChart, FileText, Download,
  Calendar, Clock, Eye, AlertTriangle, Check, X, Zap, Target, ArrowUp, ArrowDown,
  ChevronDown, ChevronUp, ExternalLink, Sparkles, Brain, Loader, Info, ThumbsUp,
  Package, Percent, ArrowUpRight, ArrowDownRight, RefreshCw, Lightbulb,
  Gauge, Wallet, CreditCard, Banknote, TrendingDown, Activity, MapPin, Star,
  ShoppingBag, BadgeCheck, FileSpreadsheet, ChartPie,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { BTN, BADGE, TYPO } from "../constants";
import { DashboardSkeleton, EmptyState, ErrorState, MetricCard } from "./ui/UIStates";
import type {
  AnalyticsSummaryCard, SalesDataPoint, TopProduct, InventoryHealthItem,
  CustomerInsight, FinancialSummary, AICoachRecommendation,
} from "../types";

/* ==============================
   Mock Analytics Data
   ============================== */

const MOCK_SUMMARY_CARDS: AnalyticsSummaryCard[] = [
  { label: "Total Revenue", value: "$45,800", change: 12.6, trend: "up", icon: "DollarSign", color: "text-emerald-600", subtitle: "vs last month" },
  { label: "Total Orders", value: "2,340", change: 8.3, trend: "up", icon: "ShoppingCart", color: "text-amber-600", subtitle: "vs last month" },
  { label: "Conversion Rate", value: "3.2%", change: 0.4, trend: "up", icon: "TrendingUp", color: "text-blue-600", subtitle: "Above average" },
  { label: "Avg Order Value", value: "$19.57", change: -2.1, trend: "down", icon: "Wallet", color: "text-purple-600", subtitle: "vs last month" },
];

const MOCK_SALES_DATA: SalesDataPoint[] = [
  { date: "2024-01", label: "Jan", revenue: 3200, orders: 160, units: 210 },
  { date: "2024-02", label: "Feb", revenue: 3800, orders: 190, units: 245 },
  { date: "2024-03", label: "Mar", revenue: 4200, orders: 210, units: 280 },
  { date: "2024-04", label: "Apr", revenue: 5100, orders: 255, units: 320 },
  { date: "2024-05", label: "May", revenue: 4800, orders: 240, units: 300 },
  { date: "2024-06", label: "Jun", revenue: 5600, orders: 280, units: 360 },
  { date: "2024-07", label: "Jul", revenue: 6200, orders: 310, units: 400 },
  { date: "2024-08", label: "Aug", revenue: 5800, orders: 290, units: 375 },
  { date: "2024-09", label: "Sep", revenue: 6400, orders: 320, units: 410 },
  { date: "2024-10", label: "Oct", revenue: 7100, orders: 355, units: 450 },
  { date: "2024-11", label: "Nov", revenue: 7800, orders: 390, units: 490 },
  { date: "2024-12", label: "Dec", revenue: 8500, orders: 425, units: 530 },
];

const MOCK_TOP_PRODUCTS: TopProduct[] = [
  { id: "p1", name: "SmartPro X1 Laptop", image: "SmartPro X1", unitsSold: 128, revenue: 108800, stock: 45, trend: 12.5, category: "Electronics" },
  { id: "p2", name: "Wireless Pro Earbuds", image: "Earbuds", unitsSold: 89, revenue: 10680, stock: 200, trend: 8.3, category: "Electronics" },
  { id: "p3", name: "Handwoven Kikoy Blanket", image: "Kikoy", unitsSold: 56, revenue: 3640, stock: 30, trend: 15.2, category: "Home & Living" },
  { id: "p5", name: "Kente Cloth Stole", image: "Kente", unitsSold: 34, revenue: 6120, stock: 15, trend: 22.1, category: "Fashion" },
  { id: "p10", name: "Solar Power Bank 20K", image: "Solar", unitsSold: 95, revenue: 3800, stock: 150, trend: 30.5, category: "Electronics" },
];

const MOCK_INVENTORY: InventoryHealthItem[] = [
  { id: "p5", name: "Kente Cloth Stole", sku: "VW-KC-005", currentStock: 15, reorderPoint: 20, status: "low_stock", suggestedRestock: 40, monthlySales: 12, daysUntilStockout: 8 },
  { id: "p3", name: "Handwoven Kikoy Blanket", sku: "RVC-KB-003", currentStock: 30, reorderPoint: 15, status: "fast_moving", suggestedRestock: 60, monthlySales: 18, daysUntilStockout: 12 },
  { id: "p8", name: "African Oak Serving Board", sku: "CW-SB-008", currentStock: 20, reorderPoint: 10, status: "slow_moving", suggestedRestock: 0, monthlySales: 3, daysUntilStockout: null },
  { id: "p9", name: "Egyptian Cotton Bed Set", sku: "NLT-CB-009", currentStock: 35, reorderPoint: 10, status: "slow_moving", suggestedRestock: 0, monthlySales: 8, daysUntilStockout: null },
];

const MOCK_CUSTOMER_INSIGHTS: CustomerInsight = {
  newCustomers: 145,
  returningCustomers: 312,
  repeatPurchaseRate: 68.3,
  topBuyers: [
    { name: "Amara Okafor", orders: 12, totalSpent: 2450 },
    { name: "Thabo Ndlovu", orders: 8, totalSpent: 1820 },
    { name: "Aisha Mohammed", orders: 6, totalSpent: 980 },
    { name: "Kofi Annan", orders: 5, totalSpent: 750 },
  ],
  locationData: [
    { name: "Nigeria", value: 35 },
    { name: "Kenya", value: 25 },
    { name: "Ghana", value: 20 },
    { name: "South Africa", value: 12 },
    { name: "Other", value: 8 },
  ],
};

const MOCK_FINANCIAL: FinancialSummary = {
  grossRevenue: 45800,
  marketplaceFees: 4580,
  netEarnings: 41220,
  pendingWithdrawals: 12500,
  availableBalance: 28720,
  currency: "USD",
};

const MOCK_AI_RECOMMENDATIONS: AICoachRecommendation[] = [
  { id: "r1", type: "promote", title: "Boost Solar Power Bank Sales", description: "Your Solar Power Bank 20K is trending +30% MoM. Increase ad spend to capture growing demand.", impact: "high", actionLabel: "Boost Now", icon: "Zap" },
  { id: "r2", type: "restock", title: "Kente Stole Running Low", description: "Only 15 units left. At current velocity, you'll stock out in 8 days. Restock 40 units to meet demand.", impact: "high", actionLabel: "Restock Now", icon: "AlertTriangle" },
  { id: "r3", type: "revenue_hack", title: "Bundle Deal Opportunity", description: "Customers who buy Kente Stoles also buy Kikoy Blankets 40% of the time. Create a bundle for $220.", impact: "medium", actionLabel: "Create Bundle", icon: "Lightbulb" },
  { id: "r4", type: "pricing", title: "Price Optimization for Earbuds", description: "Your Wireless Earbuds are priced 15% above market avg. A 10% discount could increase sales by 35%.", impact: "medium", actionLabel: "Adjust Price", icon: "TrendingDown" },
  { id: "r5", type: "forecast", title: "Q1 Demand Forecast", description: "Based on current trends, expect 22% revenue growth in Q1. Prepare inventory for January spike.", impact: "high", actionLabel: "View Forecast", icon: "TrendingUp" },
];

/* ==============================
   Helper Components
   ============================== */

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign, ShoppingCart, TrendingUp, Wallet, Users, Package, Eye, AlertTriangle,
  Zap, Lightbulb, TrendingDown, Star, MapPin, BadgeCheck, Clock, Target, Activity,
  BarChart, FileText, Download, Calendar, Percent, ArrowUpRight, ArrowDownRight,
  RefreshCw, Gauge, CreditCard, Banknote, Sparkles, Brain, Check, X, Info,
  ThumbsUp, ShoppingBag, FileSpreadsheet, ChartPie, ChevronDown, ChevronUp,
  ExternalLink, Loader, ArrowUp, ArrowDown,
};

function MetricIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || Activity;
  return <Icon className={className || "h-4 w-4"} />;
}

function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

/* ===== Summary Card Row ===== */
function SummaryCards() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {MOCK_SUMMARY_CARDS.map((card, i) => (
        <motion.div
          key={card.label}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${card.color.replace("text-", "from-").replace("600", "100")} to-${card.color.replace("text-", "").replace("600", "50")} ${card.color.replace("text-", "text-")}`}>
                  <MetricIcon name={card.icon} className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
              <p className="mt-1.5 text-2xl font-bold tracking-tight">{card.value}</p>
              <div className="mt-1 flex items-center gap-1">
                {card.trend === "up" ? (
                  <ArrowUpRight className={`h-3.5 w-3.5 ${card.change >= 0 ? "text-emerald-600" : "text-red-500"}`} />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                )}
                <span className={`text-xs font-medium ${card.trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
                  {card.trend === "up" ? "+" : ""}{card.change}%
                </span>
                {card.subtitle && <span className="text-xs text-muted-foreground ml-1">{card.subtitle}</span>}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

/* ===== Sales Trends Chart (Animated Bar Chart) ===== */
function SalesTrendChart() {
  const [metric, setMetric] = useState<"revenue" | "orders" | "units">("revenue");
  const maxRevenue = Math.max(...MOCK_SALES_DATA.map((d) => d.revenue));
  const maxOrders = Math.max(...MOCK_SALES_DATA.map((d) => d.orders));
  const maxUnits = Math.max(...MOCK_SALES_DATA.map((d) => d.units));
  const maxVal = metric === "revenue" ? maxRevenue : metric === "orders" ? maxOrders : maxUnits;

  const formatVal = (v: number) => metric === "revenue" ? `$${v.toLocaleString()}` : `${v}`;

  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart className="h-4 w-4 text-emerald-600" /> Sales Trends
          </CardTitle>
          <CardDescription>12-month revenue & order performance</CardDescription>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
          {(["revenue", "orders", "units"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                metric === m ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "revenue" ? "Revenue" : m === "orders" ? "Orders" : "Units"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1.5 h-36">
          {MOCK_SALES_DATA.map((d, i) => {
            const val = metric === "revenue" ? d.revenue : metric === "orders" ? d.orders : d.units;
            const pct = (val / maxVal) * 100;
            const isHigh = val >= maxVal * 0.8;
            return (
              <div key={d.date} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${Math.max(pct, 4)}%`, opacity: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  className={`w-full rounded-t-sm transition-all ${
                    isHigh
                      ? "bg-gradient-to-t from-emerald-500 to-emerald-400"
                      : "bg-gradient-to-t from-emerald-400/70 to-emerald-300/50"
                  } hover:from-emerald-600 hover:to-emerald-500 cursor-pointer`}
                />
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-lg">
                    {formatVal(val)}
                  </div>
                </div>
                <span className="mt-1 text-[10px] text-muted-foreground">{d.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ===== Top Products ===== */
function TopProductsTable() {
  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-4 w-4 text-amber-600" /> Top Selling Products
        </CardTitle>
        <CardDescription>Best performers by revenue</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {MOCK_TOP_PRODUCTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" as const }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50">
                <Package className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{p.category}</span>
                  <span>Stock: {p.stock}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(p.revenue)}</p>
                <div className="flex items-center gap-1 justify-end">
                  <ArrowUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-600">{p.trend}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ===== Inventory Health ===== */
function InventoryHealth() {
  const statusConfig = {
    low_stock: { label: "Low Stock", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    out_of_stock: { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" },
    fast_moving: { label: "Fast Moving", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    slow_moving: { label: "Slow Moving", color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500" },
    in_stock: { label: "In Stock", color: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-400" },
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4 text-amber-600" /> Inventory Health
        </CardTitle>
        <CardDescription>Stock levels & reorder alerts</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {MOCK_INVENTORY.map((item, i) => {
            const cfg = statusConfig[item.status] || statusConfig.in_stock;
            const stockPct = item.suggestedRestock > 0 ? Math.round((item.currentStock / item.suggestedRestock) * 100) : 100;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" as const }}
                className="px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${cfg.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.sku}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(stockPct, 100)}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" as const }}
                      className={`h-full rounded-full ${
                        item.status === "low_stock" ? "bg-amber-500" :
                        item.status === "out_of_stock" ? "bg-red-500" :
                        item.status === "fast_moving" ? "bg-emerald-500" : "bg-blue-400"
                      }`}
                    />
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">{item.currentStock} / {item.suggestedRestock || item.currentStock}</span>
                </div>
                {item.daysUntilStockout !== null && (
                  <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Stockout in {item.daysUntilStockout} days
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ===== Customer Insights ===== */
function CustomerInsightsCard() {
  const data = MOCK_CUSTOMER_INSIGHTS;
  const totalBuyers = data.newCustomers + data.returningCustomers;
  const newPct = totalBuyers > 0 ? Math.round((data.newCustomers / totalBuyers) * 100) : 0;
  const returnPct = totalBuyers > 0 ? Math.round((data.returningCustomers / totalBuyers) * 100) : 0;

  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-blue-600" /> Customer Insights
        </CardTitle>
        <CardDescription>Buyer behavior & retention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New vs Returning */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-3">
            <p className="text-xs text-muted-foreground">New Customers</p>
            <p className="text-xl font-bold text-blue-700">{data.newCustomers}</p>
            <p className="text-xs text-blue-600">{newPct}% of total</p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 p-3">
            <p className="text-xs text-muted-foreground">Returning</p>
            <p className="text-xl font-bold text-emerald-700">{data.returningCustomers}</p>
            <p className="text-xs text-emerald-600">{returnPct}% of total</p>
          </div>
        </div>

        {/* Repeat Purchase Rate */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Repeat Purchase Rate</span>
            <span className="font-semibold">{data.repeatPurchaseRate}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.repeatPurchaseRate}%` }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
            />
          </div>
        </div>

        {/* Top Buyers */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Top Buyers</p>
          <div className="space-y-2">
            {data.topBuyers.map((b, i) => (
              <div key={b.name} className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                  {b.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground">{b.orders} orders</p>
                </div>
                <span className="text-xs font-semibold">{formatCurrency(b.totalSpent)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Distribution */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">By Region</p>
          <div className="space-y-1.5">
            {data.locationData.map((loc) => (
              <div key={loc.name} className="flex items-center gap-2">
                <span className="text-xs w-24 truncate">{loc.name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${loc.value}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" as const }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{loc.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ===== Financial Summary ===== */
function FinancialSummaryCard() {
  const data = MOCK_FINANCIAL;
  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wallet className="h-4 w-4 text-emerald-600" /> Financial Summary
        </CardTitle>
        <CardDescription>Revenue, fees & earnings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 p-3">
            <p className="text-xs text-muted-foreground">Gross Revenue</p>
            <p className="text-lg font-bold text-emerald-700">{formatCurrency(data.grossRevenue)}</p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 p-3">
            <p className="text-xs text-muted-foreground">Marketplace Fees</p>
            <p className="text-lg font-bold text-amber-700">{formatCurrency(data.marketplaceFees)}</p>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Net Earnings</p>
              <p className="text-xl font-bold text-emerald-700">{formatCurrency(data.netEarnings)}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Banknote className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Available Balance</span>
            <span className="font-semibold text-emerald-700">{formatCurrency(data.availableBalance)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pending Withdrawals</span>
            <span className="font-semibold text-amber-600">{formatCurrency(data.pendingWithdrawals)}</span>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2 gap-1.5">
            <Wallet className="h-3.5 w-3.5" /> Withdraw Funds
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ===== AI Coach Recommendations ===== */
function AICoachRecommendations() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const impactColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const typeIcons: Record<string, string> = {
    promote: "Zap",
    demand_loss: "TrendingDown",
    restock: "AlertTriangle",
    revenue_hack: "Lightbulb",
    pricing: "DollarSign",
    forecast: "TrendingUp",
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500">
              <Brain className="h-3.5 w-3.5 text-white" />
            </div>
            Nestra AI Coach
          </CardTitle>
          <Badge className={BADGE.ai}>
            <Sparkles className="mr-1 h-3 w-3" /> AI-Powered
          </Badge>
        </div>
        <CardDescription>Personalized recommendations to grow your business</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {MOCK_AI_RECOMMENDATIONS.map((rec, i) => {
            const isExpanded = expandedId === rec.id;
            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3, ease: "easeOut" as const }}
                className="px-4 py-3 hover:bg-muted/20 transition-colors"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    rec.impact === "high" ? "bg-red-100 text-red-600" :
                    rec.impact === "medium" ? "bg-amber-100 text-amber-600" :
                    "bg-blue-100 text-blue-600"
                  }`}>
                    <MetricIcon name={typeIcons[rec.type] || "Lightbulb"} className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{rec.title}</p>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${impactColors[rec.impact]}`}>
                        {rec.impact} impact
                      </span>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" as const }}
                          className="mt-1 text-xs text-muted-foreground overflow-hidden"
                        >
                          {rec.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isExpanded && (
                      <Button size="sm" className="h-7 text-xs gap-1" onClick={(e) => { e.stopPropagation(); toast.success(`AI Coach: ${rec.actionLabel} triggered`); }}>
                        <Zap className="h-3 w-3" /> {rec.actionLabel}
                      </Button>
                    )}
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border-t">
          <Button variant="ghost" size="sm" className="w-full gap-1.5 text-xs text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" /> Ask Nestra AI for more insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ===== Export & Reports ===== */
function ExportReports() {
  const exportOptions = [
    { label: "Sales Report", description: "Full revenue & order data (CSV)", icon: "FileSpreadsheet", action: () => toast.success("Sales report downloaded") },
    { label: "Inventory Report", description: "Current stock levels & alerts", icon: "Package", action: () => toast.success("Inventory report downloaded") },
    { label: "Customer Insights", description: "Buyer behavior & retention data", icon: "Users", action: () => toast.success("Customer insights downloaded") },
    { label: "Financial Summary", description: "Earnings, fees & withdrawals", icon: "Banknote", action: () => toast.success("Financial summary downloaded") },
  ];

  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Download className="h-4 w-4 text-blue-600" /> Export & Reports
        </CardTitle>
        <CardDescription>Download analytics data for offline analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {exportOptions.map((opt) => (
            <Button
              key={opt.label}
              variant="outline"
              className="h-auto justify-start gap-3 p-3 text-left"
              onClick={opt.action}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <MetricIcon name={opt.icon} className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </div>
            </Button>
          ))}
        </div>
        <div className="mt-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Schedule Auto-Reports</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Get weekly analytics summary delivered to your email</p>
          <Button variant="outline" size="sm" className="mt-2 gap-1.5 text-xs" onClick={() => toast.success("Weekly report scheduled!")}>
            <Calendar className="h-3.5 w-3.5" /> Configure Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ===== Main Dashboard ===== */
export default function SellerAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  if (isLoading) {
    return <DashboardSkeleton cards={4} />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Failed to load analytics"
        message="We couldn't fetch your seller analytics data. Please try again."
        onRetry={() => {
          setHasError(false);
          toast.success("Retrying...");
        }}
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className={`${TYPO.h2} !text-xl`}>Seller Analytics</h1>
          <p className="text-sm text-muted-foreground">Data-driven insights to grow your business on ComNestra</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.success("Analytics refreshed")}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => {
            const el = document.createElement("a");
            el.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
              summary: MOCK_SUMMARY_CARDS,
              sales: MOCK_SALES_DATA,
              topProducts: MOCK_TOP_PRODUCTS,
              inventory: MOCK_INVENTORY,
              customers: MOCK_CUSTOMER_INSIGHTS,
              financial: MOCK_FINANCIAL,
            }, null, 2));
            el.download = `comnestra-analytics-${new Date().toISOString().split("T")[0]}.json`;
            el.click();
            toast.success("Full analytics exported as JSON");
          }}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">
            <BarChart className="mr-1.5 h-3.5 w-3.5" /> Overview
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="mr-1.5 h-3.5 w-3.5" /> Products
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Users className="mr-1.5 h-3.5 w-3.5" /> Customers
          </TabsTrigger>
          <TabsTrigger value="financial">
            <Wallet className="mr-1.5 h-3.5 w-3.5" /> Financial
          </TabsTrigger>
          <TabsTrigger value="ai-coach">
            <Brain className="mr-1.5 h-3.5 w-3.5" /> AI Coach
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <SalesTrendChart />
            <TopProductsTable />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <InventoryHealth />
            <CustomerInsightsCard />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <FinancialSummaryCard />
            <AICoachRecommendations />
          </div>
          <ExportReports />
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <TopProductsTable />
            <InventoryHealth />
          </div>
          <SalesTrendChart />
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="mt-4">
          <CustomerInsightsCard />
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <FinancialSummaryCard />
            <ExportReports />
          </div>
        </TabsContent>

        {/* AI Coach Tab */}
        <TabsContent value="ai-coach" className="mt-4">
          <AICoachRecommendations />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}