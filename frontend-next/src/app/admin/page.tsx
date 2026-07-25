"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/lib/admin-context";
import { Package, ShoppingCart, DollarSign, Clock } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  customerName: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboardPage() {
  const { token } = useAdmin();
  const [totalProducts, setTotalProducts] = useState(0);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }

    let cancelled = false;
    const headers = { Authorization: `Bearer ${token}` };

    (async () => {
      try {
        const [productsRes, statsRes, ordersRes] = await Promise.all([
          fetch("/api/products", { headers }),
          fetch("/api/orders/stats/summary", { headers }),
          fetch("/api/orders?limit=5", { headers }),
        ]);
        if (cancelled) return;
        if (productsRes.ok) {
          const data = await productsRes.json();
          setTotalProducts(data.total || (Array.isArray(data) ? data.length : 0));
        }
        if (statsRes.ok) {
          const orderStats: OrderStats = await statsRes.json();
          setStats(orderStats);
        }
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          const orders = data.orders || (Array.isArray(data) ? data : []);
          setRecentOrders(orders.slice(0, 5));
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [token]);

  const statCards = [
    { label: "Total Products", value: totalProducts, icon: Package, color: "#B8935A" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "#0F172A" },
    { label: "Revenue", value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: "#22C55E" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "#F59E0B" },
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#B8935A" }} />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            className="rounded-xl p-5 backdrop-blur-md border border-white/20 shadow-lg"
            style={{ background: "rgba(255, 255, 255, 0.7)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#78716C", fontFamily: "var(--font-body)" }}>{card.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: "#0F172A", fontFamily: "var(--font-display)" }}>{card.value}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="rounded-xl backdrop-blur-md border border-white/20 shadow-lg overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.7)" }}>
        <div className="p-5 border-b" style={{ borderColor: "rgba(120, 113, 108, 0.15)" }}>
          <h2 className="text-lg font-bold" style={{ color: "#0F172A", fontFamily: "var(--font-display)" }}>RECENT ORDERS</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#78716C" }}>
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "rgba(120, 113, 108, 0.1)" }}>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm" style={{ color: "#78716C", fontFamily: "var(--font-body)" }}>No orders yet</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium" style={{ color: "#0F172A", fontFamily: "var(--font-body)" }}>#{order._id.slice(0, 8)}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: "#0F172A", fontFamily: "var(--font-body)" }}>{order.customerName || order.email}</td>
                    <td className="px-5 py-4 text-sm font-semibold" style={{ color: "#0F172A", fontFamily: "var(--font-body)" }}>${order.total.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: order.status === "delivered" ? "#DCFCE7" : order.status === "shipped" ? "#DBEAFE" : order.status === "cancelled" ? "#FEE2E2" : "#FEF3C7",
                          color: order.status === "delivered" ? "#166534" : order.status === "shipped" ? "#1E40AF" : order.status === "cancelled" ? "#991B1B" : "#92400E",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: "#78716C", fontFamily: "var(--font-body)" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
