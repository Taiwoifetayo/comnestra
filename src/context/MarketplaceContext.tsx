import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useState } from "react";
import type { UserRole, CurrencyCode, Product, Vendor, Order, CartItem, AIInsight, User, AppView, StockMovement, StockAdjustmentReason, OrderStatus, PaymentMethod } from "../types";
import { CURRENCIES, PRODUCTS, VENDORS, USERS, AI_INSIGHTS } from "../constants";
import { supabase } from "@/integrations/supabase/client";
import { productsService } from "@/services/products.service";
import { ordersService } from "@/services/orders.service";
import { cartService } from "@/services/cart.service";
import { authService } from "@/services/auth.service";
import { sellerService } from "@/services/seller.service";

interface MarketplaceState {
  role: UserRole;
  currentUser: User;
  currency: CurrencyCode;
  products: Product[];
  vendors: Vendor[];
  orders: Order[];
  sellerOrders: Order[];
  cart: CartItem[];
  users: User[];
  aiInsights: AIInsight[];
  searchQuery: string;
  selectedCategory: string;
  nestraOpen: boolean;
  view: AppView;
  selectedProductId: string | null;
  aiPickOnly: boolean;
  stockFilter: string;
  sortBy: string;
  currentOrder: Order | null;
  stockMovements: StockMovement[];
  sellerTab: string;
}

interface SupabaseSyncState {
  loading: boolean;
  error: string | null;
  synced: boolean;
}

type Action =
  | { type: "SET_ROLE"; payload: UserRole }
  | { type: "SET_CURRENCY"; payload: CurrencyCode }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QTY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "APPROVE_VENDOR"; payload: string }
  | { type: "TOGGLE_VENDOR_STATUS"; payload: string }
  | { type: "CREATE_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER_STATUS"; payload: { id: string; status: Order["status"] } }
  | { type: "SET_SELLER_ORDERS"; payload: Order[] }
  | { type: "SET_NESTRA_OPEN"; payload: boolean }
  | { type: "SET_VIEW"; payload: AppView }
  | { type: "SET_SELECTED_PRODUCT"; payload: string | null }
  | { type: "SET_AI_PICK_ONLY"; payload: boolean }
  | { type: "SET_STOCK_FILTER"; payload: string }
  | { type: "SET_SORT_BY"; payload: string }
  | { type: "SET_ORDER"; payload: Order }
  | { type: "RESET_FILTERS" }
  | { type: "LOAD_STATE"; payload: Partial<MarketplaceState> }
  | { type: "UPDATE_STOCK"; payload: { productId: string; newStock: number } }
  | { type: "ADD_STOCK_MOVEMENT"; payload: StockMovement }
  | { type: "BULK_UPDATE_STOCK"; payload: { productId: string; newStock: number }[] }
  | { type: "SET_SELLER_TAB"; payload: string };

const STORAGE_KEY = "comnestra_state";

