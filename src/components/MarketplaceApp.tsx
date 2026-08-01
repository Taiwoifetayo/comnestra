import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ShoppingCart, Store, User, Shield, Search, ChevronDown, X, Plus, Minus,
  Trash, Check, BarChart, MapPin, Globe, Sparkles, MessageCircle,
  DollarSign, Clock, Menu, Heart, Star, Filter, Grid,
  List, RefreshCw, Upload, TrendingUp, Wallet, Truck, CreditCard,
  AlertTriangle, Bell, Eye, Edit, Users, Activity, FileText,
  ThumbsUp, Zap, Info, Bot, ShoppingBag, Tag, Layers, Building2, Layout,
  Loader, Award, Target, UserCheck, Smartphone, Mail, Phone, HelpCircle,
  ExternalLink, Gift, SlidersHorizontal,
  BadgeCheck, Percent, ArrowUpDown, ChevronLeft, ChevronRight, ArrowRight, RotateCcw,
  Timer, CircleCheck, Wheat, Shirt, Laptop, PaintBucket, Coffee, Gem, Sun, Leaf,
  ArrowLeft, Brain, Boxes, ChartBar
} from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";
import { Button } from "./ui/button";
import CartPage from "./CartPage";
import OrderSuccessPage from "./OrderSuccessPage";
import OrderHistoryPage from "./OrderHistoryPage";
import SellerProductManagement from "./SellerProductManagement";
import SellerInventoryManagement from "./SellerInventoryManagement";
import SellerOrdersManagement from "./SellerOrdersManagement";
import SellerAnalyticsDashboard from "./SellerAnalyticsDashboard";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "./ui/drawer";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "./ui/sheet";
import type { Product, CartItem, Order, Vendor, CurrencyCode, UserRole, OrderStatus, PaymentMethod, Review } from "../types";
import { CURRENCIES, CATEGORIES, SELLER_KPIS, ADMIN_METRICS, DISPUTE_LOGS, PRODUCTS, REVIEWS, BTN, INPUT, CARD, BADGE, STATUS_BADGE, TYPO } from "../constants";

const roleIcons: Record<UserRole, React.ReactNode> = {
  buyer: <ShoppingCart className="h-4 w-4" />,
  seller: <Store className="h-4 w-4" />,
  admin: <Shield className="h-4 w-4" />,
};

const roleLabels: Record<UserRole, string> = {
  buyer: "Buyer",
  seller: "Seller",
  admin: "Admin",
};

const CategoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cat1: Wheat,
  cat2: Shirt,
  cat3: Laptop,
  cat4: PaintBucket,
  cat5: Coffee,
  cat6: Gem,
  cat7: Sun,
  cat8: Leaf,
  cat9: ShoppingBag,
  cat10: Tag,
};

/* Product thumbnail URLs from generated images */
const PRODUCT_THUMBNAILS: Record<string, string> = {
  p1: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/smartpro-laptop-1f93d63e-1785541500475.webp',
  p2: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/wireless-earbuds-47197f84-1785541496778.webp',
  p3: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/handwoven-kikoy-blanket-967980cf-1785541497636.webp',
  p4: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/maasai-beaded-jewelry-d2b0d4cf-1785541497184.webp',
  p5: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/kente-cloth-stole-c69b4644-1785541497351.webp',
  p6: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/batik-print-shirt-be1c67ae-1785541499637.webp',
  p7: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/protea-candle-collection-eadefabe-1785541500702.webp',
  p8: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/african-oak-serving-board-80d97430-1785541500429.webp',
  p9: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/egyptian-cotton-bed-set-d15bfa6a-1785541502010.webp',
  p10: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4286d2b3-6e5f-435f-8c99-326fd3db962d/solar-power-bank-d15a7348-1785541502890.webp',
};

function ProductThumbnail({ product, className }: { product: Product; className?: string }) {
  const src = PRODUCT_THUMBNAILS[product.id];
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <svg viewBox="0 0 200 200" className={className}>
        <rect width="200" height="200" fill="%23ecfdf5"/>
        <rect x="70" y="65" width="60" height="70" rx="6" fill="%23059869" opacity="0.25"/>
        <path d="M70 65 L100 45 L130 65" fill="none" stroke="%23059869" stroke-width="3" opacity="0.35"/>
      </svg>
    );
  }
  return <img src={src} alt={product.name} className={`${className} object-cover`} onError={() => setError(true)} />;
}

