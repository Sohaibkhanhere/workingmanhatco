"use client";

import { useEffect, useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/lib/admin-context";
import {
  Package,
  Search,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
}

interface Order {
  _id: string;
  customerName: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  paymentMethod?: string;
}

type StatusFilter = "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#FEF3C7", text: "#92400E" },
  processing: { bg: "#DBEAFE", text: "#1E40AF" },
  shipped: { bg: "#EDE9FE", text: "#6D28D9" },
  delivered: { bg: "#DCFCE7", text: "#166534" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function OrdersPage() {
  const { token } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders ?? []);
    } catch (err) {
      console.error("Orders fetch failed:", err);
      setError("Failed to load orders. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (!token) return;
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      console.error("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      order._id.slice(-8).includes(q) ||
      order.customerName?.toLowerCase().includes(q) ||
      order.email?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const tabCounts = (key: StatusFilter) => {
    if (key === "all") return orders.length;
    return orders.filter((o) => o.status === key).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-brand"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ORDERS
            </h1>
            <p className="text-sm text-warm-gray" style={{ fontFamily: "var(--font-body)" }}>
              Manage and fulfill customer orders
            </p>
          </div>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-warm-gray-lighter text-sm font-medium text-brand hover:bg-white/50 transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Search + Tabs */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
          <input
            type="text"
            placeholder="Search by ID, name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-warm-gray-lighter bg-white text-sm text-brand placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold min-h-[44px]"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px]"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: activeTab === tab.key ? "#0F172A" : "rgba(255,255,255,0.7)",
                color: activeTab === tab.key ? "#FAFAF8" : "#78716C",
                border: `1px solid ${activeTab === tab.key ? "#0F172A" : "rgba(120,113,108,0.2)"}`,
              }}
            >
              {tab.label}
              <span
                className="ml-1.5 text-xs"
                style={{ opacity: 0.7 }}
              >
                {tabCounts(tab.key)}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl backdrop-blur-md border border-white/20 shadow-lg overflow-hidden"
        style={{ background: "rgba(255, 255, 255, 0.7)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#78716C" }}
              >
                <th className="px-5 py-3" />
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Update</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "rgba(120, 113, 108, 0.1)" }}
            >
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-warm-gray"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrder === order._id;
                  const badge = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;

                  return (
                    <Fragment key={order._id}>
                      <tr
                        className="hover:bg-white/50 transition-colors cursor-pointer"
                        onClick={() =>
                          setExpandedOrder(isExpanded ? null : order._id)
                        }
                      >
                        <td className="px-5 py-4">
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-4 h-4 text-warm-gray" />
                          </motion.div>
                        </td>
                        <td
                          className="px-5 py-4 text-sm font-medium text-brand font-mono"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          #{order._id.slice(-8)}
                        </td>
                        <td className="px-5 py-4 text-sm text-brand" style={{ fontFamily: "var(--font-body)" }}>
                          <div>{order.customerName || "—"}</div>
                          <div className="text-xs text-warm-gray">{order.email}</div>
                        </td>
                        <td className="px-5 py-4 text-sm text-brand" style={{ fontFamily: "var(--font-body)" }}>
                          {order.items?.length ?? 0}
                        </td>
                        <td
                          className="px-5 py-4 text-sm font-semibold text-brand"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          ${(order.total ?? 0).toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: badge.bg, color: badge.text }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td
                          className="px-5 py-4 text-sm text-warm-gray"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order._id, e.target.value)}
                              disabled={updatingId === order._id}
                              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-warm-gray-lighter text-xs font-medium bg-white text-brand min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/30 cursor-pointer disabled:opacity-50"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-warm-gray pointer-events-none" />
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="p-0">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" as const }}
                                className="overflow-hidden"
                              >
                                <div
                                  className="px-5 py-5 mx-5 mb-5 rounded-lg border border-warm-gray-lighter bg-cream"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Items */}
                                    <div>
                                      <h4 className="text-xs font-semibold uppercase tracking-wider text-warm-gray mb-3">
                                        Order Items
                                      </h4>
                                      <div className="space-y-2">
                                        {order.items?.map((item, i) => (
                                          <div
                                            key={i}
                                            className="flex justify-between items-center text-sm py-2 px-3 rounded bg-white"
                                          >
                                            <div>
                                              <span className="text-brand font-medium">
                                                {item.title}
                                              </span>
                                              <span className="text-warm-gray ml-2">
                                                × {item.quantity}
                                              </span>
                                              {item.size && (
                                                <span className="text-warm-gray ml-2">
                                                  ({item.size})
                                                </span>
                                              )}
                                            </div>
                                            <span className="text-brand font-semibold">
                                              ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Shipping & Payment */}
                                    <div>
                                      <h4 className="text-xs font-semibold uppercase tracking-wider text-warm-gray mb-3">
                                        Details
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        {order.address && (
                                          <div className="p-3 rounded bg-white">
                                            <span className="text-warm-gray text-xs block mb-1">
                                              Shipping Address
                                            </span>
                                            <span className="text-brand">
                                              {order.address.street}
                                              {order.address.city && `, ${order.address.city}`}
                                              {order.address.state && `, ${order.address.state}`}
                                              {order.address.zip && ` ${order.address.zip}`}
                                              {order.address.country && `, ${order.address.country}`}
                                            </span>
                                          </div>
                                        )}
                                        {order.paymentMethod && (
                                          <div className="p-3 rounded bg-white">
                                            <span className="text-warm-gray text-xs block mb-1">
                                              Payment
                                            </span>
                                            <span className="text-brand">{order.paymentMethod}</span>
                                          </div>
                                        )}
                                        <div className="p-3 rounded bg-white">
                                          <span className="text-warm-gray text-xs block mb-1">
                                            Order Date
                                          </span>
                                          <span className="text-brand">
                                            {new Date(order.createdAt).toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.p
        variants={itemVariants}
        className="text-xs text-warm-gray"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Showing {filteredOrders.length} of {orders.length} orders
      </motion.p>
    </motion.div>
  );
}