function reducer(state: MarketplaceState, action: Action): MarketplaceState {
  switch (action.type) {
    case "SET_ROLE": {
      const user = USERS.find((u) => u.role === action.payload) || USERS[0];
      return { ...state, role: action.payload, currentUser: user, aiInsights: AI_INSIGHTS[action.payload] || [] };
    }
    case "SET_CURRENCY":
      return { ...state, currency: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "ADD_TO_CART": {
      const existing = state.cart.find((i) => i.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.productId === action.payload.productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((i) => i.productId !== action.payload) };
    case "UPDATE_CART_QTY":
      return {
        ...state,
        cart: action.payload.quantity <= 0
          ? state.cart.filter((i) => i.productId !== action.payload.productId)
          : state.cart.map((i) =>
              i.productId === action.payload.productId ? { ...i, quantity: action.payload.quantity } : i
            ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "ADD_PRODUCT":
      return { ...state, products: [action.payload, ...state.products] };
    case "UPDATE_PRODUCT":
      return { ...state, products: state.products.map((p) => (p.id === action.payload.id ? action.payload : p)) };
    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter((p) => p.id !== action.payload) };
    case "APPROVE_VENDOR":
      return { ...state, vendors: state.vendors.map((v) => (v.id === action.payload ? { ...v, verified: true } : v)) };
    case "TOGGLE_VENDOR_STATUS":
      return {
        ...state,
        vendors: state.vendors.map((v) => (v.id === action.payload ? { ...v, active: !v.active } : v)),
      };
    case "CREATE_ORDER":
      return { ...state, orders: [action.payload, ...state.orders], cart: [] };
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.payload.id ? { ...o, status: action.payload.status } : o)),
      };
    case "SET_SELLER_ORDERS":
      return { ...state, sellerOrders: action.payload };
    case "SET_NESTRA_OPEN":
      return { ...state, nestraOpen: action.payload };
    case "SET_VIEW":
      return { ...state, view: action.payload };
    case "SET_SELECTED_PRODUCT":
      return { ...state, selectedProductId: action.payload, view: action.payload ? "product" : "browse" };
    case "SET_AI_PICK_ONLY":
      return { ...state, aiPickOnly: action.payload };
    case "SET_STOCK_FILTER":
      return { ...state, stockFilter: action.payload };
    case "SET_ORDER":
      return { ...state, currentOrder: action.payload };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    case "RESET_FILTERS":
      return { ...state, searchQuery: "", selectedCategory: "all", aiPickOnly: false, stockFilter: "all", sortBy: "recommended" };
    case "LOAD_STATE":
      return { ...state, ...action.payload };
    case "UPDATE_STOCK":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.productId ? { ...p, stock: action.payload.newStock, stockStatus: action.payload.newStock === 0 ? "out_of_stock" as any : action.payload.newStock <= 10 ? "low_stock" as any : "in_stock" as any } : p
        ),
      };
    case "ADD_STOCK_MOVEMENT":
      return { ...state, stockMovements: [action.payload, ...state.stockMovements] };
    case "BULK_UPDATE_STOCK":
      return {
        ...state,
        products: state.products.map((p) => {
          const update = action.payload.find((u) => u.productId === p.id);
          if (!update) return p;
          return { ...p, stock: update.newStock, stockStatus: update.newStock === 0 ? "out_of_stock" as any : update.newStock <= 10 ? "low_stock" as any : "in_stock" as any };
        }),
      };
    case "SET_SELLER_TAB":
      return { ...state, sellerTab: action.payload };
    default:
      return state;
  }
}

const initialState: MarketplaceState = {
  role: "buyer",
  currentUser: USERS[0],
  currency: "USD",
  products: PRODUCTS,
  vendors: VENDORS,
  orders: [],
  sellerOrders: [],
  cart: [],
  users: USERS,
  aiInsights: AI_INSIGHTS.buyer,
  searchQuery: "",
  selectedCategory: "all",
  nestraOpen: false,
  view: "browse",
  selectedProductId: null,
  aiPickOnly: false,
  stockFilter: "all",
  sortBy: "recommended",
  currentOrder: null,
  stockMovements: [],
  sellerTab: "products",
};

interface MarketplaceContextType {
  state: MarketplaceState;
  dispatch: React.Dispatch<Action>;
  formatPrice: (amount: number, fromCurrency?: CurrencyCode) => string;
  convertPrice: (amount: number, fromCurrency?: CurrencyCode) => number;
  filteredProducts: Product[];
  cartTotal: number;
  syncState: SupabaseSyncState;
  supabase: typeof supabase;
  services: {
    products: typeof productsService;
    orders: typeof ordersService;
    cart: typeof cartService;
    auth: typeof authService;
    seller: typeof sellerService;
  };
}

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