function ProductCard({ product, onView }: { product: Product; onView: () => void }) {
  const { formatPrice } = useMarketplace();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.originalPrice!) * 100) : 0;
  const isLowStock = product.stockStatus === "Low Stock";
  const isOutOfStock = product.stockStatus === "Out of Stock";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${CARD.interactive} group relative`}
      onClick={onView}
    >
      {/* Image / Icon Area */}
      <div className="relative mb-3 flex h-44 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50">
        <ProductThumbnail product={product} className="h-16 w-16 transition-transform group-hover:scale-110" />
        {/* AI Pick Badge */}
        {product.isAiPick && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
            <Sparkles className="h-3 w-3" /> AI Pick
          </div>
        )}
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
            <Percent className="h-3 w-3" /> -{discountPct}%
          </div>
        )}
        {/* Stock Status */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-red-600">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        {/* Region + Rating Row */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">{product.region}</Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {product.rating}
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold leading-tight">{product.name}</h3>

        {/* Seller + Location Row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Store className="h-3 w-3" />
            {product.sellerName || "Vendor"}
            {product.verifiedSeller && <BadgeCheck className="h-3 w-3 text-emerald-500" />}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {product.location}
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-bold text-emerald-700">{formatPrice(product.price, product.currency)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice!, product.currency)}
            </span>
          )}
        </div>

        {/* Stock Status + Delivery */}
        <div className="flex items-center justify-between text-xs">
          <span className={`flex items-center gap-1 ${
            isOutOfStock ? "text-red-500" : isLowStock ? "text-amber-600" : "text-emerald-600"
          }`}>
            <CircleCheck className="h-3 w-3" />
            {product.stockStatus || "In Stock"}
          </span>
          {product.deliveryEstimate && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Truck className="h-3 w-3" />
              {product.deliveryEstimate}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}



function ProductDetailModal({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const { formatPrice, dispatch, state } = useMarketplace();
  const vendor = state.vendors.find((v) => v.id === product.vendorId);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.originalPrice!) * 100) : 0;
  const isLowStock = product.stockStatus === "Low Stock";
  const isOutOfStock = product.stockStatus === "Out of Stock";

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This item is currently out of stock");
      return;
    }
    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: "",
      vendorId: product.vendorId,
      vendorName: vendor?.name || product.sellerName || "Unknown",
    };
    dispatch({ type: "ADD_TO_CART", payload: item });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {product.name}
            {product.isAiPick && (
              <Badge className={BADGE.ai}>
                <Sparkles className="mr-1 h-3 w-3" /> AI Pick
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription asChild>
            <div />
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 p-12">
            <ProductThumbnail product={product} className="h-24 w-24" />
            {hasDiscount && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                <Percent className="h-3 w-3" /> -{discountPct}%
              </div>
            )}
            {product.isAiPick && (
              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
                <Sparkles className="h-3 w-3" /> AI Pick
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            {/* AI Insight */}
            {product.aiSummary && (
              <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-amber-50 p-3 text-sm">
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" /> Nestra AI Insight
                </span>
                <p className="mt-1 text-muted-foreground">{product.aiSummary}</p>
              </div>
            )}

            {/* Seller Info */}
            <div className="flex items-center gap-2 text-sm">
              <Store className="h-4 w-4 text-muted-foreground" />
              <span>{product.sellerName || vendor?.name || "Vendor"}</span>
              {product.verifiedSeller && (
                <Badge variant="outline" className="text-emerald-600">
                  <BadgeCheck className="mr-0.5 h-3 w-3" /> Verified
                </Badge>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{product.location || product.region}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Delivery Estimate */}
            {product.deliveryEstimate && (
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span>Delivery: {product.deliveryEstimate}</span>
              </div>
            )}

            <Separator />

            {/* Price + Stock */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-emerald-700">{formatPrice(product.price, product.currency)}</span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice!, product.currency)}
                  </span>
                )}
              </div>
              <span className={`flex items-center gap-1 text-sm ${
                isOutOfStock ? "text-red-500" : isLowStock ? "text-amber-600" : "text-emerald-600"
              }`}>
                <CircleCheck className="h-3.5 w-3.5" />
                {product.stockStatus || "In Stock"}
              </span>
            </div>

            {/* Add to Cart */}
            <Button onClick={handleAddToCart} className={BTN.primary + " w-full"} disabled={isOutOfStock}>
              <ShoppingCart className="mr-2 h-4 w-4" /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CartDrawer() {
  const { state, dispatch, formatPrice, cartTotal } = useMarketplace();
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");

  const handleCheckout = () => {
    if (state.cart.length === 0) return;
    const order: Order = {
      id: `ORD-${Date.now()}`,
      buyerId: state.currentUser.id,
      vendorId: state.cart[0].vendorId,
      items: [...state.cart],
      total: cartTotal,
      currency: state.currency,
      status: "pending",
      paymentMethod,
      shippingAddress: "Main Street, Nairobi, Kenya",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "CREATE_ORDER", payload: order });
    toast.success(`Order placed successfully via ${paymentMethod === "mpesa" ? "M-Pesa" : paymentMethod === "card" ? "Card" : "Bank Transfer"}`);
    setOpen(false);
    setCheckout(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {state.cart.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
              {state.cart.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>{state.cart.length} items in your cart</SheetDescription>
        </SheetHeader>
        {!checkout ? (
          <div className="mt-4 flex flex-col gap-4">
            <ScrollArea className="max-h-[60vh] custom-scrollbar">
              {state.cart.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                state.cart.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 border-b py-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50">
                      <svg viewBox="0 0 200 200" className="h-6 w-6"><rect width="200" height="200" fill="%23ecfdf5" rx="12"/><rect x="60" y="65" width="80" height="70" rx="6" fill="%23059869" opacity="0.3"/></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.vendorName}</p>
                      <p className="text-sm font-semibold text-emerald-700">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => dispatch({ type: "UPDATE_CART_QTY", payload: { productId: item.productId, quantity: item.quantity - 1 } })}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => dispatch({ type: "UPDATE_CART_QTY", payload: { productId: item.productId, quantity: item.quantity + 1 } })}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.productId })}>
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </ScrollArea>
            {state.cart.length > 0 && (
              <div className="space-y-3 border-t pt-3">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg text-emerald-700">{formatPrice(cartTotal)}</span>
                </div>
                <Button className={BTN.primary + " w-full"} onClick={() => setCheckout(true)}>
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <h3 className="font-semibold">Payment Method</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "mpesa" as const, label: "M-Pesa", icon: Smartphone },
                { value: "card" as const, label: "Card Payment", icon: CreditCard },
                { value: "bank_transfer" as const, label: "Bank Transfer", icon: Building2 },
                { value: "mobile_money" as const, label: "Mobile Money", icon: Wallet },
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={paymentMethod === value ? "default" : "outline"}
                  className={`flex h-20 flex-col gap-1 ${paymentMethod === value ? BTN.primary : ""}`}
                  onClick={() => setPaymentMethod(value)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
            <div className={CARD.ai}>
              <p className="font-medium text-emerald-800">Order Summary</p>
              <div className="mt-2 space-y-1 text-muted-foreground">
                {state.cart.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-emerald-800">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setCheckout(false)}>Back</Button>
              <Button className={BTN.primary + " flex-1"} onClick={handleCheckout}>
                <Check className="mr-2 h-4 w-4" /> Confirm Order
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function NestraAIInsight({ product }: { product: Product }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!product.aiSummary) return null;

  const confidenceLevel = product.rating >= 4.5 ? "High" : product.rating >= 3.5 ? "Medium" : "Low";
  const confidencePct = confidenceLevel === "High" ? Math.round(85 + product.rating * 3) : confidenceLevel === "Medium" ? Math.round(65 + product.rating * 5) : Math.round(40 + product.rating * 5);
  const confidenceColor =
    confidenceLevel === "High"
      ? "from-emerald-500 to-emerald-600 text-emerald-700 bg-emerald-50 border-emerald-200"
      : confidenceLevel === "Medium"
      ? "from-amber-500 to-amber-600 text-amber-700 bg-amber-50 border-amber-200"
      : "from-red-500 to-red-600 text-red-700 bg-red-50 border-red-200";
  const confidenceDot =
    confidenceLevel === "High"
      ? "bg-emerald-500"
      : confidenceLevel === "Medium"
      ? "bg-amber-500"
      : "bg-red-500";

  const recommendations = [
    { label: "Best Value", icon: Tag, color: "from-emerald-500 to-emerald-600" },
    { label: "Trending", icon: TrendingUp, color: "from-amber-500 to-orange-500" },
    { label: "Eco Friendly", icon: Leaf, color: "from-green-500 to-emerald-500" },
    { label: "Verified Seller", icon: BadgeCheck, color: "from-blue-500 to-indigo-500" },
  ];
  const activeRecs = recommendations.filter((_, i) =>
    i === 0 || (product.isAiPick && i === 1) || (product.verifiedSeller && i === 3) || (product.countryOfOrigin && i === 2)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.3, ease: "easeOut" as const }}
      className="relative mt-4 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-indigo-50/40"
    >
      {/* Pulse Glow Ring */}
      <motion.div
        className="pointer-events-none absolute -inset-[1px] rounded-xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(135deg, rgba(6,78,59,0.15), rgba(99,102,241,0.1), rgba(6,78,59,0.15))",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 p-4 sm:p-5">
        {/* Header Row */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-2.5">
            {/* Animated AI Icon */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 via-emerald-400 to-indigo-500 shadow-lg shadow-emerald-200/50"
            >
              <Brain className="h-4 w-4 text-white" />
            </motion.div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-primary">Nestra AI Insight</span>
                {/* Confidence Badge */}
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r ${confidenceColor}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${confidenceDot} animate-pulse`} />
                  {confidenceLevel} - {confidencePct}%
                </span>
              </div>
              {/* Freshness Badge */}
              <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex h-2 w-2"
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </motion.span>
                Last updated just now
              </div>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" as const }}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-muted/50"
          >
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </motion.div>
        </button>

        {/* Collapsible Content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="nestra-content"
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
              className="overflow-hidden"
            >
              {/* AI Summary Text */}
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.aiSummary}
                </p>

                {/* Recommendation Chips */}
                <div className="flex flex-wrap gap-2">
                  {activeRecs.map((rec) => {
                    const Icon = rec.icon;
                    return (
                      <motion.span
                        key={rec.label}
                        whileHover={{ scale: 1.05, y: -1 }}
                        className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${rec.color} px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm cursor-default`}
                      >
                        <Icon className="h-3 w-3" />
                        {rec.label}
                      </motion.span>
                    );
                  })}
                </div>

                {/* Data Points Row */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {product.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {product.rating} rating
                    </span>
                  )}
                  {product.reviews && (
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {product.reviews} reviews
                    </span>
                  )}
                  {product.deliveryEstimate && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {product.deliveryEstimate}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ProductDetailsPage() {
  const { state, dispatch, formatPrice } = useMarketplace();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = state.products.find((p) => p.id === state.selectedProductId);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg viewBox="0 0 200 200" className="h-16 w-16 text-muted-foreground/40 mb-4"><rect width="200" height="200" fill="%23f0f0f0" rx="12"/><rect x="60" y="65" width="80" height="70" rx="6" fill="%23999" opacity="0.3"/></svg>
        <p className="text-muted-foreground">Product not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => dispatch({ type: "SET_VIEW", payload: "browse" })}
        >
          <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : ["/gebeya.webp"];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const productReviews = REVIEWS.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    const vendor = state.vendors.find((v) => v.id === product.vendorId);
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: images[0],
        vendorId: product.vendorId,
        vendorName: vendor?.name || "Unknown Vendor",
      },
    });
    toast.success(`Added ${quantity} × ${product.name} to cart`);
  };

  const handleBack = () => {
    dispatch({ type: "SET_VIEW", payload: "browse" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        Back to Marketplace
      </Button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Image Gallery - Left Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Image */}
          <motion.div
            className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border shadow-sm"
            layoutId={`product-image-${product.id}`}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" as const }}
              />
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount > 0 && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white">
                  <Percent className="h-3 w-3 mr-1" />-{discount}%
                </Badge>
              )}
              {product.isAiPick && (
                <Badge className="bg-primary/90 backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Pick
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={() => {
                setIsWishlisted(!isWishlisted);
                toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
              }}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </motion.div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-muted-foreground/30"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info - Right Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" as const }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{product.category}</span>
              {product.brand && (
                <>
                  <span>•</span>
                  <span>{product.brand}</span>
                </>
              )}
            </div>

            <h1 className={`${TYPO.h2} !text-2xl lg:!text-3xl`}>{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </span>
            </div>
          </motion.div>

          {/* Price Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" as const }}
            className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price, product.currency)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>
            {product.stockStatus && (
              <div className="flex items-center gap-2 mt-2">
                {product.stockStatus === "In Stock" ? (
                  <>
                    <CircleCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">In Stock ({product.stock} available)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-amber-600 font-medium">{product.stockStatus}</span>
                  </>
                )}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" as const }}
            className="space-y-3"
          >
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Product Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {product.sku && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
              )}
              {product.countryOfOrigin && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Origin</span>
                  <span className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.countryOfOrigin}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              {product.brand && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Brand</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3, ease: "easeOut" as const }}
            className="space-y-2"
          >
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            <NestraAIInsight product={product} />
          </motion.div>

          {/* Seller Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" as const }}
            className="p-4 rounded-xl border bg-card"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {(product.sellerName || "S")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate">{product.sellerName || "Verified Seller"}</span>
                  {product.verifiedSeller && <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />}
                </div>
                {product.location && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.location}
                  </span>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              <Store className="h-4 w-4 mr-2" />
              Visit Store
            </Button>
          </motion.div>

          {/* Purchase Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3, ease: "easeOut" as const }}
            className="space-y-4 p-4 rounded-xl border bg-card"
          >
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                Buy Now
              </Button>
            </div>
          </motion.div>

          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" as const }}
            className="space-y-3 p-4 rounded-xl border bg-muted/30"
          >
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Delivery Information
            </h3>
            <div className="space-y-2 text-sm">
              {product.deliveryEstimate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{product.deliveryEstimate}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Buyer Protection Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <RotateCcw className="h-4 w-4" />
                <span>7-day return policy</span>
              </div>
            </div>
          </motion.div>
          {/* Customer Reviews & Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" as const }}
            className="col-span-full mt-8"
          >
            <div className="rounded-xl border bg-card">
              {/* Section Header */}
              <div className="p-4 sm:p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">Customer Reviews</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      What our buyers are saying about this product
                    </p>
                  </div>
                  <Button className="shrink-0">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Write a Review
                  </Button>
                </div>
                {/* Rating Summary */}
                <div className="flex flex-col lg:flex-row gap-6 mt-6">
                  {/* Overall Score */}
                  <div className="flex flex-col items-center justify-center min-w-[160px]">
                    <span className="text-5xl font-bold text-primary">
                      {productReviews.length > 0
                        ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
                        : "0.0"}
                    </span>
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const avg = productReviews.length > 0
                          ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
                          : 0;
                        return (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.round(avg)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-muted text-muted-foreground/30"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm text-muted-foreground mt-1">
                      {productReviews.length} review{productReviews.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {/* Star Distribution */}
                  <div className="flex-1 space-y-1.5 w-full">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = productReviews.filter((r) => r.rating === star).length;
                      const pct = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="flex items-center gap-1 w-14 text-muted-foreground">
                            {star} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          </span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" as const }}
                              className="h-full bg-amber-400 rounded-full"
                            />
                          </div>
                          <span className="w-10 text-right text-muted-foreground">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Review List */}
              <div className="divide-y">
                {productReviews.length > 0 ? (
                  productReviews.map((review, idx) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3, ease: "easeOut" as const }}
                      className="p-4 sm:p-6"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {review.avatar ? (
                            <img
                              src={review.avatar}
                              alt={review.userName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-primary">
                              {review.userName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{review.userName}</span>
                            {review.isVerified && (
                              <BadgeCheck className="h-4 w-4 text-primary" />
                            )}
                            {review.isVerified && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                Verified Purchase
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          {review.country && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              {review.country}
                            </span>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-muted text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          {review.title && (
                            <h4 className="font-semibold text-sm mt-2">{review.title}</h4>
                          )}
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {review.comment}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              <span>Helpful ({review.helpfulCount})</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/40" />
                    <h3 className="font-semibold mt-3">No reviews yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Be the first to review this product
                    </p>
                    <Button variant="outline" className="mt-4">
                      Write a Review
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Related Products */}
          <RelatedProducts />
        </div>
      </div>
    </motion.div>
  );
}

function RelatedProducts() {
  const { state, dispatch, formatPrice } = useMarketplace();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const product = state.products.find((p) => p.id === state.selectedProductId);
  if (!product) return null;

  const related = useMemo(() => {
    // Same category products (excluding current)
    const sameCategory = state.products.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
    // Pad with top-rated from other categories if < 4
    if (sameCategory.length >= 4) return sameCategory.slice(0, 6);
    const others = state.products
      .filter((p) => p.category !== product.category && p.id !== product.id)
      .sort((a, b) => b.rating - a.rating);
    return [...sameCategory, ...others].slice(0, 6);
  }, [state.products, product]);

  const handleViewProduct = (p: Product) => {
    dispatch({ type: "SET_SELECTED_PRODUCT", payload: p.id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (related.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4, ease: "easeOut" as const }}
      className="col-span-full mt-8"
    >
      <div className="rounded-xl border bg-card">
        {/* Section Header */}
        <div className="p-4 sm:p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Related Products</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Similar items you might love based on this product's category
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => {
                setShowAll(!showAll);
                if (showAll) window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Tag className="h-3.5 w-3.5" />
              {showAll ? "Show Less" : "View More Similar Products"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Product Grid / Carousel */}
        <div className="p-4 sm:p-6 relative">
          {/* Desktop/Tablet Grid */}
          <div className={showAll ? "block" : "hidden lg:block"}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p, idx) => (
                <RelatedProductCard
                  key={p.id}
                  product={p}
                  index={idx}
                  formatPrice={formatPrice}
                  onView={() => handleViewProduct(p)}
                />
              ))}
            </div>
          </div>

          {/* Mobile Horizontal Scroll Carousel */}
          <div className={showAll ? "hidden" : "lg:hidden relative"}>
            {/* Scroll Arrows */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 shadow-lg border flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 shadow-lg border flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            )}
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {related.map((p, idx) => (
                <div key={p.id} className="flex-shrink-0 snap-start" style={{ width: "280px" }}>
                  <RelatedProductCard
                    product={p}
                    index={idx}
                    formatPrice={formatPrice}
                    onView={() => handleViewProduct(p)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RelatedProductCard({
  product,
  index,
  formatPrice,
  onView,
}: {
  product: Product;
  index: number;
  formatPrice: (amount: number, currency?: string) => string;
  onView: () => void;
}) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.originalPrice!) * 100) : 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onView}
      className="w-full text-left group"
    >
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        {/* Image Area */}
        <div className="relative h-44 bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center overflow-hidden">
          <ProductThumbnail product={product} className="h-16 w-16 transition-transform duration-300 group-hover:scale-110" />

          {/* AI Pick Badge */}
          {product.isAiPick && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
              <Sparkles className="h-3 w-3" /> AI Pick
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
              <Percent className="h-3 w-3" /> -{discountPct}%
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-3 space-y-1.5">
          {/* Region + Rating Row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
              <MapPin className="h-3 w-3" />
              {product.region}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-sm leading-tight line-clamp-1">{product.name}</h3>

          {/* Seller + Verified Badge */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Store className="h-3 w-3" />
            <span className="truncate">{product.sellerName || "Vendor"}</span>
            {product.verifiedSeller && (
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            )}
          </div>

          {/* Price Row */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-base font-bold text-emerald-700">
              {formatPrice(product.price, product.currency)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice!, product.currency)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function BuyerView() {
  const { state, dispatch, filteredProducts, formatPrice } = useMarketplace();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showOrders, setShowOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleViewProduct = (product: Product) => {
    dispatch({ type: "SET_SELECTED_PRODUCT", payload: product.id });
    dispatch({ type: "SET_VIEW", payload: "product" });
  };

  const aiPicks = state.products.filter((p) => p.isAiPick);
  const trendingTags = ["Agriculture & Food", "Handcrafted & Artisan", "Tech & Solar", "Textiles & Fashion", "Wellness & Beauty"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_SEARCH", payload: searchQuery });
    const productsSection = document.getElementById("marketplace-products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-8">
      {/* ===== HERO SECTION ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-amber-700 p-8 text-white"
      >
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute right-4 top-4 opacity-10">
          <Globe className="h-32 w-32" />
        </div>

        <div className="relative z-10">
          <Badge className="mb-3 bg-white/20 text-white backdrop-blur-sm">
            <Sparkles className="mr-1 h-3 w-3" /> ComNestra AI Marketplace
          </Badge>
          <h1 className={TYPO.display}>
            Discover Africa's Finest Marketplace
          </h1>
          <p className="mt-2 max-w-lg text-emerald-100">
            Shop from verified vendors across the continent. Pay in your local currency. Powered by AI.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-5 flex max-w-lg gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, vendors, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <Button type="submit" className="bg-white text-emerald-800 hover:bg-emerald-50">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Marketplace CTAs */}
          <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={() => {
                const productsSection = document.getElementById("marketplace-products");
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-white text-emerald-800 hover:bg-emerald-50 hover:text-emerald-700 font-semibold px-8 py-2.5 rounded-lg shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 transition-all duration-200 active:scale-[0.98]"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Explore Marketplace
            </Button>
            <Button
              onClick={() => dispatch({ type: "SET_ROLE", payload: "seller" })}
              variant="outline"
              className="border-emerald-300/60 text-emerald-100 hover:bg-emerald-700/50 hover:text-white font-semibold px-8 py-2.5 rounded-lg backdrop-blur-sm transition-all duration-200 active:scale-[0.98]"
            >
              <Store className="mr-2 h-4 w-4" />
              Become a Seller
            </Button>
          </div>

          {/* Trending Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-emerald-200">Trending:</span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  dispatch({ type: "SET_SEARCH", payload: tag });
                  setSearchQuery(tag);
                }}
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ===== AI CURATED PICKS ===== */}
      {aiPicks.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-bold">AI Curated Picks</h2>
            </div>
            <Badge variant="secondary" className="text-xs">
              Powered by Nestra AI
            </Badge>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {aiPicks.map((product) => (
              <motion.button
                key={product.id}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => handleViewProduct(product)}
                className="flex-shrink-0 rounded-xl border bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-md"
                style={{ width: "240px" }}
              >
                <div className="flex h-28 w-full items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50">
                  <ProductThumbnail product={product} className="h-10 w-10" />
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span className="text-xs font-medium text-amber-600">AI Pick</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold line-clamp-1">{product.name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-bold text-emerald-700">{formatPrice(product.price, product.currency)}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {product.rating}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>
      )}

      {/* ===== CATEGORY QUICK LINKS ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Shop by Category</h2>
          <Button variant="ghost" size="sm" className="text-xs text-emerald-600">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.map((cat) => {
            const Icon = CategoryIconMap[cat.id] || Tag;
            const isActive = state.selectedCategory === cat.slug;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => dispatch({ type: "SET_CATEGORY", payload: cat.slug })}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                  isActive
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-600"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isActive ? "bg-emerald-100" : "bg-muted"
                }`}>
                  <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-muted-foreground"}`} />
                </div>
                <span className="text-xs font-medium">{cat.name}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* ===== FILTER BAR ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="space-y-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <Button
              variant={state.selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              className={state.selectedCategory === "all" ? BTN.primary : "text-xs"}
              onClick={() => dispatch({ type: "SET_CATEGORY", payload: "all" })}
            >
              <Layers className="mr-1.5 h-3.5 w-3.5" /> All
            </Button>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant={state.selectedCategory === cat.slug ? "default" : "outline"}
                size="sm"
                className={state.selectedCategory === cat.slug ? BTN.primary : "text-xs"}
                onClick={() => dispatch({ type: "SET_CATEGORY", payload: cat.slug })}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant={showFilters ? "secondary" : "ghost"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" /> Filters
            </Button>
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8" onClick={() => setShowOrders(!showOrders)}>
              <Clock className="mr-1.5 h-3.5 w-3.5" /> Orders
            </Button>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-xl border bg-card"
            >
              <div className="flex flex-wrap items-center gap-3 p-3">
                {/* AI Pick Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">AI Picks</span>
                  <button
                    onClick={() => dispatch({ type: "SET_AI_PICK_ONLY", payload: !state.aiPickOnly })}
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      state.aiPickOnly ? "bg-amber-500" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        state.aiPickOnly ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Stock Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Stock</span>
                  <select
                    value={state.stockFilter || "all"}
                    onChange={(e) => dispatch({ type: "SET_STOCK_FILTER", payload: e.target.value as "all" | "in_stock" | "low_stock" })}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    <option value="all">All</option>
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Sort</span>
                  <select
                    value={state.sortBy || "recommended"}
                    onChange={(e) => dispatch({ type: "SET_SORT_BY", payload: e.target.value as "recommended" | "price_low" | "price_high" | "rating" | "newest" })}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Reset Filters */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-red-500"
                  onClick={() => {
                    dispatch({ type: "RESET_FILTERS" });
                    setSearchQuery("");
                  }}
                >
                  <RotateCcw className="mr-1 h-3 w-3" /> Reset
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ===== ORDERS PANEL ===== */}
      <AnimatePresence>
        {showOrders && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <div className="p-4">
              <h3 className="mb-3 font-semibold">My Orders</h3>
              {state.orders.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                  <ShoppingBag className="h-10 w-10" />
                  <p className="text-sm">No orders yet. Start shopping!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {state.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={STATUS_BADGE[order.status]}>{order.status}</Badge>
                        <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== PRODUCT GRID ===== */}
      <motion.div id="marketplace-products" layout className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {state.selectedCategory === "all" ? "All Products" : state.selectedCategory}
            <span className="ml-2 text-sm font-normal text-muted-foreground">({filteredProducts.length} items)</span>
          </h2>
        </div>

        <div className={viewMode === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-3"}>
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center gap-3 py-16 text-muted-foreground"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium">No matching products found.</p>
              <p className="text-sm">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  dispatch({ type: "RESET_FILTERS" });
                  setSearchQuery("");
                }}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset Filters
              </Button>
            </motion.div>
          ) : viewMode === "grid" ? (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03, ease: "easeOut" }}
              >
                <ProductCard key={product.id} product={product} onView={() => handleViewProduct(product)} />
              </motion.div>
            ))
          ) : (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={CARD.interactive + " flex items-center gap-4"}
                onClick={() => handleViewProduct(product)}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50">
                  <ProductThumbnail product={product} className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    {product.isAiPick && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
                    {product.verifiedSeller && <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{product.sellerName || product.vendorId}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {product.rating}
                    <MapPin className="h-3 w-3" />
                    {product.location || product.region}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-emerald-700">{formatPrice(product.price, product.currency)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice, product.currency)}</div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

    </div>
  );
}

function SellerView() {
  const { state, dispatch, formatPrice } = useMarketplace();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  const sellerProducts = state.products.filter((p) => p.vendorId === "v1");
  const sellerOrders = state.sellerOrders;

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "electronics",
    stock: 0,
  });

  const handleAddProduct = () => {
    if (!newProduct.name) return;
    const product: Product = {
      id: `p${Date.now()}`,
      vendorId: "v1",
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      currency: "USD",
      category: newProduct.category,
      region: "Nigeria",
      stockStatus: "in_stock" as const,
      location: "Nigeria",
      deliveryEstimate: "3-7 days",
      images: [],
      stock: newProduct.stock,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_PRODUCT", payload: product });
    toast.success("Product added successfully");
    setShowAddProduct(false);
    setNewProduct({ name: "", description: "", price: 0, category: "electronics", stock: 0 });
  };

  const handleAiEnhance = () => {
    const enhanced = `AI-enhanced: ${newProduct.description || "Premium quality product from our workshop."}`;
    setNewProduct((prev) => ({ ...prev, description: enhanced }));
    toast.success("Nestra AI enhanced your product description");
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Revenue", value: `$${SELLER_KPIS.totalRevenue.toLocaleString()}`, change: `+${SELLER_KPIS.revenueChange}%`, icon: DollarSign, color: "text-emerald-600" },
          { label: "Orders", value: SELLER_KPIS.totalOrders.toLocaleString(), change: `+${SELLER_KPIS.ordersChange}%`, icon: ShoppingCart, color: "text-amber-600" },
          { label: "Listings", value: SELLER_KPIS.activeListings, change: `+${SELLER_KPIS.listingsChange}`, icon: Layout, color: "text-blue-600" },
          { label: "Rating", value: SELLER_KPIS.rating, change: `+${SELLER_KPIS.ratingChange}`, icon: Star, color: "text-purple-600" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <p className="mt-1 text-xl font-bold">{kpi.value}</p>
              <p className="text-xs text-emerald-600">{kpi.change} vs last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="overview"><Layout className="mr-1.5 h-3.5 w-3.5" /> Overview</TabsTrigger>
          <TabsTrigger value="products"><Boxes className="mr-1.5 h-3.5 w-3.5" /> Products</TabsTrigger>
          <TabsTrigger value="orders"><ShoppingCart className="mr-1.5 h-3.5 w-3.5" /> Orders</TabsTrigger>
          <TabsTrigger value="inventory"><Boxes className="mr-1.5 h-3.5 w-3.5" /> Inventory</TabsTrigger>
          <TabsTrigger value="analytics"><ChartBar className="mr-1.5 h-3.5 w-3.5" /> Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" /> Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {[
                  { label: "Total Revenue", value: `$${SELLER_KPIS.totalRevenue.toLocaleString()}`, sub: "Last 30 days" },
                  { label: "Conversion Rate", value: "3.2%", sub: "Above average" },
                  { label: "Avg Order Value", value: "$19.57", sub: "Per transaction" },
                  { label: "Return Rate", value: "1.8%", sub: "Below 2% threshold" },
                  { label: "Customer Satisfaction", value: "94%", sub: "Based on reviews" },
                  { label: "Nestra AI Score", value: "88", sub: "Optimization score" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-xl font-bold text-emerald-700">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Your Products ({sellerProducts.length})</h3>
            <Button className={BTN.primary} onClick={() => setShowAddProduct(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Add Product
            </Button>
          </div>
          <div className="space-y-2">
            {sellerProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                    <ProductThumbnail product={product} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatPrice(product.price, product.currency)}</span>
                      <span>Stock: {product.stock}</span>
                      <span>Rating: {product.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => {
                    dispatch({ type: "DELETE_PRODUCT", payload: product.id });
                    toast.success("Product removed");
                  }}>
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <SellerOrdersManagement />
        </TabsContent>

        <TabsContent value="inventory" className="mt-4">
          <SellerInventoryManagement />
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <SellerAnalyticsDashboard />
        </TabsContent>
      </Tabs>



      {/* Add Product Dialog */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>List a new product with Nestra AI assistance</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Product name"
              className={INPUT.base}
              value={newProduct.name}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
            />
            <div className="relative">
              <Input
                placeholder="Product description"
                className={INPUT.base}
                value={newProduct.description}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 text-amber-600"
                onClick={handleAiEnhance}
              >
                <Sparkles className="mr-1 h-3 w-3" /> AI
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Price (USD)"
                className={INPUT.base}
                value={newProduct.price || ""}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
              />
              <Input
                type="number"
                placeholder="Stock"
                className={INPUT.base}
                value={newProduct.stock || ""}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: Number(e.target.value) }))}
              />
            </div>
            <Select value={newProduct.category} onValueChange={(val) => setNewProduct((prev) => ({ ...prev, category: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className={BTN.primary + " w-full"} onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdminView() {
  const { state, dispatch } = useMarketplace();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Admin Metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "GMV (Total)", value: `$${(ADMIN_METRICS.gmv / 1e6).toFixed(1)}M`, change: `+${ADMIN_METRICS.gmvGrowth}%`, icon: DollarSign, color: "text-emerald-600" },
          { label: "Vendors", value: ADMIN_METRICS.totalVendors, change: `+${ADMIN_METRICS.vendorGrowth}%`, icon: Store, color: "text-amber-600" },
          { label: "Buyers", value: ADMIN_METRICS.totalBuyers.toLocaleString(), change: `+${ADMIN_METRICS.buyerGrowth}%`, icon: Users, color: "text-blue-600" },
          { label: "Pending Approvals", value: ADMIN_METRICS.pendingApprovals, change: `${ADMIN_METRICS.activeDisputes} disputes`, icon: AlertTriangle, color: "text-red-600" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <p className="mt-1 text-xl font-bold">{kpi.value}</p>
              <p className="text-xs text-emerald-600">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="overview"><BarChart className="mr-1.5 h-3.5 w-3.5" /> Analytics</TabsTrigger>
          <TabsTrigger value="vendors"><Store className="mr-1.5 h-3.5 w-3.5" /> Vendors</TabsTrigger>
          <TabsTrigger value="disputes"><AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> Disputes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-emerald-600" /> Regional Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ADMIN_METRICS.regions.map((region) => (
                    <div key={region.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{region.name}</span>
                        <span className="font-medium">{region.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${region.value}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-amber-600" /> Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Active Vendors", value: "42", color: "text-emerald-600" },
                    { label: "Avg Order Value", value: "$24.50", color: "text-amber-600" },
                    { label: "Satisfaction", value: "94%", color: "text-blue-600" },
                    { label: "Nestra Accuracy", value: "96%", color: "text-purple-600" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="h-5 w-5 text-emerald-600" /> Vendor Verification Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {state.vendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-emerald-100">
                        <AvatarFallback className="text-emerald-700">{vendor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{vendor.name}</p>
                          {vendor.verified && <Badge variant="outline" className="text-emerald-600"><Check className="mr-0.5 h-3 w-3" /> Verified</Badge>}
                          {!vendor.active && <Badge variant="outline" className="text-red-500">Suspended</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{vendor.region}</span>
                          <span>AI Trust: {vendor.aiTrustScore}</span>
                          <span>{vendor.totalOrders} orders</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!vendor.verified && (
                        <Button size="sm" className={BTN.primary} onClick={() => {
                          dispatch({ type: "APPROVE_VENDOR", payload: vendor.id });
                          toast.success(`${vendor.name} approved`);
                        }}>
                          <Check className="mr-1 h-3.5 w-3.5" /> Approve
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => {
                        dispatch({ type: "TOGGLE_VENDOR_STATUS", payload: vendor.id });
                        toast.success(vendor.active ? "Vendor suspended" : "Vendor activated");
                      }}>
                        {vendor.active ? "Suspend" : "Activate"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" /> Dispute & Risk Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DISPUTE_LOGS.map((dispute) => (
                  <div key={dispute.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{dispute.orderId}</p>
                        {dispute.aiFlagged && (
                          <Badge className={BADGE.red}>
                            <AlertTriangle className="mr-0.5 h-3 w-3" /> AI Flagged
                          </Badge>
                        )}
                      </div>
                      <Badge className={STATUS_BADGE[dispute.status]}>
                        {dispute.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{dispute.issue}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Created: {new Date(dispute.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NestraAIAssistant() {
  const { state, dispatch } = useMarketplace();
  const [input, setInput] = useState("");

  const quickActions = state.aiInsights.slice(0, 3);

  const handleSend = () => {
    if (!input.trim()) return;
    toast.success(`Nestra AI: ${input}`);
    setInput("");
  };

  return (
    <Sheet open={state.nestraOpen} onOpenChange={(v) => dispatch({ type: "SET_NESTRA_OPEN", payload: v })}>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500">
              <Bot className="h-4 w-4 text-white" />
            </div>
            Nestra AI Assistant
          </SheetTitle>
          <SheetDescription>Your AI commerce copilot for ComNestra</SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-4">
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Quick Actions</p>
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto w-full justify-start gap-3 p-3 text-left"
                onClick={() => toast.success(`Nestra AI: ${action.title} - ${action.description}`)}
              >
                <div className={
                  `flex h-8 w-8 items-center justify-center rounded-lg ${
                    action.severity === "success" ? "bg-emerald-100 text-emerald-600" :
                    action.severity === "warning" ? "bg-amber-100 text-amber-600" :
                    "bg-blue-100 text-blue-600"
                  }`
                }>
                  {action.severity === "warning" ? <AlertTriangle className="h-4 w-4" /> :
                   action.severity === "success" ? <ThumbsUp className="h-4 w-4" /> :
                   <Info className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
          <Separator />
          <div className="flex-1 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Ask Nestra anything</p>
            <div className="space-y-2">
              {state.role === "buyer" && (
                <>
                  <Button variant="ghost" className="h-auto w-full justify-start text-xs text-muted-foreground" onClick={() => { setInput("Find me a gift under $50 from Kenya"); toast.success("Nestra AI: Searching for gifts under $50 from Kenya..."); }}>
                    "Find me a gift under $50 from Kenya"
                  </Button>
                  <Button variant="ghost" className="h-auto w-full justify-start text-xs text-muted-foreground" onClick={() => { setInput("What are the best-rated electronics?"); toast.success("Nestra AI: Here are the top-rated electronics..."); }}>
                    "What are the best-rated electronics?"
                  </Button>
                </>
              )}
              {state.role === "seller" && (
                <>
                  <Button variant="ghost" className="h-auto w-full justify-start text-xs text-muted-foreground" onClick={() => { setInput("How can I improve my product listings?"); toast.success("Nestra AI: Here are tips to optimize your listings..."); }}>
                    "How can I improve my listings?"
                  </Button>
                  <Button variant="ghost" className="h-auto w-full justify-start text-xs text-muted-foreground" onClick={() => { setInput("What price should I set for my products?"); toast.success("Nestra AI: Analyzing market prices..."); }}>
                    "What price should I set?"
                  </Button>
                </>
              )}
              {state.role === "admin" && (
                <>
                  <Button variant="ghost" className="h-auto w-full justify-start text-xs text-muted-foreground" onClick={() => { setInput("Show me risk assessment report"); toast.success("Nestra AI: Generating risk assessment report..."); }}>
                    "Show me risk assessment report"
                  </Button>
                  <Button variant="ghost" className="h-auto w-full justify-start text-xs text-muted-foreground" onClick={() => { setInput("Which vendors need attention?"); toast.success("Nestra AI: Flagging vendors needing attention..."); }}>
                    "Which vendors need attention?"
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ask Nestra..."
              className={INPUT.base}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button size="icon" className={BTN.primary} onClick={handleSend}>
              <Zap className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileMenu({ role, setRole }: { role: UserRole; setRole: (r: UserRole) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left">
          <SheetHeader><SheetTitle>ComNestra</SheetTitle></SheetHeader>
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Switch Role</p>
            {(["buyer", "seller", "admin"] as UserRole[]).map((r) => (
              <Button
                key={r}
                variant={role === r ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${role === r ? BTN.primary : ""}`}
                onClick={() => { setRole(r); setOpen(false); }}
              >
                {roleIcons[r]}
                {roleLabels[r]}
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default function MarketplaceApp() {
  const { state, dispatch } = useMarketplace();
  const { role, currency } = state;

  const setRole = (r: UserRole) => dispatch({ type: "SET_ROLE", payload: r });
  const setCurrency = (c: CurrencyCode) => dispatch({ type: "SET_CURRENCY", payload: c });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="content-container flex h-16 items-center gap-4">
          <MobileMenu role={role} setRole={setRole} />
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-amber-600">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="hidden text-lg font-bold sm:inline">
              <span className="text-emerald-700">Com</span><span className="text-amber-600">Nestra</span>
            </span>
          </div>

          {/* Role Switcher - Desktop */}
          <div className="hidden items-center gap-1 rounded-lg bg-muted p-1 md:flex">
            {(["buyer", "seller", "admin"] as UserRole[]).map((r) => (
              <Button
                key={r}
                variant={role === r ? "default" : "ghost"}
                size="sm"
                className={`gap-1.5 ${role === r ? BTN.primary : ""}`}
                onClick={() => setRole(r)}
              >
                {roleIcons[r]}
                {roleLabels[r]}
              </Button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className={INPUT.withIcon}
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
            />
          </div>

          {/* Currency Selector */}
          <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
            <SelectTrigger className="w-28">
              <DollarSign className="mr-1 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Orders */}
          {role === "buyer" && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "orders" })}
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          )}

          {/* Cart */}
          {role === "buyer" && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "cart" })}
            >
              <ShoppingCart className="h-5 w-5" />
              {state.cart.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                  {state.cart.length}
                </span>
              )}
            </Button>
          )}

          {/* Nestra AI Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => dispatch({ type: "SET_NESTRA_OPEN", payload: true })}
          >
            <Bot className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-amber-500" />
          </Button>

          {/* User Avatar */}
          <Avatar className="h-8 w-8 bg-emerald-100">
            <AvatarFallback className="text-xs text-emerald-700">{state.currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="content-container py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={role === "buyer" && state.view === "product" ? "product" : role}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" as const }}
          >
            {role === "buyer" && state.view === "order-success" && <OrderSuccessPage />}
            {role === "buyer" && state.view === "orders" && <OrderHistoryPage />}
            {role === "buyer" && state.view === "cart" && <CartPage />}
            {role === "buyer" && state.view === "product" && <ProductDetailsPage />}
            {role === "buyer" && state.view !== "order-success" && state.view !== "orders" && state.view !== "product" && state.view !== "cart" && <BuyerView />}
            {role === "seller" && <SellerView />}
            {role === "admin" && <AdminView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Nestra AI Assistant */}
      <NestraAIAssistant />

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="content-container flex items-center justify-between py-6 text-xs text-muted-foreground">
          <span>&copy; 2024 ComNestra. Africa's Commerce Enablement Platform</span>
          <div className="flex items-center gap-4">
            <span>Powered by Nestra AI</span>
            <span className="hidden sm:inline">M-Pesa | Mobile Money | Card | Bank Transfer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}