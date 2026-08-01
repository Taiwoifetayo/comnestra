import { type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  RefreshCw,
  Package,
  Search,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  BarChart,
  Eye,
  Clock,
  Shield,
  Zap,
  Users,
  Star,
  FileText,
  Layers,
  Box,
  Loader,
} from "lucide-react";

import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────
 *  Animations
 * ────────────────────────────────────────────── */

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

/* ──────────────────────────────────────────────
 *  Dashboard Skeleton — full-page loader
 * ────────────────────────────────────────────── */

export function DashboardSkeleton({
  className,
  cards = 4,
  rows = 3,
}: {
  className?: string;
  cards?: number;
  rows?: number;
}) {
  return (
    <motion.div
      className={cn("space-y-6", className)}
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="space-y-2">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-7 w-24 rounded-md" />
              </div>
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Content Area */}
      <motion.div variants={fadeInUp} className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border border-slate-100 bg-white p-3"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/5 rounded" />
              <Skeleton className="h-3 w-2/5 rounded" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
 *  Table Skeleton — rows with columns
 * ────────────────────────────────────────────── */

export function TableSkeleton({
  className,
  columns = 4,
  rows = 5,
}: {
  className?: string;
  columns?: number;
  rows?: number;
}) {
  return (
    <motion.div
      className={cn("space-y-2", className)}
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* Header row */}
      <motion.div
        variants={fadeInUp}
        className="flex items-center gap-4 rounded-lg bg-slate-50 px-4 py-3"
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-4 rounded",
              i === 0 ? "w-2/5" : i === columns - 1 ? "w-16" : "w-20",
            )}
          />
        ))}
      </motion.div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <motion.div
          key={r}
          variants={fadeInUp}
          className="flex items-center gap-4 rounded-lg border border-slate-100 bg-white px-4 py-3"
        >
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton
              key={c}
              className={cn(
                "h-4 rounded",
                c === 0 ? "w-2/5" : c === columns - 1 ? "w-16" : "w-20",
              )}
            />
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
 *  Card Skeleton — single stat card placeholder
 * ────────────────────────────────────────────── */

export function CardSkeleton({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "compact";
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white shadow-sm",
        variant === "compact" ? "p-3" : "p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className={cn("rounded", variant === "compact" ? "h-2.5 w-12" : "h-3 w-16")} />
          <Skeleton
            className={cn("rounded-md", variant === "compact" ? "h-6 w-16" : "h-7 w-24")}
          />
        </div>
        <Skeleton className={cn("rounded-lg", variant === "compact" ? "h-7 w-7" : "h-9 w-9")} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Skeleton className={cn("rounded", variant === "compact" ? "h-3 w-10" : "h-4 w-12")} />
        <Skeleton className={cn("rounded", variant === "compact" ? "h-3 w-12" : "h-4 w-16")} />
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
 *  Empty State — configurable
 * ────────────────────────────────────────────── */

const emptyIcons: Record<string, ReactNode> = {
  default: <Package className="size-8" />,
  search: <Search className="size-8" />,
  orders: <ShoppingBag className="size-8" />,
  products: <Box className="size-8" />,
  users: <Users className="size-8" />,
  revenue: <DollarSign className="size-8" />,
  analytics: <BarChart className="size-8" />,
  activity: <Eye className="size-8" />,
  history: <Clock className="size-8" />,
  security: <Shield className="size-8" />,
  performance: <Zap className="size-8" />,
  ratings: <Star className="size-8" />,
  reports: <FileText className="size-8" />,
  categories: <Layers className="size-8" />,
};

export type EmptyStateIcon = keyof typeof emptyIcons;

interface EmptyStateProps {
  icon?: EmptyStateIcon | ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon = "default",
  title = "No data available",
  description = "There are no items to display at the moment.",
  action,
  className,
}: EmptyStateProps) {
  const iconElement =
    typeof icon === "string" ? (
      <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {emptyIcons[icon] ?? emptyIcons.default}
      </div>
    ) : (
      icon
    );

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className={cn(
        "flex min-h-[240px] w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center",
        className,
      )}
    >
      {iconElement}
      <div className="max-w-xs space-y-1.5">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="text-xs leading-relaxed text-slate-500">{description}</p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
 *  Error State — with retry
 * ────────────────────────────────────────────── */

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className={cn(
        "flex min-h-[240px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50/50 p-8 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-500">
        <AlertCircle className="size-8" />
      </div>
      <div className="max-w-xs space-y-1.5">
        <p className="text-sm font-semibold text-red-700">{title}</p>
        <p className="text-xs leading-relaxed text-red-500">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-outline btn-sm inline-flex items-center gap-1.5"
          type="button"
        >
          <RefreshCw className="size-3.5" />
          Try Again
        </button>
      )}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
 *  Loading Overlay — inline spinner
 * ────────────────────────────────────────────── */

export function LoadingOverlay({
  className,
  label = "Loading...",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] w-full flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <Loader className="size-6 animate-spin text-slate-400" />
      <p className="text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────
 *  Metric Card — stat card with icon, trend
 * ────────────────────────────────────────────── */

interface MetricCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
  onClick?: () => void;
}

export function MetricCard({
  label,
  value,
  icon,
  trend,
  className,
  onClick,
}: MetricCardProps) {
  const Comp = onClick ? "button" : "div";
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      whileHover={onClick ? { y: -2, transition: { duration: 0.2 } } : undefined}
    >
      <Comp
        onClick={onClick}
        className={cn(
          "group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200",
          onClick && "cursor-pointer text-left hover:shadow-md hover:border-slate-300",
          className,
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wide text-slate-500">{label}</p>
            <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-600">
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                trend.positive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              <TrendingUp
                className={cn(
                  "size-3",
                  trend.positive ? "" : "rotate-180",
                )}
              />
              {trend.value}
            </span>
            <span className="text-[11px] text-slate-400">vs last period</span>
          </div>
        )}
        {/* Subtle hover glow */}
        <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-50/40 to-transparent" />
        </div>
      </Comp>
    </motion.div>
  );
}