function mapDbOrdersToFrontend(data: any[]): Order[] {
  return data.map((o) => ({
    id: o.id,
    buyerId: o.buyer_id,
    vendorId: o.vendor_id,
    items: (o.order_items || []).map((item: any) => ({
      productId: item.product_id,
      name: item.product?.name || item.product_id,
      price: Number(item.unit_price),
      quantity: item.quantity,
      image: "",
      vendorId: o.vendor_id,
      vendorName: "",
    })),
    total: Number(o.total),
    currency: "USD" as CurrencyCode,
    status: o.status as OrderStatus,
    paymentMethod: (o.payment_method || "mpesa") as PaymentMethod,
    shippingAddress: o.shipping_address || "",
    createdAt: o.created_at,
    updatedAt: o.updated_at || o.created_at,
  }));
}

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialState, ...parsed };
      }
    } catch {}
    return initialState;
  });

  const [syncState, setSyncState] = useState<SupabaseSyncState>({
    loading: true,
    error: null,
    synced: false,
  });

  useEffect(() => {
    try {
      const { currentUser, ...persistable } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {}
  }, [state]);

  // Load products from Supabase on mount
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setSyncState((s) => ({ ...s, loading: true, error: null }));
        const [products, vendors, orders] = await Promise.all([
          productsService.list(),
          sellerService.listAll(),
          ordersService.listMyOrders(state.currentUser.id),
        ]);
        if (!mounted) return;
        if (products.length) {
          dispatch({ type: "LOAD_STATE", payload: { products: products as unknown as Product[] } });
        }
        if (vendors.length) {
          dispatch({ type: "LOAD_STATE", payload: { vendors: vendors as unknown as Vendor[] } });
        }
        if (orders.length) {
          dispatch({ type: "LOAD_STATE", payload: { orders: orders as unknown as Order[] } });
        }
        setSyncState({ loading: false, error: null, synced: true });
      } catch (err: any) {
        if (!mounted) return;
        const msg = err?.message || "Failed to load data from server";
        console.warn("Supabase sync error:", msg);
        setSyncState({ loading: false, error: msg, synced: false });
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  // Sync cart to Supabase when it changes
  useEffect(() => {
    if (!syncState.synced || state.cart.length === 0) return;
    // Cart sync is handled via cartService.upsert on individual add actions
    // Full sync from context is deferred to per-item operations
  }, [state.cart, syncState.synced]);

  // Load seller orders from Supabase when user is a seller
  useEffect(() => {
    if (state.currentUser.role !== "seller") return;
    let mounted = true;
    const loadSellerOrders = async () => {
      try {
        const vendor = await sellerService.getByOwner(state.currentUser.id);
        if (vendor && mounted) {
          const data = await ordersService.listByVendor(vendor.id);
          if (mounted && data.length) {
            dispatch({ type: "SET_SELLER_ORDERS", payload: mapDbOrdersToFrontend(data as any) });
          }
          return;
        }
        // Fallback: get first active vendor
        const allVendors = await sellerService.listAll();
        if (allVendors.length > 0 && mounted) {
          const data = await ordersService.listByVendor(allVendors[0].id);
          if (mounted && data.length) {
            dispatch({ type: "SET_SELLER_ORDERS", payload: mapDbOrdersToFrontend(data as any) });
          }
        }
      } catch (e) {
        if (!mounted) return;
        console.warn("Could not load seller orders:", e);
      }
    };
    loadSellerOrders();
    return () => { mounted = false; };
  }, [state.currentUser.role]);

  const convertPrice = useCallback(
    (amount: number, fromCurrency: CurrencyCode = "USD") => {
      const from = CURRENCIES.find((c) => c.code === fromCurrency);
      const to = CURRENCIES.find((c) => c.code === state.currency);
      if (!from || !to) return amount;
      return (amount / from.rate) * to.rate;
    },
    [state.currency]
  );

  const formatPrice = useCallback(
    (amount: number, fromCurrency: CurrencyCode = "USD") => {
      const converted = convertPrice(amount, fromCurrency);
      const currency = CURRENCIES.find((c) => c.code === state.currency);
      return `${currency?.symbol || "$"}${converted.toFixed(2)}`;
    },
    [convertPrice, state.currency]
  );

  const filteredProducts = useMemo(() => {
    let filtered = state.products.filter((p) => {
      const q = state.searchQuery.toLowerCase();
      const matchesSearch =
        !state.searchQuery ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.sellerName || "").toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q) ||
        (p.vendorId || "").toLowerCase().includes(q);
      const matchesCategory =
        state.selectedCategory === "all" || p.category === state.selectedCategory;
      const matchesAiPick = !state.aiPickOnly || p.aiRecommended;
      const matchesStock =
        state.stockFilter === "all" ||
        (state.stockFilter === "in-stock" && p.stock > 0) ||
        (state.stockFilter === "low-stock" && p.stock > 0 && p.stock <= 10) ||
        (state.stockFilter === "out-of-stock" && p.stock === 0);
      return matchesSearch && matchesCategory && matchesAiPick && matchesStock;
    });

    // Sort products
    if (state.sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (state.sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (state.sortBy === "rating") {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (state.sortBy === "newest") {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [state.products, state.searchQuery, state.selectedCategory, state.aiPickOnly, state.stockFilter, state.sortBy]);

  const cartTotal = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [state.cart]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      formatPrice,
      convertPrice,
      filteredProducts,
      cartTotal,
      syncState,
      supabase,
      services: { products: productsService, orders: ordersService, cart: cartService, auth: authService, seller: sellerService },
    }),
    [state, dispatch, formatPrice, convertPrice, filteredProducts, cartTotal, syncState]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used within MarketplaceProvider");
  return ctx;
}