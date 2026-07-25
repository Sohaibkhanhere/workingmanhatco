"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, Heart, MapPin, Save, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function AccountPage() {
  const router = useRouter();
  const { user, token, logout, updateUser, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "orders" && token) {
      setOrdersLoading(true);
      fetch(`/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setOrders(Array.isArray(data) ? data : data.orders || []))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab === "favorites" && token) {
      setFavLoading(true);
      fetch(`/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setFavorites(Array.isArray(data) ? data : data.products || []))
        .catch(() => setFavorites([]))
        .finally(() => setFavLoading(false));
    }
  }, [activeTab, token]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      updateUser(data.user || { name, phone });
      setSaveMsg("Profile updated!");
    } catch (err: any) {
      setSaveMsg(err.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-[#E4D6A9]">
        <section className="bg-[#3A1808] py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(196,120,50,0.06)_0%,transparent_60%)]" />
          <div className="relative max-w-[1400px] mx-auto px-5 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className="text-5xl lg:text-7xl text-[#E4D6A9]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                MY ACCOUNT
              </h1>
              <div className="w-16 h-[2px] bg-[#995F2F] mx-auto mt-4" />
              <p className="text-[#E4D6A9]/40 text-sm mt-4" style={{ fontFamily: "var(--font-body)" }}>
                Welcome back, {user.name}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 lg:py-20">
          <div className="max-w-[1000px] mx-auto px-5">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 border-b border-[#D4CBA8] pb-4">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[0.7rem] font-bold tracking-[0.08em] uppercase transition-all duration-300 min-h-[44px] ${
                    activeTab === tab.id
                      ? "bg-[#622B14] text-[#E4D6A9]"
                      : "bg-white text-[#978F66] hover:text-[#995F2F]"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <tab.icon size={15} />
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg p-8 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)]"
                >
                  <h2
                    className="text-2xl mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    PROFILE DETAILS
                  </h2>
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#E4D6A9]/30 border border-[#D4CBA8] rounded-lg text-sm text-[#622B14] focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px] transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-4 py-3 bg-[#D4CBA8]/30 border border-[#D4CBA8] rounded-lg text-sm text-[#978F66] cursor-not-allowed min-h-[44px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-[#E4D6A9]/30 border border-[#D4CBA8] rounded-lg text-sm text-[#622B14] focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px] transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}
                        placeholder="(555) 000-0000"
                      />
                    </div>
                    {saveMsg && (
                      <p className="text-sm text-[#995F2F] font-medium" style={{ fontFamily: "var(--font-body)" }}>
                        {saveMsg}
                      </p>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-[#622B14] text-[#E4D6A9] text-[0.7rem] font-bold tracking-[0.12em] uppercase rounded-lg hover:bg-[#622B14] transition-all duration-300 disabled:opacity-50 min-h-[44px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <Save size={14} />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { logout(); router.push("/"); }}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-[#D4CBA8] text-[#978F66] text-[0.7rem] font-bold tracking-[0.12em] uppercase rounded-lg hover:border-red-300 hover:text-red-500 transition-all duration-300 min-h-[44px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg p-8 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)]"
                >
                  <h2
                    className="text-2xl mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    ORDER HISTORY
                  </h2>
                  {ordersLoading ? (
                    <p className="text-sm text-[#978F66]">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={40} className="mx-auto text-[#D4CBA8] mb-4" />
                      <p className="text-sm text-[#978F66]" style={{ fontFamily: "var(--font-body)" }}>
                        No orders yet. Time to shop!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order._id} className="border border-[#D4CBA8] rounded-lg p-5">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-xs text-[#978F66]" style={{ fontFamily: "var(--font-body)" }}>
                                Order #{order._id?.slice(-8)}
                              </p>
                              <p className="text-xs text-[#978F66]/60" style={{ fontFamily: "var(--font-body)" }}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-3 py-1 text-[0.6rem] font-bold tracking-wider uppercase rounded bg-[#995F2F]/10 text-[#995F2F]" style={{ fontFamily: "var(--font-body)" }}>
                              {order.status || "Processing"}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[#622B14]" style={{ fontFamily: "var(--font-body)" }}>
                            ${order.total?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <motion.div
                  key="favorites"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2
                    className="text-2xl mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    YOUR FAVORITES
                  </h2>
                  {favLoading ? (
                    <p className="text-sm text-[#978F66]">Loading favorites...</p>
                  ) : favorites.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)] text-center">
                      <Heart size={40} className="mx-auto text-[#D4CBA8] mb-4" />
                      <p className="text-sm text-[#978F66]" style={{ fontFamily: "var(--font-body)" }}>
                        No favorites yet. Tap the heart on products you love!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {favorites.map((product, i) => (
                        <ProductCard key={product._id} product={product} index={i} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg p-8 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)]"
                >
                  <h2
                    className="text-2xl mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    SAVED ADDRESSES
                  </h2>
                  <div className="text-center py-12">
                    <MapPin size={40} className="mx-auto text-[#D4CBA8] mb-4" />
                    <p className="text-sm text-[#978F66] mb-4" style={{ fontFamily: "var(--font-body)" }}>
                      No saved addresses yet.
                    </p>
                    <button
                      className="px-6 py-3 bg-[#622B14] text-[#E4D6A9] text-[0.7rem] font-bold tracking-[0.12em] uppercase rounded-lg hover:bg-[#622B14] transition-all duration-300 min-h-[44px]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Add Address
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
