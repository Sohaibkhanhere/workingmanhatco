"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/lib/admin-context";
import { Settings, Save, CheckCircle, AlertCircle, Globe, Link2, ExternalLink, Truck, Search, FileText } from "lucide-react";

interface StoreSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  contact: { email: string; phone: string; address: string };
  tax: { rate: number; enabled: boolean; label: string };
  shipping: { freeThreshold: number; flatRate: number; enabled: boolean };
  social: { instagram: string; facebook: string; tiktok: string; youtube: string; twitter: string };
  seo: { metaTitle: string; metaDescription: string; keywords: string; geoPosition: string };
  policies: { shipping: string; returns: string; privacy: string; terms: string };
}

const DEFAULTS: StoreSettings = {
  siteName: "Workin' Man Hat Co.",
  tagline: "For your every day workin'man",
  logo: "",
  favicon: "",
  contact: { email: "workinmanhatco@gmail.com", phone: "", address: "Texas, USA" },
  tax: { rate: 8.25, enabled: true, label: "Sales Tax" },
  shipping: { freeThreshold: 75, flatRate: 8.99, enabled: true },
  social: { instagram: "", facebook: "", tiktok: "", youtube: "", twitter: "" },
  seo: { metaTitle: "", metaDescription: "", keywords: "", geoPosition: "31.0;-100.0" },
  policies: { shipping: "", returns: "", privacy: "", terms: "" },
};

const tabs = [
  { id: "store", label: "Store Info", icon: Settings },
  { id: "shipping", label: "Shipping & Tax", icon: Truck },
  { id: "social", label: "Social Links", icon: Globe },
  { id: "seo", label: "SEO", icon: Search },
  { id: "policies", label: "Policies", icon: FileText },
] as const;

type Tab = (typeof tabs)[number]["id"];

