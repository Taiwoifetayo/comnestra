import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Package, AlertTriangle, Boxes, ClipboardList, History,
  TrendingUp, TrendingDown, RefreshCcw, ArrowUpDown, Search,
  Filter, Plus, Minus, X, Check, Clock, Sparkles,
} from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "./ui/dialog";
import type {
  Product, StockMovement, StockAdjustmentReason, StockStatus, InventoryAlert,
} from "../types";
import { BTN, INPUT, CARD, BADGE, STATUS_BADGE } from "../constants";

const REASON_LABELS: Record<StockAdjustmentReason, string> = {
  restock: "Restock",
  damaged: "Damaged / Defective",
  audit: "Audit Adjustment",
  return: "Customer Return",
  sale: "Sale",
  other: "Other",
};

const REASON_COLORS: Record<StockAdjustmentReason, string> = {
  restock: "bg-emerald-100 text-emerald-700 border-emerald-200",
  damaged: "bg-red-100 text-red-700 border-red-200",
  audit: "bg-blue-100 text-blue-700 border-blue-200",
  return: "bg-amber-100 text-amber-700 border-amber-200",
  sale: "bg-purple-100 text-purple-700 border-purple-200",
  other: "bg-gray-100 text-gray-700 border-gray-200",
};

const STATUS_CONFIG: Record<StockStatus, { label: string; variant: "destructive" | "secondary" | "default" | "outline"; icon: typeof AlertTriangle }> = {
  in_stock: { label: "In Stock", variant: "default", icon: Check },
  low_stock: { label: "Low Stock", variant: "secondary", icon: AlertTriangle },
  out_of_stock: { label: "Out of Stock", variant: "destructive", icon: X },
};

function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return "out_of_stock";
  if (stock <= 10) return "low_stock";
  return "in_stock";
}

function generateInventoryAlerts(products: Product[]): InventoryAlert[] {
  return products
    .filter((p) => p.stock <= 20)
    .map((p) => {
      const status = getStockStatus(p.stock);
      const daysUntilStockout = p.stock > 0 ? Math.max(1, Math.round((p.stock / 3) * 7)) : null;
      const suggestedRestock = status === "out_of_stock" ? Math.max(50, p.stock * 0) + 50 : Math.max(20, p.stock * 2);
      return {
        productId: p.id,
        productName: p.name,
        sku: p.sku || `SKU-${p.id}`,
        currentStock: p.stock,
        status,
        daysUntilStockout,
        suggestedRestock,
        aiRecommendation: p.stock === 0
          ? "Critical — immediate restock required to avoid lost sales."
          : p.stock <= 5
            ? "High risk — reorder within 48 hours to prevent stockout."
            : "Moderate risk — plan restock within the week.",
      };
    });
}

