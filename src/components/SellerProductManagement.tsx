import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Package, Search, Plus, X, Check, Edit, Trash2, Copy, Archive,
  Eye, Image, PanelRight, Grid3x3, List, ArrowUpDown, SlidersHorizontal,
  CircleDollarSign, BarChart3, TrendingUp, DollarSign, MapPin,
  Star, ChevronDown, ChevronRight, ChevronLeft, Clock, Shield,
  Truck, Ruler, Weight, Tag, Percent, Sparkles, Wand2, BrainCircuit,
  LineChart, Lightbulb, Target, FileText, Camera, RefreshCw,
  MoreHorizontal, AlertTriangle, CircleCheck, Zap, ArrowLeft,
  Bookmark, Boxes, RotateCcw, EyeOff, Layers, GripVertical,
  ShoppingBag, CalendarDays, Info, Hash, Minus
} from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";
import type { Product, CurrencyCode } from "../types";
import { CATEGORIES, BTN, INPUT, CARD, BADGE, TYPO } from "../constants";

/* ─── Types ─── */
type SortField = "newest" | "oldest" | "stock_high" | "stock_low" | "price_high" | "price_low";
type ViewMode = "grid" | "list";
type ProductStatus = "active" | "draft" | "out_of_stock" | "archived";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  sku: string;
  category: string;
  stock: number;
  reorderPoint: number;
  weight: string;
  dimensions: string;
  shippingClass: string;
  currency: CurrencyCode;
  brand: string;
  status: ProductStatus;
  images: string[];
}

/* ─── Helpers ─── */
const emptyForm = (): ProductFormData => ({
  name: "", description: "", price: 0, originalPrice: 0, sku: "",
  category: "electronics", stock: 0, reorderPoint: 5, weight: "",
  dimensions: "", shippingClass: "standard", currency: "USD",
  brand: "", status: "draft", images: [],
});

const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    draft: "bg-amber-100 text-amber-700 border-amber-200",
    out_of_stock: "bg-red-100 text-red-700 border-red-200",
    archived: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return map[status] || "bg-slate-100 text-slate-600";
};

const getStockLabel = (stock: number, status: string) => {
  if (status === "out_of_stock" || stock <= 0) return { label: "Out of Stock", color: "text-red-500", icon: AlertTriangle };
  if (stock < 10) return { label: `Low Stock (${stock})`, color: "text-amber-600", icon: AlertTriangle };
  return { label: `In Stock (${stock})`, color: "text-emerald-600", icon: CircleCheck };
};

/* ─── Mock AI Data ─── */
const aiDescriptions: Record<string, string> = {
  default: "Premium quality product crafted with care. Designed to deliver exceptional value and performance for everyday use. Features durable construction and modern aesthetics that complement any setting.",
  electronics: "Cutting-edge device engineered for peak performance. Features the latest technology with intuitive controls, energy-efficient operation, and robust build quality. Perfect for tech enthusiasts and professionals alike.",
  fashion: "Stylish and comfortable piece crafted from premium materials. Thoughtfully designed to blend traditional craftsmanship with contemporary fashion trends. A versatile addition to any wardrobe.",
  "home-living": "Beautifully crafted home essential that combines functionality with artistic design. Made from sustainable materials by skilled artisans. Adds warmth and character to any living space.",
  "arts-crafts": "Unique handcrafted piece showcasing traditional techniques passed down through generations. Each item bears the distinct character of its maker, making it truly one-of-a-kind.",
};

