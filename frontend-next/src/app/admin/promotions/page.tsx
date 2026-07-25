"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/lib/admin-context";
import { Tag, Plus, Trash2, Edit, X, Check, Percent, DollarSign, Calendar, PercentCircle } from "lucide-react";

interface Discount {
  _id?: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string;
  createdAt: string;
}

interface Promo {
  _id?: string;
  title: string;
  description: string;
  discountCode: string;
  bannerText: string;
  active: boolean;
  startsAt: string;
  endsAt: string;
}

export default function PromotionsPage() {
  const { token } = useAdmin();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [activeSection, setActiveSection] = useState<"discounts" | "promos">("discounts");
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const emptyDiscount: Discount = { code: "", type: "percentage", value: 10, minOrder: 0, maxUses: -1, usedCount: 0, active: true, expiresAt: "", createdAt: "" };
  const emptyPromo: Promo = { title: "", description: "", discountCode: "", bannerText: "", active: true, startsAt: "", endsAt: "" };

  useEffect(() => {
    if (!token) return;
    fetch(`/api/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        setDiscounts(d.discounts || []);
        setPromos(d.promos || []);
      })
      .catch(() => {});
  }, [token]);

  const saveSettings = async (newDiscounts: Discount[], newPromos: Promo[]) => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ discounts: newDiscounts, promos: newPromos }),
      });
      if (!res.ok) throw new Error("Failed");
      setToast({ type: "success", msg: "Saved!" });
    } catch {
      setToast({ type: "error", msg: "Failed to save" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleSaveDiscount = async (discount: Discount) => {
    let updated: Discount[];
    if (editingDiscount?._id) {
      updated = discounts.map((d) => (d._id === editingDiscount._id ? discount : d));
    } else {
      updated = [...discounts, discount];
    }
    setDiscounts(updated);
    setShowDiscountForm(false);
    setEditingDiscount(null);
    await saveSettings(updated, promos);
  };

  const handleDeleteDiscount = async (code: string) => {
    const updated = discounts.filter((d) => d.code !== code);
    setDiscounts(updated);
    await saveSettings(updated, promos);
  };

  const handleSavePromo = async (promo: Promo) => {
    let updated: Promo[];
    if (editingPromo?.title) {
      updated = promos.map((p) => (p.title === editingPromo.title ? promo : p));
    } else {
      updated = [...promos, promo];
    }
    setPromos(updated);
    setShowPromoForm(false);
    setEditingPromo(null);
    await saveSettings(discounts, updated);
  };

  const handleDeletePromo = async (title: string) => {
    const updated = promos.filter((p) => p.title !== title);
    setPromos(updated);
    await saveSettings(discounts, updated);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#995F2F]/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-[#995F2F]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#622B14]" style={{ fontFamily: "var(--font-display)" }}>PROMOTIONS</h1>
            <p className="text-sm text-[#978F66]" style={{ fontFamily: "var(--font-body)" }}>Manage discounts & promos</p>
          </div>
        </div>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center gap-2 p-4 rounded-lg text-sm font-medium ${toast.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`} style={{ fontFamily: "var(--font-body)" }}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.msg}
        </motion.div>
      )}

      <div className="flex gap-2 border-b border-[#D4CBA8] pb-3">
        <button onClick={() => setActiveSection("discounts")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[0.7rem] font-bold tracking-[0.08em] uppercase transition-all min-h-[44px] ${activeSection === "discounts" ? "bg-[#622B14] text-[#E4D6A9]" : "bg-white text-[#978F66] hover:text-[#622B14]"}`} style={{ fontFamily: "var(--font-body)" }}>
          <Percent size={14} />
          Discount Codes
        </button>
        <button onClick={() => setActiveSection("promos")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[0.7rem] font-bold tracking-[0.08em] uppercase transition-all min-h-[44px] ${activeSection === "promos" ? "bg-[#622B14] text-[#E4D6A9]" : "bg-white text-[#978F66] hover:text-[#622B14]"}`} style={{ fontFamily: "var(--font-body)" }}>
          <PercentCircle size={14} />
          Promotions
        </button>
      </div>

      {/* Discount Codes */}
      {activeSection === "discounts" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditingDiscount(null); setShowDiscountForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#622B14] text-[#E4D6A9] rounded-lg text-sm font-medium hover:bg-[#622B14] transition-all min-h-[44px]" style={{ fontFamily: "var(--font-body)" }}>
              <Plus size={14} />
              Add Discount
            </button>
          </div>

          {discounts.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm">
              <Percent size={40} className="mx-auto text-[#D4CBA8] mb-4" />
              <p className="text-sm text-[#978F66]" style={{ fontFamily: "var(--font-body)" }}>No discount codes yet. Create one!</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  <thead className="bg-[#E4D6A9]/40">
                    <tr>
                      <th className="text-left px-5 py-3 text-[0.65rem] font-bold tracking-wider uppercase text-[#978F66]">Code</th>
                      <th className="text-left px-5 py-3 text-[0.65rem] font-bold tracking-wider uppercase text-[#978F66]">Type</th>
                      <th className="text-left px-5 py-3 text-[0.65rem] font-bold tracking-wider uppercase text-[#978F66]">Value</th>
                      <th className="text-left px-5 py-3 text-[0.65rem] font-bold tracking-wider uppercase text-[#978F66]">Min Order</th>
                      <th className="text-left px-5 py-3 text-[0.65rem] font-bold tracking-wider uppercase text-[#978F66]">Uses</th>
                      <th className="text-left px-5 py-3 text-[0.65rem] font-bold tracking-wider uppercase text-[#978F66]">Expires</th>
                      <th className="text-left px-5 py-3 text-[0.65rem] font-bold tracking-wider uppercase text-[#978F66]">Status</th>
                      <th className="text-right px-5 py-3 text-[0.65rem] font-bold tracking-wider uppercase text-[#978F66]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4CBA8]">
                    {discounts.map((d, i) => (
                      <tr key={i} className="hover:bg-[#E4D6A9]/20 transition-colors">
                        <td className="px-5 py-3 font-bold text-[#622B14]">{d.code}</td>
                        <td className="px-5 py-3 text-[#978F66] flex items-center gap-1"><DollarSign size={12} /> {d.type}</td>
                        <td className="px-5 py-3 font-medium text-[#622B14]">{d.type === "percentage" ? `${d.value}%` : `$${d.value}`}</td>
                        <td className="px-5 py-3 text-[#978F66]">{d.minOrder > 0 ? `$${d.minOrder}` : "None"}</td>
                        <td className="px-5 py-3 text-[#978F66]">{d.maxUses === -1 ? "Unlimited" : `${d.usedCount}/${d.maxUses}`}</td>
                        <td className="px-5 py-3 text-[#978F66]">{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : "Never"}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 text-[0.6rem] font-bold uppercase rounded ${d.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {d.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => { setEditingDiscount(d); setShowDiscountForm(true); }} className="p-2 hover:bg-[#E4D6A9]/40 rounded transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"><Edit size={14} className="text-[#978F66]" /></button>
                            <button onClick={() => handleDeleteDiscount(d.code)} className="p-2 hover:bg-red-50 rounded transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"><Trash2 size={14} className="text-red-400" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showDiscountForm && (
            <DiscountForm discount={editingDiscount || emptyDiscount} onSave={handleSaveDiscount} onClose={() => { setShowDiscountForm(false); setEditingDiscount(null); }} />
          )}
        </motion.div>
      )}

      {/* Promotions */}
      {activeSection === "promos" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditingPromo(null); setShowPromoForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#622B14] text-[#E4D6A9] rounded-lg text-sm font-medium hover:bg-[#622B14] transition-all min-h-[44px]" style={{ fontFamily: "var(--font-body)" }}>
              <Plus size={14} />
              Add Promotion
            </button>
          </div>

          {promos.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm">
              <PercentCircle size={40} className="mx-auto text-[#D4CBA8] mb-4" />
              <p className="text-sm text-[#978F66]" style={{ fontFamily: "var(--font-body)" }}>No promotions yet. Create one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {promos.map((p, i) => (
                <div key={i} className="bg-white rounded-lg p-5 shadow-sm border border-[#D4CBA8] flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-[#622B14] truncate" style={{ fontFamily: "var(--font-body)" }}>{p.title}</h3>
                      <span className={`px-2 py-0.5 text-[0.55rem] font-bold uppercase rounded ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {p.description && <p className="text-xs text-[#978F66] truncate" style={{ fontFamily: "var(--font-body)" }}>{p.description}</p>}
                    {p.bannerText && <p className="text-xs text-[#995F2F] mt-1 italic" style={{ fontFamily: "var(--font-body)" }}>&quot;{p.bannerText}&quot;</p>}
                    {p.discountCode && <p className="text-xs text-[#978F66] mt-1" style={{ fontFamily: "var(--font-body)" }}>Code: <span className="font-bold">{p.discountCode}</span></p>}
                    <div className="flex gap-3 mt-1">
                      {p.startsAt && <span className="text-[0.6rem] text-[#978F66]" style={{ fontFamily: "var(--font-body)" }}>From {new Date(p.startsAt).toLocaleDateString()}</span>}
                      {p.endsAt && <span className="text-[0.6rem] text-[#978F66]" style={{ fontFamily: "var(--font-body)" }}>Until {new Date(p.endsAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingPromo(p); setShowPromoForm(true); }} className="p-2 hover:bg-[#E4D6A9]/40 rounded transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"><Edit size={14} className="text-[#978F66]" /></button>
                    <button onClick={() => handleDeletePromo(p.title)} className="p-2 hover:bg-red-50 rounded transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"><Trash2 size={14} className="text-red-400" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showPromoForm && (
            <PromoForm promo={editingPromo || emptyPromo} onSave={handleSavePromo} onClose={() => { setShowPromoForm(false); setEditingPromo(null); }} />
          )}
        </motion.div>
      )}
    </div>
  );
}

function DiscountForm({ discount, onSave, onClose }: { discount: Discount; onSave: (d: Discount) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...discount });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>{discount._id ? "EDIT" : "NEW"} DISCOUNT</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#E4D6A9]/40 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Code</label>
            <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px] uppercase" style={{ fontFamily: "var(--font-body)" }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Value</label>
              <input type="number" min="0" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Min Order ($)</label>
              <input type="number" min="0" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
            </div>
            <div>
              <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Max Uses (-1=unlimited)</label>
              <input type="number" min="-1" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: parseInt(e.target.value) || -1 })} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
            </div>
          </div>
          <div>
            <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Expiry Date</label>
            <input type="date" value={form.expiresAt ? form.expiresAt.split("T")[0] : ""} onChange={(e) => setForm({ ...form, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : "" })} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px] px-4 border border-[#D4CBA8] rounded-lg">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-[#995F2F]" />
            <span className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>Active</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={() => onSave(form)} disabled={!form.code || form.value <= 0} className="flex-1 py-3 bg-[#622B14] text-[#E4D6A9] text-[0.7rem] font-bold tracking-[0.12em] uppercase rounded-lg hover:bg-[#622B14] transition-all min-h-[44px] disabled:opacity-40" style={{ fontFamily: "var(--font-body)" }}>
              Save Discount
            </button>
            <button onClick={onClose} className="px-6 py-3 border border-[#D4CBA8] text-[#978F66] text-[0.7rem] font-bold tracking-[0.12em] uppercase rounded-lg hover:border-[#995F2F] transition-all min-h-[44px]" style={{ fontFamily: "var(--font-body)" }}>
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PromoForm({ promo, onSave, onClose }: { promo: Promo; onSave: (p: Promo) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...promo });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>{promo.title ? "EDIT" : "NEW"} PROMOTION</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#E4D6A9]/40 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
          </div>
          <div>
            <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px] resize-none" style={{ fontFamily: "var(--font-body)" }} />
          </div>
          <div>
            <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Banner Text (shown in announcement bar)</label>
            <input type="text" value={form.bannerText} onChange={(e) => setForm({ ...form, bannerText: e.target.value })} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} placeholder="e.g. SUMMER SALE — 20% OFF" />
          </div>
          <div>
            <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Discount Code</label>
            <input type="text" value={form.discountCode} onChange={(e) => setForm({ ...form, discountCode: e.target.value.toUpperCase() })} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px] uppercase" style={{ fontFamily: "var(--font-body)" }} placeholder="Optional" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Start Date</label>
              <input type="date" value={form.startsAt ? form.startsAt.split("T")[0] : ""} onChange={(e) => setForm({ ...form, startsAt: e.target.value ? new Date(e.target.value).toISOString() : "" })} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
            </div>
            <div>
              <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>End Date</label>
              <input type="date" value={form.endsAt ? form.endsAt.split("T")[0] : ""} onChange={(e) => setForm({ ...form, endsAt: e.target.value ? new Date(e.target.value).toISOString() : "" })} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px] px-4 border border-[#D4CBA8] rounded-lg">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-[#995F2F]" />
            <span className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>Active</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={() => onSave(form)} disabled={!form.title} className="flex-1 py-3 bg-[#622B14] text-[#E4D6A9] text-[0.7rem] font-bold tracking-[0.12em] uppercase rounded-lg hover:bg-[#622B14] transition-all min-h-[44px] disabled:opacity-40" style={{ fontFamily: "var(--font-body)" }}>
              Save Promotion
            </button>
            <button onClick={onClose} className="px-6 py-3 border border-[#D4CBA8] text-[#978F66] text-[0.7rem] font-bold tracking-[0.12em] uppercase rounded-lg hover:border-[#995F2F] transition-all min-h-[44px]" style={{ fontFamily: "var(--font-body)" }}>
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
