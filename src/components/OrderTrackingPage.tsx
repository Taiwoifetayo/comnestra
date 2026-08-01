import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Package,
  Truck,
  Check,
  X,
  Copy,
  MapPin,
  Calendar,
  ChevronDown,
  Search,
  ArrowLeft,
  CircleCheck,
  ShoppingBag,
  Clock,
  Timer,
  PackageSearch,
  MapPinned,
  FileText,
  ChevronRight,
  Store,
  CreditCard,
  Smartphone,
  Wallet,
  Receipt,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useMarketplace } from "../context/MarketplaceContext";
import type { Order, OrderTrackingData, DeliveryStage } from "../types";

const STATUS_BADGE_VARIANTS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  processing: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  cancelled: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
};

const STAGE_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: CircleCheck,
  processing: Package,
  shipped: Truck,
  in_transit: Truck,
  out_for_delivery: MapPinned,
  delivered: Check,
  cancelled: X,
};

const STAGE_LABELS: Record<string, string> = {
  pending: "Awaiting Confirmation",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_ICONS: Record<string, React.ElementType> = {
  mpesa: Smartphone,
  mobile_money: Smartphone,
  card: CreditCard,
  bank_transfer: Wallet,
};

const PAYMENT_LABELS: Record<string, string> = {
  mpesa: "M-Pesa",
  mobile_money: "Mobile Money",
  card: "Card Payment",
  bank_transfer: "Bank Transfer",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatPrice(amount: number, currency: string): string {
  const sym: Record<string, string> = { USD: "$", KES: "KSh ", NGN: "₦", GHS: "GH₵", ZAR: "R" };
  return `${sym[currency] || "$"}${amount.toFixed(2)}`;
}

function DeliveryTimeline({ tracking }: { tracking: OrderTrackingData }) {
  const [expanded, setExpanded] = useState(false);
  const stageIdx = tracking.stages.indexOf(tracking.currentStage);
  const visibleEvents = expanded ? tracking.events : tracking.events.slice(-3);

  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>{STAGE_LABELS[tracking.stages[0]]}</span>
          <span className="font-medium text-emerald-600">{STAGE_LABELS[tracking.currentStage]}</span>
          <span>{STAGE_LABELS[tracking.stages[tracking.stages.length - 1]]}</span>
        </div>
        <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-500 to-amber-500"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.round((stageIdx / (tracking.stages.length - 1)) * 100)}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          {tracking.stages.map((stage, i) => {
            const isActive = i <= stageIdx;
            const isCurrent = i === stageIdx;
            return (
              <motion.div
                key={stage}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex items-center justify-center rounded-full border-2 transition-all ${
                  isCurrent
                    ? "h-5 w-5 border-emerald-500 bg-white shadow-lg shadow-emerald-200"
                    : isActive
                    ? "h-3.5 w-3.5 border-emerald-400 bg-emerald-400"
                    : "h-3 w-3 border-muted-foreground/30 bg-white"
                }`}
                style={{ left: `${(i / (tracking.stages.length - 1)) * 100}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 15 }}
              >
                {isCurrent && (
                  <motion.div
                    className="h-2 w-2 rounded-full bg-emerald-500"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>{formatDate(tracking.events[0]?.timestamp || "")}</span>
          <span>{formatDate(tracking.estimatedDelivery)}</span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg border bg-gradient-to-br from-emerald-50/50 to-transparent p-2.5">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Tracking #</p>
          <div className="flex items-center gap-1 mt-0.5">
            <p className="text-xs font-semibold text-emerald-700 truncate">{tracking.trackingNumber}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0"
              onClick={() => { navigator.clipboard.writeText(tracking.trackingNumber); toast.success("Tracking number copied"); }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="rounded-lg border bg-gradient-to-br from-amber-50/50 to-transparent p-2.5">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Carrier</p>
          <p className="text-xs font-semibold mt-0.5">{tracking.carrier}</p>
        </div>
        <div className="rounded-lg border bg-gradient-to-br from-blue-50/50 to-transparent p-2.5">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">From</p>
          <p className="text-xs font-semibold mt-0.5 truncate">{tracking.shippedFrom}</p>
        </div>
        <div className="rounded-lg border bg-gradient-to-br from-purple-50/50 to-transparent p-2.5">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">To</p>
          <p className="text-xs font-semibold mt-0.5 truncate">{tracking.shippedTo}</p>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="space-y-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tracking History</h4>
          <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show Less" : `Show All (${tracking.events.length})`}
            <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          </Button>
        </div>
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-muted-foreground/20" />
          <AnimatePresence>
            {visibleEvents.map((event, i) => {
              const Icon = STAGE_ICONS[event.stage] || Package;
              const isCompleted = tracking.stages.indexOf(event.stage) <= stageIdx;
              const isLast = i === visibleEvents.length - 1;
              return (
                <motion.div
                  key={event.stage}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, ease: "easeOut" }}
                  className={`relative pb-4 ${isLast ? "pb-0" : ""}`}
                >
                  <div
                    className={`absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full border-2 z-10 ${
                      isCompleted
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-muted-foreground/20 bg-white"
                    }`}
                  >
                    {isCompleted ? (
                      <Icon className="h-2.5 w-2.5 text-emerald-600" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
                  <div className={`ml-2 rounded-lg border p-2.5 ${isCompleted ? "bg-white" : "bg-muted/20"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${isCompleted ? "text-emerald-800" : "text-muted-foreground"}`}>
                          {event.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{event.description}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {formatDateTime(event.timestamp)}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground/70">
                        <MapPin className="h-2.5 w-2.5" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function OrderDetailCard({ order, onBack }: { order: Order; onBack: () => void }) {
  const { state } = useMarketplace();
  const PayIcon = PAYMENT_ICONS[order.paymentMethod] || Smartphone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {/* Back button */}
      <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Button>

      {/* Order Header */}
      <Card className="overflow-hidden border-emerald-100">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-100 uppercase tracking-wider">Order</p>
              <p className="text-sm font-bold text-white">{order.id}</p>
            </div>
            <Badge className={`${STATUS_BADGE_VARIANTS[order.status]} text-xs border-0`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Ordered: <strong className="text-foreground">{formatDate(order.createdAt)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <PayIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Paid via <strong className="text-foreground">{PAYMENT_LABELS[order.paymentMethod]}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">{order.items.length} item{order.items.length > 1 ? "s" : ""}: <strong className="text-foreground">{formatPrice(order.total, order.currency)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Store className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">From <strong className="text-foreground">{order.items[0]?.vendorName || "Unknown"}</strong></span>
            </div>
          </div>

          {/* Items preview */}
          <div className="rounded-lg border bg-muted/20 p-2.5">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Items</p>
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1 text-xs">
                <span className="truncate">{item.name} x{item.quantity}</span>
                <span className="font-medium ml-2 shrink-0">{formatPrice(item.price * item.quantity, order.currency)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      {order.tracking && (
        <Card className="border-emerald-100">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-emerald-600" />
              Delivery Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <DeliveryTimeline tracking={order.tracking} />
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer rounded-xl border border-border/60 bg-white p-3.5 transition-all hover:shadow-md hover:border-emerald-200 active:scale-[0.98]"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-emerald-700">{order.id}</p>
            <Badge className={`${STATUS_BADGE_VARIANTS[order.status]} text-[10px] px-1.5 py-0`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {order.items.map((i) => i.name).join(", ")}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(order.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" />
              {order.items.length} item{order.items.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <p className="text-sm font-bold text-emerald-700">{formatPrice(order.total, order.currency)}</p>
          {order.tracking && (
            <div className="flex items-center gap-1 text-[10px] text-emerald-600">
              <Truck className="h-3 w-3" />
              <span>{STAGE_LABELS[order.tracking.currentStage]}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function OrderHistoryView({ orders, onSelectOrder }: { orders: Order[]; onSelectOrder: (o: Order) => void }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = useMemo(() => {
    let result = orders;
    if (tab === "active") result = result.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
    if (tab === "completed") result = result.filter((o) => o.status === "delivered" || o.status === "cancelled");
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [orders, tab, search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-emerald-800">My Orders</h2>
          <p className="text-xs text-muted-foreground">{orders.length} total order{orders.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Search + Tabs */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search orders by ID or item..."
          className="pl-9 h-9 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full bg-muted/50 p-0.5">
          {[
            { value: "all", label: "All Orders", count: orders.length },
            { value: "active", label: "Active", count: orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length },
            { value: "completed", label: "Completed", count: orders.filter((o) => o.status === "delivered" || o.status === "cancelled").length },
          ].map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="flex-1 gap-1.5 text-xs h-8">
              {t.label}
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">{t.count}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-0 pt-3">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-3">
                <PackageSearch className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {search ? "No matching orders found" : "No orders yet"}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {search ? "Try a different search term" : "Your orders will appear here once you make a purchase"}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filtered.map((order) => (
                  <OrderCard key={order.id} order={order} onClick={() => onSelectOrder(order)} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function OrderTrackingPage() {
  const { state, dispatch } = useMarketplace();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const buyerOrders = useMemo(
    () => state.orders.filter((o) => o.buyerId === state.currentUser.id),
    [state.orders, state.currentUser.id]
  );

  return (
    <div className="mx-auto max-w-2xl">
      <AnimatePresence mode="wait">
        {selectedOrder ? (
          <OrderDetailCard key="detail" order={selectedOrder} onBack={() => setSelectedOrder(null)} />
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OrderHistoryView orders={buyerOrders} onSelectOrder={setSelectedOrder} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}