import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketplace } from "../context/MarketplaceContext";
import type { Order, DeliveryTimelineStep } from "../types";
import { toast } from "sonner";
import {
  Package,
  Clock,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ShoppingBag,
  DownloadSimple,
  ArrowsClockwise,
  ArrowCounterClockwise,
  Headset,
  Robot,
  ClipboardText,
  Receipt,
  MagnifyingGlass,
  FunnelSimple,
  SlidersHorizontal,
  SpinnerGap,
  CaretDown,
  DotsThreeVertical,
  ShoppingCart,
} from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

/* ─── Status helpers ─── */
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipped: "bg-violet-100 text-violet-700 border-violet-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/* ─── Timeline config ─── */
const TIMELINE_STAGES: { key: string; icon: typeof Package; label: string }[] = [
  { key: "placed", icon: Package, label: "Order Placed" },
  { key: "payment", icon: CreditCard, label: "Payment Confirmed" },
  { key: "processing", icon: Clock, label: "Processing" },
  { key: "shipped", icon: Truck, label: "Shipped" },
  { key: "transit", icon: MapPin, label: "In Transit" },
  { key: "delivered", icon: CheckCircle, label: "Delivered" },
];

function statusToTimelineIndex(status: string): number {
  const map: Record<string, number> = {
    pending: 0,
    processing: 2,
    shipped: 3,
    delivered: 5,
    cancelled: -1,
  };
  return map[status] ?? 0;
}