/* ─── Product Card (Grid) ─── */
function ProductGridCard({ product, formData, onView, onEdit, onDuplicate, onArchive, onDelete, onQuickStock }: {
  product: Product;
  formData: ProductFormData;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onQuickStock: () => void;
}) {
  const { formatPrice } = useMarketplace();
  const stockInfo = getStockLabel(formData.stock, formData.status);
  const StockIcon = stockInfo.icon;
  const hasDiscount = formData.originalPrice > formData.price;
  const discountPct = hasDiscount ? Math.round((1 - formData.price / formData.originalPrice) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Image Area */}
      <div className="relative h-40 bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center overflow-hidden">
        {formData.images.length > 0 ? (
          <img src={formData.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <Package className="h-14 w-14 text-emerald-300 transition-transform duration-300 group-hover:scale-110" />
        )}
        {/* Status Badge */}
        <div className="absolute left-2 top-2">
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusBadge(formData.status)}`}>
            {formData.status.replace("_", " ")}
          </span>
        </div>
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
            <Percent className="h-2.5 w-2.5" /> -{discountPct}%
          </div>
        )}
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onView(); }}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onQuickStock(); }}>
            <Package className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Details */}
      <div className="p-3 space-y-2" onClick={onView}>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">{formData.sku || "No SKU"}</span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
        </div>
        <h3 className="text-sm font-semibold leading-tight line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span className="capitalize">{formData.category}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-emerald-700">{formatPrice(formData.price, formData.currency)}</span>
            {hasDiscount && (
              <span className="text-[10px] text-muted-foreground line-through">{formatPrice(formData.originalPrice, formData.currency)}</span>
            )}
          </div>
          <span className={`flex items-center gap-1 text-[10px] font-medium ${stockInfo.color}`}>
            <StockIcon className="h-3 w-3" />
            {stockInfo.label}
          </span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center border-t px-3 py-1.5">
        <div className="flex flex-1 items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onArchive(); }}>
            <Archive className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

/* ─── Product Row (List) ─── */
function ProductListRow({ product, formData, onView, onEdit, onDuplicate, onArchive, onDelete, onQuickStock }: {
  product: Product;
  formData: ProductFormData;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onQuickStock: () => void;
}) {
  const { formatPrice } = useMarketplace();
  const stockInfo = getStockLabel(formData.stock, formData.status);
  const StockIcon = stockInfo.icon;
  const hasDiscount = formData.originalPrice > formData.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 rounded-lg border bg-card p-3 hover:shadow-sm transition-all cursor-pointer group"
      onClick={onView}
    >
      {/* Thumbnail */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50 overflow-hidden">
        {formData.images.length > 0 ? (
          <img src={formData.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <Package className="h-6 w-6 text-emerald-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold truncate">{product.name}</h3>
            <span className={`inline-flex items-center rounded-full border px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wider ${getStatusBadge(formData.status)}`}>
              {formData.status.replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
            <span>{formData.sku || "No SKU"}</span>
            <span className="flex items-center gap-1 capitalize"><Tag className="h-2.5 w-2.5" />{formData.category}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className={`flex items-center gap-1 text-xs font-medium ${stockInfo.color}`}>
            <StockIcon className="h-3.5 w-3.5" />
            {stockInfo.label}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {product.rating}
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="text-right">
            <span className="text-sm font-bold text-emerald-700">{formatPrice(formData.price, formData.currency)}</span>
            {hasDiscount && (
              <div className="text-[10px] text-muted-foreground line-through">{formatPrice(formData.originalPrice, formData.currency)}</div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}><Edit className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDuplicate}><Copy className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onQuickStock}><Package className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" /></Button>
      </div>
    </motion.div>
  );
}

/* ─── Quick Stock Popover ─── */
function QuickStockModal({ open, onClose, product, currentStock, onSave }: {
  open: boolean;
  onClose: () => void;
  product: Product;
  currentStock: number;
  onSave: (stock: number) => void;
}) {
  const [qty, setQty] = useState(currentStock);
  const [adjustment, setAdjustment] = useState(0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4 text-emerald-600" />
            Update Stock - {product.name}
          </DialogTitle>
          <DialogDescription>
            Set absolute quantity or adjust by +/- amount
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Current Stock */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
            <span className="text-sm text-muted-foreground">Current Stock</span>
            <span className="text-lg font-bold">{currentStock}</span>
          </div>

          {/* Set Absolute */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Set Absolute Quantity</Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQty(Math.max(0, qty - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(0, Number(e.target.value)))}
                className="text-center text-lg font-bold"
              />
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQty(qty + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Quick Adjust */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick Adjust</Label>
            <div className="flex gap-2">
              {[-10, -5, -1, 1, 5, 10].map((n) => (
                <Button
                  key={n}
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${n < 0 ? "text-red-500" : "text-emerald-600"}`}
                  onClick={() => {
                    setAdjustment(n);
                    setQty(Math.max(0, currentStock + n));
                  }}
                >
                  {n > 0 ? `+${n}` : n}
                </Button>
              ))}
            </div>
          </div>

          {/* Low Stock Warning */}
          {qty < 10 && qty > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Low stock warning: {qty} items remaining. Reorder recommended.
            </div>
          )}
          {qty <= 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              This product will be marked as Out of Stock.
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => { onSave(qty); onClose(); }}>
              <Check className="mr-1.5 h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── AI Assistant Modal ─── */