function generateSampleMovements(products: Product[]): StockMovement[] {
  const movements: StockMovement[] = [];
  const now = Date.now();
  for (let i = 0; i < 8; i++) {
    const product = products[i % products.length];
    if (!product) continue;
    const reasons: StockAdjustmentReason[] = ["restock", "sale", "restock", "audit", "damaged", "return"];
    const reason = reasons[i % reasons.length];
    const change = reason === "restock" || reason === "return"
      ? Math.floor(Math.random() * 40) + 10
      : -(Math.floor(Math.random() * 8) + 1);
    const prevStock = product.stock - change;
    movements.push({
      id: `sm${i + 1}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku || `SKU-${product.id}`,
      previousStock: Math.max(0, prevStock),
      newStock: Math.max(0, prevStock + change),
      change,
      reason,
      notes: reason === "restock" ? "Supplier restock" : reason === "damaged" ? "Damaged in transit" : undefined,
      adjustedBy: "You",
      timestamp: new Date(now - i * 86400000 * 2).toISOString(),
    });
  }
  return movements.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export default function SellerInventoryManagement() {
  const { state, dispatch } = useMarketplace();
  const sellerProducts = state.products.filter((p) => p.vendorId === "v1");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "stock_asc" | "stock_desc">("name");
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState<StockAdjustmentReason>("restock");
  const [adjustNotes, setAdjustNotes] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const inventoryAlerts = useMemo(() => generateInventoryAlerts(sellerProducts), [sellerProducts]);
  const stockMovements = useMemo(() => {
    const existing = state.stockMovements;
    if (existing.length > 0) return existing;
    return generateSampleMovements(sellerProducts);
  }, [state.stockMovements, sellerProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...sellerProducts];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q));
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => getStockStatus(p.stock) === statusFilter);
    }
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "stock_asc") return a.stock - b.stock;
      return b.stock - a.stock;
    });
    return result;
  }, [sellerProducts, searchQuery, statusFilter, sortBy]);

  const handleAdjustStock = () => {
    if (!adjustingProduct) return;
    const newStock = Math.max(0, adjustAmount);
    const change = newStock - adjustingProduct.stock;

    dispatch({
      type: "UPDATE_STOCK",
      payload: { productId: adjustingProduct.id, newStock },
    });

    const movement: StockMovement = {
      id: `sm${Date.now()}`,
      productId: adjustingProduct.id,
      productName: adjustingProduct.name,
      sku: adjustingProduct.sku || `SKU-${adjustingProduct.id}`,
      previousStock: adjustingProduct.stock,
      newStock,
      change,
      reason: adjustReason,
      notes: adjustNotes || undefined,
      adjustedBy: "You",
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: "ADD_STOCK_MOVEMENT", payload: movement });

    toast.success(
      change > 0
        ? `Stock increased by ${change} (${adjustingProduct.name})`
        : `Stock decreased by ${Math.abs(change)} (${adjustingProduct.name})`
    );
    setAdjustingProduct(null);
    setAdjustAmount(0);
    setAdjustReason("restock");
    setAdjustNotes("");
  };

  const handleQuickAdjust = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    const change = newStock - product.stock;
    if (change === 0) return;

    dispatch({
      type: "UPDATE_STOCK",
      payload: { productId: product.id, newStock },
    });

    const movement: StockMovement = {
      id: `sm${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku || `SKU-${product.id}`,
      previousStock: product.stock,
      newStock,
      change,
      reason: delta > 0 ? "restock" : "sale",
      adjustedBy: "You",
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: "ADD_STOCK_MOVEMENT", payload: movement });

    toast.success(
      change > 0
        ? `+${change} stock added to ${product.name}`
        : `${change} stock deducted from ${product.name}`
    );
  };

  const handleBulkRestock = () => {
    const lowStockProducts = sellerProducts.filter((p) => getStockStatus(p.stock) === "low_stock");
    if (lowStockProducts.length === 0) {
      toast.info("No low-stock products to restock");
      return;
    }
    const updates = lowStockProducts.map((p) => {
      const newStock = p.stock + 25;
      dispatch({
        type: "UPDATE_STOCK",
        payload: { productId: p.id, newStock },
      });
      const movement: StockMovement = {
        id: `sm${Date.now()}-${p.id}`,
        productId: p.id,
        productName: p.name,
        sku: p.sku || `SKU-${p.id}`,
        previousStock: p.stock,
        newStock,
        change: 25,
        reason: "restock",
        notes: "Bulk AI-suggested restock",
        adjustedBy: "You",
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: "ADD_STOCK_MOVEMENT", payload: movement });
      return { productId: p.id, newStock };
    });
    toast.success(`Bulk restocked ${lowStockProducts.length} low-stock products (+25 each)`);
  };

  return (
    <div className="space-y-6">
      {/* Inventory Alerts Section */}
      {inventoryAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                Inventory Alerts ({inventoryAlerts.length})
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-amber-200 text-xs"
              onClick={handleBulkRestock}
            >
              <Sparkles className="mr-1 h-3 w-3 text-amber-600" />
              AI Bulk Restock
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {inventoryAlerts.slice(0, 6).map((alert) => (
              <div
                key={alert.productId}
                className="flex items-center justify-between rounded-lg border border-amber-200 bg-white/80 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{alert.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    Stock: <span className="font-semibold">{alert.currentStock}</span>
                    {alert.daysUntilStockout !== null && (
                      <span className="ml-1">· ~{alert.daysUntilStockout}d left</span>
                    )}
                  </p>
                </div>
                <Badge className={`ml-2 shrink-0 ${alert.status === "out_of_stock" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {alert.status === "out_of_stock" ? "Out" : "Low"}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className={`${INPUT.base} pl-8`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StockStatus | "all")}>
          <SelectTrigger className="h-9 w-36">
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="h-9 w-40">
            <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="stock_asc">Stock ↑ Low</SelectItem>
            <SelectItem value="stock_desc">Stock ↓ High</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9" onClick={() => setShowHistory(true)}>
          <History className="mr-1.5 h-3.5 w-3.5" />
          History
        </Button>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "In Stock", value: sellerProducts.filter((p) => getStockStatus(p.stock) === "in_stock").length, icon: Check, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Low Stock", value: sellerProducts.filter((p) => getStockStatus(p.stock) === "low_stock").length, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Out of Stock", value: sellerProducts.filter((p) => getStockStatus(p.stock) === "out_of_stock").length, icon: X, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Boxes className="h-4 w-4 text-emerald-600" />
            Product Inventory ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Package className="mb-2 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No products match your filters</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.stock);
                const StatusIcon = STATUS_CONFIG[status].icon;
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
                  >
                    {/* Product Info */}
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                        <Package className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sku || `SKU-${product.id}`} · {formatPrice(product.price, product.currency)}
                        </p>
                      </div>
                    </div>

                    {/* Stock Count */}
                    <div className="shrink-0 text-center">
                      <p className={`text-lg font-bold ${status === "out_of_stock" ? "text-red-600" : status === "low_stock" ? "text-amber-600" : "text-emerald-600"}`}>
                        {product.stock}
                      </p>
                      <p className="text-[10px] text-muted-foreground">units</p>
                    </div>

                    {/* Status Badge */}
                    <Badge variant={STATUS_CONFIG[status].variant} className="shrink-0 gap-1 px-2.5">
                      <StatusIcon className="h-3 w-3" />
                      {STATUS_CONFIG[status].label}
                    </Badge>

                    {/* Quick Adjust Buttons */}
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuickAdjust(product, -1)}
                        disabled={product.stock <= 0}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuickAdjust(product, 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Adjust Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 shrink-0 text-xs"
                      onClick={() => {
                        setAdjustingProduct(product);
                        setAdjustAmount(product.stock);
                        setAdjustReason("restock");
                        setAdjustNotes("");
                      }}
                    >
                      <RefreshCcw className="mr-1 h-3 w-3" />
                      Adjust
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Adjustment Dialog */}
      <Dialog open={!!adjustingProduct} onOpenChange={(o) => { if (!o) setAdjustingProduct(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 text-emerald-600" />
              Adjust Stock
            </DialogTitle>
            <DialogDescription>
              {adjustingProduct?.name} · Current stock: <span className="font-semibold">{adjustingProduct?.stock}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">New Stock Quantity</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => setAdjustAmount(Math.max(0, adjustAmount - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min={0}
                  className="text-center text-lg font-bold"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Math.max(0, Number(e.target.value)))}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => setAdjustAmount(adjustAmount + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {adjustingProduct && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Change: {adjustAmount - adjustingProduct.stock > 0 ? "+" : ""}
                  {adjustAmount - adjustingProduct.stock} units
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Reason for Adjustment</label>
              <Select value={adjustReason} onValueChange={(v) => setAdjustReason(v as StockAdjustmentReason)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(REASON_LABELS) as StockAdjustmentReason[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      <span className={`inline-block rounded px-1.5 py-0.5 text-xs ${REASON_COLORS[r]}`}>
                        {REASON_LABELS[r]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Notes (optional)</label>
              <Input
                placeholder="e.g. Supplier restock, damaged items..."
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setAdjustingProduct(null)}>
                Cancel
              </Button>
              <Button className={`flex-1 ${BTN.primary}`} onClick={handleAdjustStock}>
                <Check className="mr-1.5 h-4 w-4" />
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Movement History Drawer */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-4 w-4 text-emerald-600" />
              Stock Movement History
            </DialogTitle>
            <DialogDescription>Recent stock adjustments across all products</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-2">
              {stockMovements.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No stock movements recorded yet</p>
              ) : (
                stockMovements.map((movement) => {
                  const isPositive = movement.change > 0;
                  return (
                    <div
                      key={movement.id}
                      className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isPositive ? "bg-emerald-50" : "bg-red-50"}`}>
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{movement.productName}</p>
                          <span className={`inline-block rounded border px-1.5 py-0.5 text-[10px] ${REASON_COLORS[movement.reason]}`}>
                            {REASON_LABELS[movement.reason]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{movement.previousStock} → {movement.newStock}</span>
                          <span className={`font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                            {isPositive ? "+" : ""}{movement.change}
                          </span>
                          {movement.notes && <span>· {movement.notes}</span>}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(movement.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(movement.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(price);
}