/* ─── Timeline Component ─── */
function DeliveryTimeline({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const completedIndex = statusToTimelineIndex(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="rounded-xl border bg-gradient-to-br from-white to-emerald-50/50 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Delivery Timeline
            </h4>
            {order.trackingNumber && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Tracking: <span className="font-mono font-medium text-emerald-700">{order.trackingNumber}</span>
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClose}>
            Close
          </Button>
        </div>

        {order.estimatedDelivery && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs">
            <Clock className="h-3.5 w-3.5 text-emerald-600" weight="fill" />
            <span className="text-emerald-800">
              Estimated delivery: <strong>{order.estimatedDelivery}</strong>
            </span>
          </div>
        )}

        {/* Timeline Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-0.5 bg-gray-200" />
          <div
            className="absolute left-[15px] top-2 w-0.5 bg-emerald-500 transition-all duration-700"
            style={{
              height: isCancelled
                ? "0%"
                : `${Math.min((completedIndex + 1) / TIMELINE_STAGES.length, 1) * 100}%`,
            }}
          />

          <div className="relative space-y-5">
            {(order.deliveryTimeline ?? []).length > 0
              ? order.deliveryTimeline!.map((step, i) => (
                  <TimelineStepItem
                    key={i}
                    step={step}
                    isLast={i === (order.deliveryTimeline?.length ?? 0) - 1}
                    isCancelled={isCancelled}
                  />
                ))
              : TIMELINE_STAGES.map((stage, i) => {
                  const isCompleted = !isCancelled && i <= completedIndex;
                  const isCurrent = !isCancelled && i === completedIndex + 1;
                  const Icon = stage.icon;
                  return (
                    <div key={stage.key} className="flex items-start gap-3">
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                          isCompleted
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : isCurrent
                              ? "border-emerald-400 bg-white text-emerald-600 ring-2 ring-emerald-200"
                              : isCancelled
                                ? "border-red-300 bg-red-50 text-red-400"
                                : "border-gray-300 bg-white text-gray-400"
                        }`}
                      >
                        <Icon className="h-4 w-4" weight={isCompleted ? "fill" : "bold"} />
                      </div>
                      <div className="flex-1 pt-1">
                        <p
                          className={`text-sm font-medium ${
                            isCompleted
                              ? "text-emerald-700"
                              : isCurrent
                                ? "text-foreground"
                                : "text-muted-foreground"
                          }`}
                        >
                          {stage.label}
                        </p>
                        {isCurrent && (
                          <p className="mt-0.5 text-xs text-emerald-600">In progress...</p>
                        )}
                        {isCancelled && i === 0 && (
                          <p className="mt-0.5 text-xs text-red-500">Order was cancelled</p>
                        )}
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TimelineStepItem({
  step,
  isLast,
  isCancelled,
}: {
  step: DeliveryTimelineStep;
  isLast: boolean;
  isCancelled: boolean;
}) {
  const isCompleted = step.completed;
  const iconMap: Record<string, typeof Package> = {
    Package,
    CreditCard,
    Clock,
    Truck,
    MapPin,
    CheckCircle,
  };
  const Icon = iconMap[step.icon] || Package;

  return (
    <div className="flex items-start gap-3">
      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
          isCompleted
            ? "border-emerald-500 bg-emerald-500 text-white"
            : isCancelled
              ? "border-red-300 bg-red-50 text-red-400"
              : "border-gray-300 bg-white text-gray-400"
        }`}
      >
        <Icon className="h-4 w-4" weight={isCompleted ? "fill" : "bold"} />
      </div>
      <div className="flex-1 pt-1">
        <p className={`text-sm font-medium ${isCompleted ? "text-emerald-700" : "text-muted-foreground"}`}>
          {step.label}
        </p>
        <p className="text-xs text-muted-foreground">{step.description}</p>
        {step.timestamp && (
          <p className="mt-0.5 text-[11px] text-muted-foreground/60">{step.timestamp}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Order Card ─── */
function OrderCard({
  order,
  expandedId,
  onToggleExpand,
  formatPrice,
  dispatch,
}: {
  order: Order;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  formatPrice: (amount: number, currency?: string) => string;
  dispatch: any;
}) {
  const isExpanded = expandedId === order.id;
  const statusColor = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md"
    >
      {/* Order Header */}
      <div
        className="flex cursor-pointer flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        onClick={() => onToggleExpand(order.id)}
      >
        <div className="flex items-start gap-3 sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
            <Package className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                Order #{order.id.slice(0, 8)}
              </p>
              <Badge className={`border px-2 py-0 text-[10px] font-medium ${statusColor}`}>
                {STATUS_LABELS[order.status] || order.status}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {itemCount} item{itemCount !== 1 ? "s" : ""} &middot;{" "}
              {formatPrice(order.total, order.currency)} &middot;{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {order.estimatedDelivery && (
            <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
              <Clock className="h-3 w-3" />
              <span>Est. {order.estimatedDelivery}</span>
            </div>
          )}
          <CaretDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t"
          >
            <div className="space-y-4 p-4">
              {/* Order Items */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">ITEMS</p>
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 rounded-lg bg-muted/30 p-2"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-emerald-100 to-amber-100 text-xs font-bold text-emerald-700">
                      {item.quantity}x
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.vendorName} &middot; {formatPrice(item.price, order.currency)} each
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity, order.currency)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-muted-foreground">Payment</p>
                  <p className="mt-0.5 capitalize">{order.paymentMethod.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Shipping</p>
                  <p className="mt-0.5">{order.shippingAddress}</p>
                </div>
                {order.trackingNumber && (
                  <div className="col-span-2">
                    <p className="font-medium text-muted-foreground">Tracking Number</p>
                    <p className="mt-0.5 font-mono text-emerald-700">{order.trackingNumber}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Delivery Timeline */}
              <DeliveryTimeline
                order={order}
                onClose={() => onToggleExpand(order.id)}
              />

              {/* Buyer Actions */}
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success("Contact request sent to seller");
                  }}
                >
                  <Headset className="h-3.5 w-3.5" />
                  Contact Seller
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success("Invoice downloaded as PDF");
                  }}
                >
                  <DownloadSimple className="h-3.5 w-3.5" />
                  Download Invoice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "SET_VIEW", payload: "browse" });
                    toast.success("Browsing similar products");
                  }}
                >
                  <ArrowsClockwise className="h-3.5 w-3.5" />
                  Buy Again
                </Button>
                {order.status === "delivered" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success("Return request submitted");
                    }}
                  >
                    <ArrowCounterClockwise className="h-3.5 w-3.5" />
                    Request Return
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Nestra AI Assistant Card ─── */
function NestraAIDeliveryCard() {
  const suggestions = [
    "Track my latest order",
    "When will my package arrive?",
    "Can I change my delivery address?",
    "What's my return window?",
  ];

  return (
    <Card className="overflow-hidden border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500 shadow-sm">
            <Robot className="h-4 w-4 text-white" weight="fill" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">Nestra AI Delivery Assistant</CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Ask me anything about your orders
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((s) => (
          <Button
            key={s}
            variant="ghost"
            className="h-auto w-full justify-start rounded-lg px-3 py-2 text-left text-xs text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700"
            onClick={() => toast.success(`Nestra AI: ${s}`)}
          >
            <span className="mr-2 text-emerald-400">&ldquo;</span>
            {s}
          </Button>
        ))}
        <div className="flex gap-2 pt-1">
          <Input
            placeholder="Ask Nestra about your order..."
            className="h-9 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                toast.success("Nestra AI: Let me check your order status...");
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />
          <Button
            size="sm"
            className="h-9 gap-1 bg-gradient-to-r from-emerald-600 to-amber-500 text-xs text-white hover:from-emerald-700 hover:to-amber-600"
            onClick={() => toast.success("Nestra AI: Let me check your order status...")}
          >
            Ask
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Main Page ─── */
export default function OrderHistoryPage() {
  const { state, dispatch, formatPrice } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const orders = state.orders;

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
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
    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, searchQuery, statusFilter]);

  const statuses = useMemo(() => {
    const set = new Set(orders.map((o) => o.status));
    return ["all", ...Array.from(set)];
  }, [orders]);

  const handleBack = () => {
    dispatch({ type: "SET_VIEW", payload: "browse" });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">My Orders</h1>
            <p className="text-xs text-muted-foreground">
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID, item, or address..."
            className="pl-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {statuses.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              className={`h-8 whitespace-nowrap text-xs ${
                statusFilter === s ? "bg-emerald-600 hover:bg-emerald-700" : ""
              }`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : STATUS_LABELS[s] || s}
            </Button>
          ))}
        </div>
      </div>

      {/* Order List */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <SpinnerGap className="h-8 w-8 animate-spin text-emerald-600" />
          </motion.div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't placed any orders yet. Start shopping!"}
            </p>
            <Button
              className="mt-4 gap-2 bg-gradient-to-r from-emerald-600 to-amber-500 text-white hover:from-emerald-700 hover:to-amber-600"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "browse" })}
            >
              <ShoppingCart className="h-4 w-4" />
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <motion.div key="list" className="space-y-3">
            {/* Nestra AI Card */}
            <NestraAIDeliveryCard />

            {/* Order Cards */}
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                expandedId={expandedId}
                onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
                formatPrice={formatPrice}
                dispatch={dispatch}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}