function AIAssistantModal({ open, onClose, productName, onApplyDescription, onApplyKeywords, onApplyPrice, onApplySeo }: {
  open: boolean;
  onClose: () => void;
  productName: string;
  onApplyDescription: (text: string) => void;
  onApplyKeywords: (keywords: string[]) => void;
  onApplyPrice: (price: number, originalPrice: number) => void;
  onApplySeo: (meta: { title: string; description: string; slug: string }) => void;
}) {
  const [activeTab, setActiveTab] = useState("description");
  const [generatedDesc, setGeneratedDesc] = useState("");
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [suggestedPrice, setSuggestedPrice] = useState(0);
  const [suggestedOriginal, setSuggestedOriginal] = useState(0);
  const [seoData, setSeoData] = useState({ title: "", description: "", slug: "", score: 0 });
  const [loading, setLoading] = useState(false);

  const handleGenerateDescription = () => {
    setLoading(true);
    const category = Object.keys(aiDescriptions).find((k) =>
      productName.toLowerCase().includes(k) || aiDescriptions[k].includes("crafted")
    ) || "default";
    const base = aiDescriptions[category] || aiDescriptions.default;
    setTimeout(() => {
      setGeneratedDesc(`${productName} — ${base}`);
      setLoading(false);
      toast.success("AI description generated");
    }, 800);
  };

  const handleGenerateKeywords = () => {
    setLoading(true);
    setTimeout(() => {
      const words = productName.toLowerCase().split(" ");
      const keywords = [
        ...words.filter((w) => w.length > 3),
        "premium", "quality", "best", "authentic", "handcrafted", "africa",
        "marketplace", "organic", "sustainable", "traditional",
      ].slice(0, 12);
      setGeneratedKeywords(keywords);
      setLoading(false);
      toast.success("AI keywords generated");
    }, 600);
  };

  const handleGeneratePrice = () => {
    setLoading(true);
    setTimeout(() => {
      const base = Math.round(10 + Math.random() * 200);
      setSuggestedPrice(base);
      setSuggestedOriginal(Math.round(base * (1.15 + Math.random() * 0.25)));
      setLoading(false);
      toast.success("AI pricing suggestion ready");
    }, 700);
  };

  const handleGenerateSeo = () => {
    setLoading(true);
    setTimeout(() => {
      const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setSeoData({
        title: `Buy ${productName} Online | Best Price in Africa | ComNestra`,
        description: `Shop authentic ${productName} at the best price on ComNestra. ✓ Verified sellers ✓ Secure payments ✓ Fast delivery across Africa.`,
        slug,
        score: Math.round(72 + Math.random() * 25),
      });
      setLoading(false);
      toast.success("AI SEO analysis complete");
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            Nestra AI Product Assistant
          </DialogTitle>
          <DialogDescription>
            AI-powered optimization for "{productName || "your product"}"
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 bg-muted">
            <TabsTrigger value="description" className="text-xs"><FileText className="mr-1 h-3.5 w-3.5" /> Desc</TabsTrigger>
            <TabsTrigger value="keywords" className="text-xs"><Tag className="mr-1 h-3.5 w-3.5" /> Keywords</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs"><DollarSign className="mr-1 h-3.5 w-3.5" /> Pricing</TabsTrigger>
            <TabsTrigger value="seo" className="text-xs"><Target className="mr-1 h-3.5 w-3.5" /> SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">Generate compelling marketing copy for your product listing.</p>
            <Button variant="outline" size="sm" onClick={handleGenerateDescription} disabled={loading} className="gap-1.5">
              <Wand2 className="h-4 w-4" /> {loading ? "Generating..." : "Generate Description"}
            </Button>
            {generatedDesc && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">{generatedDesc}</div>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onApplyDescription(generatedDesc)}>
                  <Check className="mr-1.5 h-4 w-4" /> Apply
                </Button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="keywords" className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">AI-suggested high-ranking keywords for better discoverability.</p>
            <Button variant="outline" size="sm" onClick={handleGenerateKeywords} disabled={loading} className="gap-1.5">
              <Wand2 className="h-4 w-4" /> {loading ? "Generating..." : "Suggest Keywords"}
            </Button>
            {generatedKeywords.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {generatedKeywords.map((kw) => (
                    <span key={kw} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                      <Hash className="h-2.5 w-2.5" />{kw}
                    </span>
                  ))}
                </div>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onApplyKeywords(generatedKeywords)}>
                  <Check className="mr-1.5 h-4 w-4" /> Apply All
                </Button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="pricing" className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">Market analysis suggests optimal price range for your product.</p>
            <Button variant="outline" size="sm" onClick={handleGeneratePrice} disabled={loading} className="gap-1.5">
              <Wand2 className="h-4 w-4" /> {loading ? "Analyzing..." : "Analyze Market Price"}
            </Button>
            {suggestedPrice > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className="rounded-lg border bg-emerald-50/50 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Suggested Price</span>
                    <span className="text-lg font-bold text-emerald-700">${suggestedPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Original (for discount)</span>
                    <span className="text-sm text-muted-foreground line-through">${suggestedOriginal}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    Estimated 15-25% margin above market average
                  </div>
                </div>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onApplyPrice(suggestedPrice, suggestedOriginal)}>
                  <Check className="mr-1.5 h-4 w-4" /> Apply Price
                </Button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="seo" className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">SEO optimization for better search engine ranking.</p>
            <Button variant="outline" size="sm" onClick={handleGenerateSeo} disabled={loading} className="gap-1.5">
              <Wand2 className="h-4 w-4" /> {loading ? "Analyzing..." : "Analyze SEO"}
            </Button>
            {seoData.score > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                {/* SEO Score */}
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-sm font-bold">
                    {seoData.score}
                  </div>
                  <div>
                    <p className="text-sm font-medium">SEO Score</p>
                    <p className="text-xs text-muted-foreground">
                      {seoData.score >= 90 ? "Excellent" : seoData.score >= 80 ? "Good" : seoData.score >= 70 ? "Average" : "Needs improvement"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Meta Title</span>
                    <p className="text-xs mt-0.5">{seoData.title}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Meta Description</span>
                    <p className="text-xs mt-0.5">{seoData.description}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">URL Slug</span>
                    <p className="text-xs mt-0.5 font-mono text-emerald-600">{seoData.slug}</p>
                  </div>
                </div>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onApplySeo(seoData)}>
                  <Check className="mr-1.5 h-4 w-4" /> Apply SEO Data
                </Button>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Product Form Modal (Add/Edit) ─── */
function ProductFormModal({ open, onClose, editProduct, onSave, onAiAssist }: {
  open: boolean;
  onClose: () => void;
  editProduct: Product | null;
  onSave: (data: ProductFormData) => void;
  onAiAssist: () => void;
}) {
  const [formData, setFormData] = useState<ProductFormData>(emptyForm());
  const [activeTab, setActiveTab] = useState("basic");
  const isEditing = !!editProduct;

  // Initialize form when editing
  useState(() => {
    if (editProduct) {
      const vendor = editProduct;
      setFormData({
        name: editProduct.name,
        description: editProduct.description,
        price: editProduct.price,
        originalPrice: editProduct.originalPrice || 0,
        sku: editProduct.sku || "",
        category: editProduct.category,
        stock: editProduct.stock,
        reorderPoint: 5,
        weight: "",
        dimensions: "",
        shippingClass: "standard",
        currency: editProduct.currency,
        brand: editProduct.brand || "",
        status: (editProduct.stockStatus === "out-of-stock" ? "out_of_stock" : "active") as ProductStatus,
        images: editProduct.images || [],
      });
    }
  });

  const update = (key: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    onSave(formData);
    setFormData(emptyForm());
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setFormData(emptyForm()); onClose(); } }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? <Edit className="h-5 w-5 text-emerald-600" /> : <Plus className="h-5 w-5 text-emerald-600" />}
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Update your product details" : "Fill in the details to list a new product"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 bg-muted">
            <TabsTrigger value="basic" className="text-xs"><FileText className="mr-1 h-3.5 w-3.5" /> Basic</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs"><DollarSign className="mr-1 h-3.5 w-3.5" /> Pricing</TabsTrigger>
            <TabsTrigger value="media" className="text-xs"><Camera className="mr-1 h-3.5 w-3.5" /> Media</TabsTrigger>
            <TabsTrigger value="shipping" className="text-xs"><Truck className="mr-1 h-3.5 w-3.5" /> Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Product Name *</Label>
                <Input
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={INPUT.base}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <div className="relative">
                  <Textarea
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={(e) => update("description", e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 text-amber-600"
                    onClick={onAiAssist}
                  >
                    <Sparkles className="mr-1 h-3 w-3" /> AI
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">SKU</Label>
                <Input
                  placeholder="e.g. PRD-001"
                  value={formData.sku}
                  onChange={(e) => update("sku", e.target.value)}
                  className={INPUT.base}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <Select value={formData.category} onValueChange={(v) => update("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Brand</Label>
                <Input
                  placeholder="Brand name"
                  value={formData.brand}
                  onChange={(e) => update("brand", e.target.value)}
                  className={INPUT.base}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select value={formData.status} onValueChange={(v) => update("status", v as ProductStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Price *</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.price || ""}
                  onChange={(e) => update("price", Number(e.target.value))}
                  className={INPUT.base}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Original Price (for discount)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.originalPrice || ""}
                  onChange={(e) => update("originalPrice", Number(e.target.value))}
                  className={INPUT.base}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Currency</Label>
                <Select value={formData.currency} onValueChange={(v) => update("currency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD $</SelectItem>
                    <SelectItem value="KES">KES Ksh</SelectItem>
                    <SelectItem value="NGN">NGN ₦</SelectItem>
                    <SelectItem value="GHS">GHS GH₵</SelectItem>
                    <SelectItem value="ZAR">ZAR R</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Stock Quantity *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.stock || ""}
                  onChange={(e) => update("stock", Number(e.target.value))}
                  className={INPUT.base}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Reorder Point</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={formData.reorderPoint}
                  onChange={(e) => update("reorderPoint", Number(e.target.value))}
                  className={INPUT.base}
                />
              </div>
            </div>
            {formData.originalPrice > formData.price && (
              <div className="rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-700 flex items-center gap-2">
                <Percent className="h-3.5 w-3.5" />
                Discount: {Math.round((1 - formData.price / formData.originalPrice) * 100)}% off
              </div>
            )}
          </TabsContent>

          <TabsContent value="media" className="mt-3 space-y-3">
            <div className="rounded-lg border-2 border-dashed p-8 text-center">
              <Camera className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">Drop product images here</p>
              <p className="text-xs text-muted-foreground/60">or click to browse (Coming soon)</p>
            </div>
            {formData.images.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 rounded-lg overflow-hidden border">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white rounded-bl-lg flex items-center justify-center" onClick={() => update("images", formData.images.filter((_, j) => j !== i))}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shipping" className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Weight (kg)</Label>
                <Input
                  placeholder="0.0"
                  value={formData.weight}
                  onChange={(e) => update("weight", e.target.value)}
                  className={INPUT.base}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Dimensions (cm)</Label>
                <Input
                  placeholder="L x W x H"
                  value={formData.dimensions}
                  onChange={(e) => update("dimensions", e.target.value)}
                  className={INPUT.base}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Shipping Class</Label>
                <Select value={formData.shippingClass} onValueChange={(v) => update("shippingClass", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="freight">Freight</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-3 border-t mt-4">
          <Button variant="outline" className="flex-1" onClick={() => { setFormData(emptyForm()); onClose(); }}>Cancel</Button>
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
            <Check className="mr-1.5 h-4 w-4" /> {isEditing ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Product Details Drawer ─── */
function ProductDetailsDrawer({ open, onClose, product, formData }: {
  open: boolean;
  onClose: () => void;
  product: Product;
  formData: ProductFormData;
}) {
  const { formatPrice } = useMarketplace();
  const stockInfo = getStockLabel(formData.stock, formData.status);
  const StockIcon = stockInfo.icon;
  const hasDiscount = formData.originalPrice > formData.price;
  const discountPct = hasDiscount ? Math.round((1 - formData.price / formData.originalPrice) * 100) : 0;

  // Mock stats
  const stats = {
    views: Math.floor(120 + Math.random() * 880),
    orders: Math.floor(5 + Math.random() * 95),
    revenue: formData.price * Math.floor(5 + Math.random() * 95),
    conversion: (1.5 + Math.random() * 5.5).toFixed(1),
    rating: product.rating,
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            {product.name}
          </SheetTitle>
          <SheetDescription>
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusBadge(formData.status)}`}>
              {formData.status.replace("_", " ")}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          {/* Image Gallery */}
          <div className="flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 overflow-hidden">
            {formData.images.length > 0 ? (
              <img src={formData.images[0]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <Package className="h-16 w-16 text-emerald-300" />
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{formData.description || product.description}</p>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/30 p-3">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Price</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-emerald-700">{formatPrice(formData.price, formData.currency)}</span>
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(formData.originalPrice, formData.currency)}</span>
                )}
              </div>
              {hasDiscount && <span className="text-[10px] text-red-500 font-medium">-{discountPct}% off</span>}
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Stock</span>
              <div className="mt-1 flex items-center gap-1.5">
                <StockIcon className={`h-4 w-4 ${stockInfo.color}`} />
                <span className={`text-sm font-semibold ${stockInfo.color}`}>{stockInfo.label}</span>
              </div>
              {formData.stock < 10 && formData.stock > 0 && (
                <span className="text-[10px] text-amber-600">Reorder at {formData.reorderPoint}</span>
              )}
            </div>
          </div>

          {/* Product Stats */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Product Performance</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Views", value: stats.views.toLocaleString(), icon: Eye, color: "text-blue-600" },
                { label: "Orders", value: stats.orders.toLocaleString(), icon: ShoppingBag, color: "text-emerald-600" },
                { label: "Revenue", value: formatPrice(stats.revenue, formData.currency), icon: DollarSign, color: "text-amber-600" },
                { label: "Conversion", value: `${stats.conversion}%`, icon: TrendingUp, color: "text-purple-600" },
                { label: "Rating", value: stats.rating.toFixed(1), icon: Star, color: "text-amber-500" },
                { label: "Margin", value: `${hasDiscount ? Math.round((1 - formData.price / formData.originalPrice) * 100) : "0"}%`, icon: Percent, color: "text-red-500" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border p-2.5 text-center">
                  <s.icon className={`mx-auto h-4 w-4 ${s.color}`} />
                  <p className="mt-1 text-sm font-bold">{s.value}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Shipping Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Ruler className="h-4 w-4" />
                <span>{formData.dimensions || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Weight className="h-4 w-4" />
                <span>{formData.weight ? `${formData.weight} kg` : "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                <Truck className="h-4 w-4" />
                <span className="capitalize">{formData.shippingClass} shipping</span>
              </div>
            </div>
          </div>

          {/* Product Meta */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Product Info</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-medium">{formData.sku || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium capitalize">{formData.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Brand</span>
                <span className="font-medium">{formData.brand || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Delete Confirmation ─── */
function DeleteConfirmModal({ open, onClose, productName, onConfirm }: {
  open: boolean;
  onClose: () => void;
  productName: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Product
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{productName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" className="flex-1" onClick={() => { onConfirm(); onClose(); }}>
            <Trash2 className="mr-1.5 h-4 w-4" /> Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main SellerProductManagement Component ─── */
export default function SellerProductManagement() {
  const { state, dispatch, formatPrice } = useMarketplace();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortField>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDelete, setShowDelete] = useState<Product | null>(null);
  const [showAiAssist, setShowAiAssist] = useState(false);
  const [aiAssistTarget, setAiAssistTarget] = useState("");
  const [showQuickStock, setShowQuickStock] = useState<Product | null>(null);
  const [showDetails, setShowDetails] = useState<Product | null>(null);

  // Derived data
  const sellerProducts = useMemo(
    () => state.products.filter((p) => p.vendorId === "v1"),
    [state.products]
  );

  const filteredProducts = useMemo(() => {
    let result = [...sellerProducts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "stock_high":
        result.sort((a, b) => b.stock - a.stock);
        break;
      case "stock_low":
        result.sort((a, b) => a.stock - b.stock);
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
    }

    return result;
  }, [sellerProducts, searchQuery, categoryFilter, sortBy]);

  // Build form data from product
  const getFormData = useCallback((product: Product): ProductFormData => ({
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice || 0,
    sku: product.sku || "",
    category: product.category,
    stock: product.stock,
    reorderPoint: 5,
    weight: "",
    dimensions: "",
    shippingClass: "standard",
    currency: product.currency,
    brand: product.brand || "",
    status: (product.stockStatus === "out-of-stock" ? "out_of_stock" : product.stockStatus === "draft" ? "draft" : product.stock <= 0 ? "out_of_stock" : "active") as ProductStatus,
    images: product.images || [],
  }), []);

  // Handlers
  const handleSaveProduct = (data: ProductFormData) => {
    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice || undefined,
        sku: data.sku,
        category: data.category,
        stock: data.stock,
        brand: data.brand,
        currency: data.currency as any,
        stockStatus: data.status === "out_of_stock" ? "out-of-stock" : data.status === "draft" ? "draft" : "in-stock",
        images: data.images,
      };
      dispatch({ type: "UPDATE_PRODUCT", payload: updated });
      toast.success("Product updated successfully");
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: `p${Date.now()}`,
        vendorId: "v1",
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice || undefined,
        currency: data.currency as any,
        category: data.category,
        region: "Nigeria",
        images: data.images,
        stock: data.stock,
        rating: 0,
        reviews: 0,
        createdAt: new Date().toISOString(),
        sku: data.sku,
        brand: data.brand,
        stockStatus: data.status === "active" ? "in-stock" : data.status === "out_of_stock" ? "out-of-stock" : "draft",
        sellerName: "Lagos TechHub",
        verifiedSeller: true,
        location: "Lagos, Nigeria",
        deliveryEstimate: "3-7 business days",
      };
      dispatch({ type: "ADD_PRODUCT", payload: newProduct });
      toast.success("Product added successfully");
    }
    setShowForm(false);
  };

  const handleDuplicate = (product: Product) => {
    const dup: Product = {
      ...product,
      id: `p${Date.now()}`,
      name: `${product.name} (Copy)`,
      stockStatus: "draft",
      createdAt: new Date().toISOString(),
      sku: product.sku ? `${product.sku}-COPY` : undefined,
    };
    dispatch({ type: "ADD_PRODUCT", payload: dup });
    toast.success("Product duplicated as draft");
  };

  const handleArchive = (product: Product) => {
    const updated = { ...product, stockStatus: "archived" as const };
    dispatch({ type: "UPDATE_PRODUCT", payload: updated });
    toast.success("Product archived");
  };

  const handleDelete = (productId: string) => {
    dispatch({ type: "DELETE_PRODUCT", payload: productId });
    toast.success("Product deleted permanently");
    setShowDelete(null);
  };

  const handleQuickStock = (product: Product, newStock: number) => {
    const updated = {
      ...product,
      stock: newStock,
      stockStatus: (newStock <= 0 ? "out-of-stock" : newStock < 10 ? "low-stock" : "in-stock") as "in-stock" | "out-of-stock" | "low-stock",
    } as Product;
    dispatch({ type: "UPDATE_PRODUCT", payload: updated });
    toast.success(`Stock updated to ${newStock}`);
  };

  const handleAiApplyDesc = (text: string) => {
    toast.success("AI description applied");
  };

  const handleAiApplyKeywords = (keywords: string[]) => {
    toast.success(`${keywords.length} keywords applied`);
  };

  const handleAiApplyPrice = (price: number, originalPrice: number) => {
    toast.success(`AI price suggestion: $${price} applied`);
  };

  const handleAiApplySeo = (seo: { title: string; description: string; slug: string }) => {
    toast.success("SEO data applied to listing");
  };

  const lowStockCount = sellerProducts.filter((p) => p.stock < 10 && p.stock > 0).length;
  const outOfStockCount = sellerProducts.filter((p) => p.stock <= 0 || p.stockStatus === "out-of-stock").length;
  const activeCount = sellerProducts.filter((p) => p.stockStatus !== "archived" && p.stockStatus !== "draft").length;

  return (
    <div className="space-y-5">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Products", value: sellerProducts.length, icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Active", value: activeCount, icon: CircleCheck, color: "text-green-600", bg: "bg-green-50" },
          { label: "Low Stock", value: lowStockCount, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Out of Stock", value: outOfStockCount, icon: X, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-36 text-xs">
              <Tag className="mr-1 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortField)}>
            <SelectTrigger className="h-9 w-36 text-xs">
              <ArrowUpDown className="mr-1 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="stock_high">Stock: High to Low</SelectItem>
              <SelectItem value="stock_low">Stock: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showFilters ? "secondary" : "ghost"}
            size="icon"
            className="h-9 w-9"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Product Button */}
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 h-9"
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Expandable Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
              <span className="text-xs font-medium text-muted-foreground">Quick Filters:</span>
              {[
                { label: "Low Stock", count: lowStockCount, filter: () => (setSearchQuery(""), setCategoryFilter("all"), setSortBy("stock_low")) },
                { label: "Out of Stock", count: outOfStockCount, filter: () => (setSearchQuery(""), setCategoryFilter("all"), setSortBy("stock_low")) },
                { label: "Active", count: activeCount, filter: () => (setSearchQuery(""), setCategoryFilter("all"), setSortBy("newest")) },
                { label: "Drafts", count: sellerProducts.filter((p) => p.stockStatus === "draft").length, filter: () => (setSearchQuery("draft"), setCategoryFilter("all")) },
              ].map((f) => (
                <Button key={f.label} variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={f.filter}>
                  {f.label}
                  <span className="rounded-full bg-muted px-1.5 py-0 text-[10px] font-medium">{f.count}</span>
                </Button>
              ))}
              <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 ml-auto" onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setSortBy("newest");
              }}>
                <RotateCcw className="mr-1 h-3 w-3" /> Reset
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> of {sellerProducts.length} products
        </p>
      </div>

      {/* Product Grid / List */}
      <AnimatePresence mode="popLayout">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-16 text-muted-foreground"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => { setSearchQuery(""); setCategoryFilter("all"); }}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset Filters
            </Button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const fd = getFormData(product);
              return (
                <ProductGridCard
                  key={product.id}
                  product={product}
                  formData={fd}
                  onView={() => setShowDetails(product)}
                  onEdit={() => { setEditingProduct(product); setShowForm(true); }}
                  onDuplicate={() => handleDuplicate(product)}
                  onArchive={() => handleArchive(product)}
                  onDelete={() => setShowDelete(product)}
                  onQuickStock={() => setShowQuickStock(product)}
                />
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProducts.map((product) => {
              const fd = getFormData(product);
              return (
                <ProductListRow
                  key={product.id}
                  product={product}
                  formData={fd}
                  onView={() => setShowDetails(product)}
                  onEdit={() => { setEditingProduct(product); setShowForm(true); }}
                  onDuplicate={() => handleDuplicate(product)}
                  onArchive={() => handleArchive(product)}
                  onDelete={() => setShowDelete(product)}
                  onQuickStock={() => setShowQuickStock(product)}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Product Form Modal */}
      <ProductFormModal
        open={showForm}
        onClose={() => { setShowForm(false); setEditingProduct(null); }}
        editProduct={editingProduct}
        onSave={handleSaveProduct}
        onAiAssist={() => {
          setAiAssistTarget(editingProduct?.name || "");
          setShowAiAssist(true);
        }}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        open={showAiAssist}
        onClose={() => setShowAiAssist(false)}
        productName={aiAssistTarget}
        onApplyDescription={handleAiApplyDesc}
        onApplyKeywords={handleAiApplyKeywords}
        onApplyPrice={handleAiApplyPrice}
        onApplySeo={handleAiApplySeo}
      />

      {/* Quick Stock Modal */}
      {showQuickStock && (
        <QuickStockModal
          open={true}
          onClose={() => setShowQuickStock(null)}
          product={showQuickStock}
          currentStock={showQuickStock.stock}
          onSave={(qty) => handleQuickStock(showQuickStock, qty)}
        />
      )}

      {/* Product Details Drawer */}
      {showDetails && (
        <ProductDetailsDrawer
          open={true}
          onClose={() => setShowDetails(null)}
          product={showDetails}
          formData={getFormData(showDetails)}
        />
      )}

      {/* Delete Confirmation */}
      {showDelete && (
        <DeleteConfirmModal
          open={true}
          onClose={() => setShowDelete(null)}
          productName={showDelete.name}
          onConfirm={() => handleDelete(showDelete.id)}
        />
      )}
    </div>
  );
}