export default function SettingsPage() {
  const { token } = useAdmin();
  const [settings, setSettings] = useState<StoreSettings>(DEFAULTS);
  const [activeTab, setActiveTab] = useState<Tab>("store");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`/api/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setSettings({
          siteName: d.siteName || DEFAULTS.siteName,
          tagline: d.tagline || DEFAULTS.tagline,
          logo: d.logo || "",
          favicon: d.favicon || "",
          contact: { email: d.contact?.email || "", phone: d.contact?.phone || "", address: d.contact?.address || "" },
          tax: { rate: d.tax?.rate ?? 8.25, enabled: d.tax?.enabled ?? true, label: d.tax?.label || "Sales Tax" },
          shipping: { freeThreshold: d.shipping?.freeThreshold ?? 75, flatRate: d.shipping?.flatRate ?? 8.99, enabled: d.shipping?.enabled ?? true },
          social: { instagram: d.social?.instagram || "", facebook: d.social?.facebook || "", tiktok: d.social?.tiktok || "", youtube: d.social?.youtube || "", twitter: d.social?.twitter || "" },
          seo: { metaTitle: d.seo?.metaTitle || "", metaDescription: d.seo?.metaDescription || "", keywords: d.seo?.keywords || "", geoPosition: d.seo?.geoPosition || "31.0;-100.0" },
          policies: { shipping: d.policies?.shipping || "", returns: d.policies?.returns || "", privacy: d.policies?.privacy || "", terms: d.policies?.terms || "" },
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const update = (path: string, value: any) => {
    setSettings((prev) => {
      const keys = path.split(".");
      const next = { ...prev } as any;
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj[keys[i]] = { ...obj[keys[i]] };
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed");
      setToast({ type: "success", msg: "Settings saved!" });
    } catch {
      setToast({ type: "error", msg: "Failed to save settings" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#995F2F]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#995F2F]/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#995F2F]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#622B14]" style={{ fontFamily: "var(--font-display)" }}>STORE SETTINGS</h1>
            <p className="text-sm text-[#978F66]" style={{ fontFamily: "var(--font-body)" }}>Configure your store</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-[#622B14] text-[#E4D6A9] rounded-lg text-sm font-medium hover:bg-[#622B14] transition-all min-h-[44px] disabled:opacity-40" style={{ fontFamily: "var(--font-body)" }}>
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center gap-2 p-4 rounded-lg text-sm font-medium ${toast.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`} style={{ fontFamily: "var(--font-body)" }}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-[#D4CBA8] pb-3">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[0.7rem] font-bold tracking-[0.08em] uppercase transition-all min-h-[44px] ${activeTab === tab.id ? "bg-[#622B14] text-[#E4D6A9]" : "bg-white text-[#978F66] hover:text-[#622B14]"}`} style={{ fontFamily: "var(--font-body)" }}>
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Store Info */}
      {activeTab === "store" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg p-8 shadow-sm space-y-5">
          <h2 className="text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>STORE INFORMATION</h2>
          {[
            { label: "Store Name", key: "siteName", type: "text" },
            { label: "Tagline", key: "tagline", type: "text" },
            { label: "Logo URL", key: "logo", type: "text" },
            { label: "Favicon URL", key: "favicon", type: "text" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>{field.label}</label>
              <input type={field.type} value={(settings as any)[field.key] || ""} onChange={(e) => update(field.key, e.target.value)} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px] transition-colors" style={{ fontFamily: "var(--font-body)" }} />
            </div>
          ))}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Contact Email", key: "contact.email", type: "email" },
              { label: "Phone", key: "contact.phone", type: "tel" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>{field.label}</label>
                <input type={field.type} value={field.key.split(".").reduce((o: any, k) => o?.[k], settings) || ""} onChange={(e) => update(field.key, e.target.value)} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px] transition-colors" style={{ fontFamily: "var(--font-body)" }} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Address</label>
            <input type="text" value={settings.contact.address} onChange={(e) => update("contact.address", e.target.value)} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px] transition-colors" style={{ fontFamily: "var(--font-body)" }} />
          </div>
        </motion.div>
      )}

      {/* Shipping & Tax */}
      {activeTab === "shipping" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg p-8 shadow-sm space-y-5">
          <h2 className="text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>SHIPPING & TAX</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Free Shipping Threshold ($)</label>
              <input type="number" min="0" step="0.01" value={settings.shipping.freeThreshold} onChange={(e) => update("shipping.freeThreshold", parseFloat(e.target.value) || 0)} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
              <p className="text-xs text-[#978F66] mt-1" style={{ fontFamily: "var(--font-body)" }}>Orders above this get free shipping</p>
            </div>
            <div>
              <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Flat Rate Shipping ($)</label>
              <input type="number" min="0" step="0.01" value={settings.shipping.flatRate} onChange={(e) => update("shipping.flatRate", parseFloat(e.target.value) || 0)} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
            </div>
          </div>
          <div className="border-t border-[#D4CBA8] pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Tax Rate (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={settings.tax.rate} onChange={(e) => update("tax.rate", parseFloat(e.target.value) || 0)} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
              </div>
              <div>
                <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Tax Label</label>
                <input type="text" value={settings.tax.label} onChange={(e) => update("tax.label", e.target.value)} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px] px-4 border border-[#D4CBA8] rounded-lg">
                  <input type="checkbox" checked={settings.tax.enabled} onChange={(e) => update("tax.enabled", e.target.checked)} className="w-4 h-4 accent-[#995F2F]" />
                  <span className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>Tax Enabled</span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Social Links */}
      {activeTab === "social" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg p-8 shadow-sm space-y-5">
          <h2 className="text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>SOCIAL LINKS</h2>
          {[
            { label: "Instagram", key: "social.instagram", icon: Globe },
            { label: "Facebook", key: "social.facebook", icon: Link2 },
            { label: "TikTok", key: "social.tiktok", icon: ExternalLink },
            { label: "YouTube", key: "social.youtube", icon: Globe },
            { label: "Twitter", key: "social.twitter", icon: Link2 },
          ].map((field) => (
            <div key={field.key}>
              <label className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>
                <field.icon size={13} />
                {field.label}
              </label>
              <input type="url" placeholder={`https://${field.label.toLowerCase()}.com/...`} value={field.key.split(".").reduce((o: any, k) => o?.[k], settings) || ""} onChange={(e) => update(field.key, e.target.value)} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px] transition-colors" style={{ fontFamily: "var(--font-body)" }} />
            </div>
          ))}
        </motion.div>
      )}

      {/* SEO */}
      {activeTab === "seo" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg p-8 shadow-sm space-y-5">
          <h2 className="text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>SEO SETTINGS</h2>
          <div>
            <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Meta Title</label>
            <input type="text" value={settings.seo.metaTitle} onChange={(e) => update("seo.metaTitle", e.target.value)} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
          </div>
          <div>
            <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Meta Description</label>
            <textarea value={settings.seo.metaDescription} onChange={(e) => update("seo.metaDescription", e.target.value)} rows={3} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px] resize-none" style={{ fontFamily: "var(--font-body)" }} />
          </div>
          <div>
            <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Keywords</label>
            <input type="text" value={settings.seo.keywords} onChange={(e) => update("seo.keywords", e.target.value)} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} placeholder="comma separated" />
          </div>
          <div>
            <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>Geo Position (lat;lon)</label>
            <input type="text" value={settings.seo.geoPosition} onChange={(e) => update("seo.geoPosition", e.target.value)} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px]" style={{ fontFamily: "var(--font-body)" }} />
          </div>
        </motion.div>
      )}

      {/* Policies */}
      {activeTab === "policies" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg p-8 shadow-sm space-y-5">
          <h2 className="text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>STORE POLICIES</h2>
          {[
            { label: "Shipping Policy", key: "policies.shipping" },
            { label: "Returns Policy", key: "policies.returns" },
            { label: "Privacy Policy", key: "policies.privacy" },
            { label: "Terms & Conditions", key: "policies.terms" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[#622B14]/70 mb-2" style={{ fontFamily: "var(--font-body)" }}>{field.label}</label>
              <textarea value={field.key.split(".").reduce((o: any, k) => o?.[k], settings) || ""} onChange={(e) => update(field.key, e.target.value)} rows={3} className="w-full px-4 py-3 border border-[#D4CBA8] rounded-lg text-sm focus:outline-none focus:border-[#995F2F] focus:ring-1 focus:ring-[#995F2F] min-h-[44px] resize-none" style={{ fontFamily: "var(--font-body)" }} />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
