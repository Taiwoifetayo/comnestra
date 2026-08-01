import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search, ChevronDown, X, Check, Clock, Truck, Package, MapPin, User, Users,
  CreditCard, Wallet, DollarSign, Eye, Filter, RotateCcw, ShoppingCart, CircleCheck,
  CircleAlert, CircleX, ThumbsUp, TrendingUp, Star, Brain, Sparkles, ChevronRight,
  List, ArrowUpDown, MessageCircle, AlertTriangle, Ban, ArrowRight
} from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Order, OrderStatus } from "../types";
import { BTN, INPUT, CARD, BADGE, STATUS_BADGE, TYPO } from "../constants";

/* ==============================
   Helper: Status chip color mapping
   ============================== */
const STATUS_CHIP_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  processing: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  shipped: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  cancelled: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  returned: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
};

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CircleCheck,
  cancelled: Ban,
  returned: RotateCcw,
};

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"] as const;

/* ==============================
   Metrics Card
   ============================== */
function MetricsCard({
  label,
  value,
  subtext,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-md"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color} bg-opacity-10`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold">{value}</p>
        {subtext && <p className="mt-0.5 text-xs text-muted-foreground">{subtext}</p>}
      </div>
      <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-br from-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}

/* ==============================
   AI Fulfillment Insights Panel
   ============================== */
function AIFulfillmentInsights() {
  const [expanded, setExpanded] = useState(true);

  const insights = [
    {
      icon: TrendingUp,
      label: "Processing Time Optimization",
      desc: "Your average processing time is 2.3 hours. Auto-accepting orders could reduce this by 40%.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Truck,
      label: "Shipping Carrier Recommendation",
      desc: "Express Logistics offers 15% lower rates for orders to West Africa. Switch to save on shipping.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: Star,
      label: "Customer Satisfaction Boost",
      desc: "Orders marked 'Shipped' within 24 hours have a 98% satisfaction rate. Prioritize morning fulfillment.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="overflow-hidden rounded-xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50/60 to-white"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">Nestra AI Fulfillment Insights</p>
            <p className="text-xs text-emerald-600/70">AI-powered recommendations for your orders</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 text-emerald-600" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="ai-insights"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="overflow-hidden"
          >
            <div className="space-y-2 px-4 pb-4">
              {insights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3, ease: "easeOut" }}
                    className="flex items-start gap-3 rounded-lg border bg-white/70 p-3"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 h-7 text-xs text-emerald-600">
                      Apply <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ==============================
   Order Card (Expandable)
   ============================== */
function OrderCard({
  order,
  formatPrice,
  onCancel,
}: {
  order: Order;
  formatPrice: (amount: number) => string;
  onCancel: (order: Order) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { dispatch, state } = useMarketplace();
  const StatusIcon = STATUS_ICONS[order.status] || Clock;

  const buyer = state.users.find((u) => u.id === order.buyerId);
  const vendor = state.vendors.find((v) => v.id === order.vendorId);

  const actionButtons = [
    ...(order.status === "pending"
      ? [
          { label: "Accept", status: "processing" as OrderStatus, color: "bg-emerald-600 hover:bg-emerald-700 text-white", icon: Check },
        ]
      : []),
    ...(order.status === "pending" || order.status === "processing"
      ? [
          { label: "Mark Shipped", status: "shipped" as OrderStatus, color: "bg-purple-600 hover:bg-purple-700 text-white", icon: Truck },
        ]
      : []),
    ...(order.status === "shipped"
      ? [
          { label: "Mark Delivered", status: "delivered" as OrderStatus, color: "bg-emerald-600 hover:bg-emerald-700 text-white", icon: CircleCheck },
        ]
      : []),
  ];

  const handleStatusUpdate = (status: OrderStatus) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id: order.id, status } });
    toast.success(`Order ${order.id} updated to ${status}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
    >
      {/* Collapsed Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        {/* Status Icon */}
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          order.status === "delivered" ? "bg-emerald-50" :
          order.status === "cancelled" ? "bg-red-50" :
          order.status === "shipped" ? "bg-purple-50" :
          order.status === "processing" ? "bg-blue-50" :
          "bg-amber-50"
        }`}>
          <StatusIcon className={`h-5 w-5 ${
            order.status === "delivered" ? "text-emerald-600" :
            order.status === "cancelled" ? "text-red-600" :
            order.status === "shipped" ? "text-purple-600" :
            order.status === "processing" ? "text-blue-600" :
            "text-amber-600"
          }`} />
        </div>

        {/* Order Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{order.id}</span>
            <Badge className={STATUS_BADGE[order.status] || "badge-amber"}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
            <span>·</span>
            <span>{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            <span>·</span>
            <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Expand Arrow */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/50"
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="order-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="overflow-hidden"
          >
            <Separator />

            {/* Detail Panels Grid */}
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
              {/* Customer Info */}
              <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <User className="h-3.5 w-3.5" /> Customer
                </div>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {(buyer?.name || "U")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{buyer?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{buyer?.email || ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{order.shippingAddress || "No address"}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <CreditCard className="h-3.5 w-3.5" /> Payment
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                    <Wallet className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">{order.paymentMethod?.replace("_", " ") || "M-Pesa"}</p>
                    <p className="text-xs text-muted-foreground">Total: <span className="font-semibold text-foreground">{formatPrice(order.total)}</span></p>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <Truck className="h-3.5 w-3.5" /> Shipping
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{vendor?.name || "Standard Shipping"}</p>
                    {order.estimatedDelivery && (
                      <p className="text-xs text-muted-foreground">Est. delivery: {order.estimatedDelivery}</p>
                    )}
                  </div>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>Tracking: {order.trackingNumber}</span>
                  </div>
                )}
              </div>

              {/* Purchased Items */}
              <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <ShoppingCart className="h-3.5 w-3.5" /> Purchased Items
                </div>
                <ScrollArea className="max-h-28">
                  <div className="space-y-1.5">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between text-sm">
                        <span className="truncate text-muted-foreground">
                          {item.name} <span className="text-xs text-muted-foreground/60">x{item.quantity}</span>
                        </span>
                        <span className="font-medium text-xs">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 border-t bg-muted/10 px-4 py-3">
              {actionButtons.map((btn) => {
                const BtnIcon = btn.icon;
                return (
                  <Button
                    key={btn.label}
                    size="sm"
                    className={`gap-1.5 text-xs ${btn.color}`}
                    onClick={() => handleStatusUpdate(btn.status)}
                  >
                    <BtnIcon className="h-3.5 w-3.5" />
                    {btn.label}
                  </Button>
                );
              })}

              {(order.status === "pending" || order.status === "processing") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => onCancel(order)}
                >
                  <Ban className="h-3.5 w-3.5" />
                  Cancel Order
                </Button>
              )}

              <span className="ml-auto text-[10px] text-muted-foreground">
                Updated {new Date(order.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ==============================
   Main Component: SellerOrdersManagement
   ============================== */
export default function SellerOrdersManagement() {
  const { state, dispatch, formatPrice } = useMarketplace();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Get orders for the current seller (v1 = Lagos TechHub)
  const sellerOrders = state.sellerOrders;

  // Derive metrics from actual orders
  const metrics = useMemo(() => {
    const total = sellerOrders.length;
    const pending = sellerOrders.filter((o) => o.status === "pending").length;
    const processing = sellerOrders.filter((o) => o.status === "processing").length;
    const shipped = sellerOrders.filter((o) => o.status === "shipped").length;
    const delivered = sellerOrders.filter((o) => o.status === "delivered").length;
    const cancelled = sellerOrders.filter((o) => o.status === "cancelled").length;
    const returned = sellerOrders.filter((o) => o.status === "returned").length;
    const revenue = sellerOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0);
    return { total, pending, processing, shipped, delivered, cancelled, returned, revenue };
  }, [sellerOrders]);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = sellerOrders;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q)) ||
          o.shippingAddress.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest": return b.total - a.total;
        case "lowest": return a.total - b.total;
        default: return 0;
      }
    });

    return filtered;
  }, [sellerOrders, search, statusFilter, sortBy]);

  // Build status counts for chips
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of sellerOrders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }, [sellerOrders]);

  const handleCancelOrder = (order: Order) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id: order.id, status: "cancelled" } });
    toast.success(`Order ${order.id} has been cancelled.`);
    setOrderToCancel(null);
  };

  return (
    <div className="space-y-6">
      {/* ===== Metrics Cards ===== */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <MetricsCard label="Total" value={metrics.total} icon={ShoppingCart} color="text-blue-600" />
        <MetricsCard label="Pending" value={metrics.pending} icon={Clock} color="text-amber-600" />
        <MetricsCard label="Processing" value={metrics.processing} icon={Package} color="text-blue-600" />
        <MetricsCard label="Shipped" value={metrics.shipped} icon={Truck} color="text-purple-600" />
        <MetricsCard label="Delivered" value={metrics.delivered} icon={CircleCheck} color="text-emerald-600" />
        <MetricsCard label="Cancelled" value={metrics.cancelled} icon={Ban} color="text-red-600" />
        <MetricsCard label="Revenue" value={`${formatPrice(metrics.revenue)}`} icon={DollarSign} color="text-emerald-600" />
      </div>

      {/* ===== AI Fulfillment Insights ===== */}
      <AIFulfillmentInsights />

      {/* ===== Search & Filter Bar ===== */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID, item, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Sort + Count */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {filteredOrders.length} of {sellerOrders.length} orders
            </span>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="h-9 w-36 text-xs">
                <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Value</SelectItem>
                <SelectItem value="lowest">Lowest Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              statusFilter === "all"
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            All ({sellerOrders.length})
          </button>
          {ORDER_STATUSES.map((status) => {
            const count = statusCounts[status] || 0;
            if (count === 0 && statusFilter !== status) return null;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all ${
                  statusFilter === status
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : STATUS_CHIP_COLORS[status]
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
            >
              <RotateCcw className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ===== Order Cards ===== */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">No orders found</p>
            <p className="text-sm text-muted-foreground/60">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't received any orders yet"}
            </p>
            {(search || statusFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => { setSearch(""); setStatusFilter("all"); }}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset Filters
              </Button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                formatPrice={formatPrice}
                onCancel={setOrderToCancel}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* ===== Cancel Order Confirmation Modal ===== */}
      <Dialog open={orderToCancel !== null} onOpenChange={(open) => { if (!open) setOrderToCancel(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Cancel Order?
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              Are you sure you want to cancel order <strong>{orderToCancel?.id}</strong>?
              This action will notify the buyer and cannot be undone. The order will be
              marked as <strong className="text-red-600">Cancelled</strong> and the buyer
              will be eligible for a full refund.
            </DialogDescription>
          </DialogHeader>

          {/* Order Summary */}
          {orderToCancel && (
            <div className="rounded-lg border bg-muted/20 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium">{orderToCancel.id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">{formatPrice(orderToCancel.total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span>{orderToCancel.items.length} item{orderToCancel.items.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment</span>
                <span className="capitalize">{orderToCancel.paymentMethod?.replace("_", " ") || "M-Pesa"}</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setOrderToCancel(null)}
            >
              No, Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={() => orderToCancel && handleCancelOrder(orderToCancel)}
            >
              Yes, Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}