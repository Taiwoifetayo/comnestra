import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Package, Minus, Plus, Trash,
  ArrowLeft, ArrowRight, CreditCard, Smartphone,
  Building2, Wallet, Check, ShoppingCart, Tag,
  Truck, Shield, BadgeCheck, Sparkles, Percent,
  MapPin, Store, Heart, AlertTriangle, Info,
  Clock, ChevronDown, ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { useMarketplace } from "../context/MarketplaceContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { BTN, CARD, BADGE } from "../constants";
import type { CartItem, Order, PaymentMethod } from "../types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const paymentOptions: { value: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { value: "mpesa", label: "M-Pesa", icon: Smartphone, desc: "Pay with M-Pesa" },
  { value: "card", label: "Card", icon: CreditCard, desc: "Credit/Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer", icon: Building2, desc: "Direct bank transfer" },
  { value: "mobile_money", label: "Mobile Money", icon: Wallet, desc: "Other mobile money" },
];

export default function CartPage() {
  const { state, dispatch, formatPrice, cartTotal } = useMarketplace();
  const [view, setView] = useState<"cart" | "checkout">("cart");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const shippingEstimate = cartTotal > 0 ? (cartTotal * 0.08) : 0;
  const taxEstimate = cartTotal > 0 ? (cartTotal * 0.16) : 0;
  const discount = couponApplied ? cartTotal * 0.1 : 0;
  const grandTotal = cartTotal + shippingEstimate + taxEstimate - discount;

  const handleQuantity = (productId: string, delta: number) => {
    const item = state.cart.find((i) => i.productId === productId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: productId });
      toast.success("Item removed from cart");
    } else {
      dispatch({ type: "UPDATE_CART_QTY", payload: { productId, quantity: newQty } });
    }
  };

  const handleRemove = (productId: string, name: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
    toast.success(`${name} removed from cart`);
  };

  const handleClearCart = () => {
    if (state.cart.length === 0) return;
    dispatch({ type: "CLEAR_CART" });
    toast.success("Cart cleared");
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    if (couponCode.trim().toUpperCase() === "NESTRA10") {
      setCouponApplied(true);
      toast.success("Coupon NESTRA10 applied! 10% off");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleCheckout = () => {
    if (state.cart.length === 0) return;
    const order: Order = {
      id: `ORD-${Date.now()}`,
      buyerId: state.currentUser.id,
      vendorId: state.cart[0].vendorId,
      items: [...state.cart],
      total: grandTotal,
      currency: state.currency,
      status: "pending",
      paymentMethod,
      shippingAddress: "Main Street, Nairobi, Kenya",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "CREATE_ORDER", payload: order });
    dispatch({ type: "SET_ORDER", payload: order });
    dispatch({ type: "CLEAR_CART" });
    toast.success("Order placed successfully! 🎉");
    setView("cart");
    dispatch({ type: "SET_VIEW", payload: "order-success" });
  };

  const groupedByVendor = state.cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.vendorId]) acc[item.vendorId] = [];
    acc[item.vendorId].push(item);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: "SET_VIEW", payload: "browse" })}
            className="h-9 w-9 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {view === "cart" ? "Shopping Cart" : "Checkout"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {state.cart.length} {state.cart.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
        {view === "cart" && state.cart.length > 0 && (
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={handleClearCart}>
            <Trash className="mr-1.5 h-4 w-4" /> Clear All
          </Button>
        )}
      </motion.div>

      {/* Steps indicator */}
      <div className="mb-8 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
          view === "cart" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"
        }`}>1</div>
        <span className={`text-sm font-medium ${view === "cart" ? "text-emerald-700" : "text-muted-foreground"}`}>Cart</span>
        <div className="mx-2 h-px flex-1 bg-muted-foreground/20" />
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
          view === "checkout" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
        }`}>2</div>
        <span className={`text-sm font-medium ${view === "checkout" ? "text-emerald-700" : "text-muted-foreground"}`}>Checkout</span>
      </div>

      {view === "cart" ? (
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Cart Items */}
          <div className="space-y-4">
            {state.cart.length === 0 ? (
              <motion.div variants={itemAnim} className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed py-20 text-muted-foreground">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <ShoppingBag className="h-10 w-10 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Your cart is empty</h3>
                <p className="text-sm">Add some products from the marketplace</p>
                <Button className={BTN.primary + " mt-2"} onClick={() => dispatch({ type: "SET_VIEW", payload: "browse" })}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Continue Shopping
                </Button>
              </motion.div>
            ) : (
              Object.entries(groupedByVendor).map(([vendorId, items]) => (
                <motion.div key={vendorId} variants={itemAnim}>
                  <Card className="overflow-hidden border-emerald-100 shadow-sm">
                    <CardHeader className="border-b bg-emerald-50/50 py-3">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-emerald-600" />
                        <CardTitle className="text-sm font-semibold text-emerald-800">{items[0].vendorName}</CardTitle>
                        <Badge variant="outline" className="ml-auto border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700">
                          <BadgeCheck className="mr-1 h-3 w-3" /> Verified
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-4 border-b border-muted/50 px-4 py-4 last:border-0 hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50">
                            <Package className="h-8 w-8 text-emerald-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-medium text-foreground">{item.name}</h4>
                            <p className="mt-0.5 text-xs text-muted-foreground">{item.vendorName}</p>
                            <p className="mt-1 text-sm font-bold text-emerald-700">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 rounded-lg border bg-white p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantity(item.productId, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantity(item.productId, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemove(item.productId, item.name)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}

            {/* Continue Shopping */}
            <motion.div variants={itemAnim}>
              <Button variant="outline" className="w-full gap-2" onClick={() => dispatch({ type: "SET_VIEW", payload: "browse" })}>
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
              </Button>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            <motion.div variants={itemAnim}>
              <Card className="border-emerald-100 shadow-sm">
                <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-amber-50/30 py-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Tag className="h-4 w-4 text-emerald-600" /> Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{formatPrice(shippingEstimate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (16% VAT)</span>
                    <span className="font-medium">{formatPrice(taxEstimate)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span className="flex items-center gap-1">
                        <Percent className="h-3 w-3" /> Coupon (10%)
                      </span>
                      <span className="font-medium">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-emerald-700">{formatPrice(grandTotal)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Coupon Code */}
            <motion.div variants={itemAnim}>
              <Card className="border-emerald-100 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="h-9 text-sm"
                      disabled={couponApplied}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 flex-shrink-0"
                      onClick={handleApplyCoupon}
                      disabled={couponApplied}
                    >
                      {couponApplied ? <Check className="h-4 w-4 text-emerald-600" /> : "Apply"}
                    </Button>
                  </div>
                  {couponApplied && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
                      <Sparkles className="h-3 w-3" /> NESTRA10 applied — 10% savings!
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={itemAnim}>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="h-3.5 w-3.5 text-emerald-500" /> Free shipping on orders over KES 5,000
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-emerald-500" /> Buyer protection with Nestra AI
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-emerald-500" /> 30-day return policy
                </div>
              </div>
            </motion.div>

            {/* Checkout Button */}
            <motion.div variants={itemAnim}>
              <Button
                className={BTN.primary + " w-full h-11 text-base gap-2"}
                disabled={state.cart.length === 0}
                onClick={() => {
                  if (state.cart.length > 0) setView("checkout");
                }}
              >
                {state.cart.length > 0 ? (
                  <>Proceed to Checkout <ArrowRight className="h-4 w-4" /></>
                ) : (
                  "Cart is empty"
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        /* Checkout View */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          className="grid gap-6 lg:grid-cols-[1fr_380px]"
        >
          <div className="space-y-6">
            {/* Payment Method */}
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-amber-50/30 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <CreditCard className="h-4 w-4 text-emerald-600" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {paymentOptions.map(({ value, label, icon: Icon, desc }) => (
                    <Button
                      key={value}
                      variant={paymentMethod === value ? "default" : "outline"}
                      className={`flex flex-col items-center gap-1.5 py-5 h-auto ${
                        paymentMethod === value ? "border-emerald-500 bg-emerald-50 text-emerald-800" : ""
                      }`}
                      onClick={() => setPaymentMethod(value)}
                    >
                      <Icon className={`h-5 w-5 ${paymentMethod === value ? "text-emerald-600" : ""}`} />
                      <span className="text-xs font-medium">{label}</span>
                      <span className="text-[10px] text-muted-foreground">{desc}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-amber-50/30 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-emerald-600" /> Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium">Main Street, Nairobi, Kenya</p>
                    <p className="text-xs text-muted-foreground">Estimated delivery: 3-5 business days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items Review */}
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-amber-50/30 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Package className="h-4 w-4 text-emerald-600" /> Items ({state.cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="max-h-64">
                  {state.cart.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 border-b px-4 py-3 last:border-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                        <Package className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-700">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 gap-2" onClick={() => setView("cart")}>
                <ArrowLeft className="h-4 w-4" /> Back to Cart
              </Button>
              <Button className={BTN.primary + " flex-1 gap-2"} onClick={handleCheckout}>
                <Check className="h-4 w-4" /> Place Order
              </Button>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="space-y-4">
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-amber-50/30 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Tag className="h-4 w-4 text-emerald-600" /> Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(shippingEstimate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (16% VAT)</span>
                  <span>{formatPrice(taxEstimate)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span className="flex items-center gap-1"><Percent className="h-3 w-3" /> Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-emerald-700">{formatPrice(grandTotal)}</span>
                </div>
                <div className="rounded-lg bg-emerald-50 p-2 text-center text-xs text-emerald-700">
                  <Shield className="mr-1 inline-block h-3 w-3" /> Secured by Nestra AI
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}