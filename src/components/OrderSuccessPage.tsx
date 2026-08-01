import { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleCheck,
  Sparkles,
  PartyPopper,
  Package,
  ShoppingBag,
  Star,
  MapPin,
  CreditCard,
  Truck,
  Clock,
  ArrowRight,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMarketplace } from "@/context/MarketplaceContext";
import { toast } from "sonner";
import type { Product } from "@/types";

const CONFETTI_COLORS = [
  "#10B981", "#059669", "#34D399", "#6EE7B7",
  "#F59E0B", "#FBBF24", "#FCD34D",
  "#3B82F6", "#60A5FA",
  "#8B5CF6", "#A78BFA",
  "#EC4899", "#F472B6",
];

function ConfettiParticle({ index, delay }: { index: number; delay: number }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const x = Math.random() * 100;
  const rotation = Math.random() * 360;
  const size = 6 + Math.random() * 8;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: -10 }}
      initial={{ y: -20, opacity: 1, rotate: 0, scale: 0 }}
      animate={{
        y: typeof window !== "undefined" ? window.innerHeight * 0.6 : 400,
        opacity: [1, 1, 0],
        rotate: rotation * 3,
        scale: [0, 1, 0.5],
      }}
      transition={{
        duration: 2.5 + Math.random() * 1.5,
        delay,
        ease: "easeInOut",
        repeat: 0,
      }}
    >
      <div
        className="rounded-sm"
        style={{
          width: size,
          height: size * 1.4,
          backgroundColor: color,
          borderRadius: 2,
        }}
      />
    </motion.div>
  );
}

export default function OrderSuccessPage() {
  const { state, dispatch, formatPrice } = useMarketplace();
  const order = state.currentOrder;
  const hasDispatched = useRef(false);

  useEffect(() => {
    if (!order && !hasDispatched.current) {
      hasDispatched.current = true;
      dispatch({ type: "SET_VIEW", payload: "browse" });
    }
  }, [order, dispatch]);

  const recommendedProducts = useMemo(() => {
    if (!order) return [];
    const orderedIds = new Set(order.items.map((i) => i.productId));
    return state.products
      .filter((p) => !orderedIds.has(p.id) && p.stock > 0)
      .slice(0, 4);
  }, [order, state.products]);

  if (!order) return null;

  const handleContinueShopping = () => {
    dispatch({ type: "SET_VIEW", payload: "browse" });
  };

  const handleViewOrder = () => {
    dispatch({ type: "SET_VIEW", payload: "orders" });
  };

  const handleProductClick = (product: Product) => {
    dispatch({ type: "SET_SELECTED_PRODUCT", payload: product.id });
    dispatch({ type: "SET_VIEW", payload: "product" });
  };

  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    index: i,
    delay: i * 0.08,
  }));

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {confettiParticles.map((p) => (
          <ConfettiParticle key={p.index} index={p.index} delay={p.delay} />
        ))}
      </div>

      {/* Success Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25"
        >
          <CircleCheck className="h-10 w-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mb-2 text-3xl font-bold tracking-tight"
        >
          Order Confirmed!{" "}
          <span className="inline-block">
            <PartyPopper className="inline-block h-7 w-7 text-amber-400" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-muted-foreground"
        >
          Thank you for your purchase. Your order has been placed successfully.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Clock className="h-4 w-4" />
          <span>
            Estimated delivery:{" "}
            <span className="font-medium text-foreground">
              {new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </span>
        </motion.div>
      </motion.div>

      {/* Order Confirmation Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Card className="overflow-hidden border-emerald-500/20 shadow-xl shadow-emerald-500/5">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-semibold">Order #{order.id}</span>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Order Items */}
            <div className="mb-6 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Items ({itemCount})
              </h3>
              {order.items.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + Math.random() * 0.3 }}
                  className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 text-emerald-500">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </motion.div>
              ))}
            </div>

            <Separator className="mb-4" />

            {/* Order Details Grid */}
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg bg-muted/20 p-3">
                <MapPin className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Shipping Address
                  </p>
                  <p className="text-sm">{order.shippingAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted/20 p-3">
                <CreditCard className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Payment Method
                  </p>
                  <p className="text-sm capitalize">{order.paymentMethod}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted/20 p-3">
                <Truck className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Delivery
                  </p>
                  <p className="text-sm">
                    {new Date(
                      Date.now() + 5 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted/20 p-3">
                <Clock className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Order Date
                  </p>
                  <p className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="mb-4" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Total Paid
              </span>
              <span className="text-2xl font-bold text-emerald-500">
                {formatPrice(order.total, order.currency)}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Nestra AI Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="mt-6"
      >
        <Card className="overflow-hidden border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-transparent shadow-lg shadow-violet-500/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Nestra AI Insight</h3>
                  <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-[10px] text-white">
                    AI
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Great choices! Based on your order, we recommend pairing your{" "}
                  <span className="font-medium text-foreground">
                    {order.items[0]?.name || "item"}
                  </span>{" "}
                  with our trending accessories. You've saved{" "}
                  <span className="font-medium text-emerald-500">
                    ${(order.total * 0.12).toFixed(2)}
                  </span>{" "}
                  compared to average market prices. Also, your estimated
                  delivery is well within our standard SLA — you'll receive a
                  tracking update within 24 hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <Button
          onClick={handleContinueShopping}
          className="flex-1 gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleViewOrder}
          variant="outline"
          className="flex-1 gap-2 border-emerald-500/20"
        >
          <Heart className="h-4 w-4" />
          View Order History
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={() => {
            navigator.clipboard?.writeText(
              `${window.location.origin}/order/${order.id}`
            );
            toast.success("Order link copied!");
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-10"
        >
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold">You Might Also Like</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {recommendedProducts.map((product, i) => (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.4 }}
                onClick={() => handleProductClick(product)}
                className="group relative overflow-hidden rounded-xl border bg-card p-3 text-left shadow-sm transition-all hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/10"
              >
                <div className="mb-2 flex h-20 w-full items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/10 to-emerald-600/10">
                  <ShoppingBag className="h-8 w-8 text-emerald-500/40 group-hover:text-emerald-500/60 transition-colors" />
                </div>
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sellerName || product.vendorId}</p>
                <p className="mt-1 text-sm font-semibold text-emerald-500">
                  {formatPrice(product.price, product.currency)}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}