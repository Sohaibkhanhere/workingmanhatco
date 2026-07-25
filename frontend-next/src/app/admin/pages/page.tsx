"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/lib/admin-context";
import {
  FileText,
  Edit,
  Save,
  Home,
  ShoppingBag,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

interface PageSection {
  id: string;
  label: string;
  icon: React.ElementType;
  fields: PageField[];
}

interface PageField {
  key: string;
  label: string;
  type: "text" | "textarea";
  value: string;
}

interface PagesConfig {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    brandStory: string;
  };
  about: {
    founderName: string;
    founderBio: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    faqItems: string;
  };
  shop: {
    bannerText: string;
  };
}

const DEFAULT_PAGES: PagesConfig = {
  home: {
    heroTitle: "Handcrafted for the Bold",
    heroSubtitle: "Premium hats and headwear made with intention.",
    brandStory:
      "Workinman Hat Co. was born from a desire to bring authentic craftsmanship back to everyday accessories. Each piece is designed with purpose and built to last.",
  },
  about: {
    founderName: "The Workinman",
    founderBio:
      "Started in a small garage with a single sewing machine and a vision. What began as a passion project quickly grew into a movement — celebrating the beauty of handcrafted goods and the stories behind them.",
  },
  contact: {
    email: "hello@workinmanhatco.com",
    phone: "",
    address: "",
    faqItems:
      "Q: How long does shipping take?\nA: Standard shipping takes 3-5 business days.\n\nQ: Do you offer returns?\nA: Yes, within 30 days of purchase.\n\nQ: Are your hats handmade?\nA: Yes, every piece is crafted with care.",
  },
  shop: {
    bannerText: "Free shipping on orders over $75",
  },
};

const STORAGE_KEY = "workinman_page_content";

const PAGE_SECTIONS: PageSection[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "text", value: "" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "text", value: "" },
      { key: "brandStory", label: "Brand Story", type: "textarea", value: "" },
    ],
  },
  {
    id: "about",
    label: "About",
    icon: User,
    fields: [
      { key: "founderName", label: "Founder Name", type: "text", value: "" },
      { key: "founderBio", label: "Founder Bio", type: "textarea", value: "" },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    icon: MessageSquare,
    fields: [
      { key: "email", label: "Email Address", type: "text", value: "" },
      { key: "phone", label: "Phone Number", type: "text", value: "" },
      { key: "address", label: "Address", type: "text", value: "" },
      { key: "faqItems", label: "FAQ Items", type: "textarea", value: "" },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    icon: ShoppingBag,
    fields: [
      { key: "bannerText", label: "Banner Text", type: "text", value: "" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function PagesManagementPage() {
  const { token } = useAdmin();
  const [pages, setPages] = useState<PagesConfig>(DEFAULT_PAGES);
  const [activePage, setActivePage] = useState<string>("home");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      // Try fetching from API first
      if (token) {
        try {
          const res = await fetch(`/api/pages`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data === "object") {
              setPages({ ...DEFAULT_PAGES, ...data });
              return;
            }
          }
        } catch {
          // Fall back to localStorage
        }
      }

      // localStorage fallback
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPages({ ...DEFAULT_PAGES, ...parsed });
        }
      } catch {
        // Use defaults
      }
    };
    loadContent();
  }, [token]);

  const getFieldValues = (pageId: string): PageField[] => {
    const pageData = pages[pageId as keyof PagesConfig];
    if (!pageData) return [];
    return PAGE_SECTIONS.find((s) => s.id === pageId)?.fields.map((field) => ({
      ...field,
      value: (pageData as Record<string, string>)[field.key] ?? "",
    })) ?? [];
  };

  const handleFieldChange = (pageId: string, fieldKey: string, value: string) => {
    setPages((prev) => ({
      ...prev,
      [pageId]: {
        ...prev[pageId as keyof PagesConfig],
        [fieldKey]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setToast(null);

    // Save to localStorage always
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    } catch {
      // ignore
    }

    // Try API save
    if (token) {
      try {
        const res = await fetch(`/api/pages`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pages),
        });
        if (!res.ok) throw new Error("API save failed");
        setToast({ type: "success", message: "Page content saved successfully!" });
      } catch {
        setToast({
          type: "success",
          message: "Saved locally. Connect to Supabase for server persistence.",
        });
      }
    } else {
      setToast({ type: "success", message: "Saved locally. Connect to Supabase for server persistence." });
    }

    setHasChanges(false);
    setTimeout(() => setToast(null), 4000);
  };

  const activeSection = PAGE_SECTIONS.find((s) => s.id === activePage);
  const fields = getFieldValues(activePage);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-brand"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PAGES
            </h1>
            <p className="text-sm text-warm-gray" style={{ fontFamily: "var(--font-body)" }}>
              Edit your page content and sections
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            fontFamily: "var(--font-body)",
            backgroundColor: hasChanges ? "#B8935A" : "#78716C",
          }}
        >
          <Save className="w-4 h-4" />
          Save All
        </button>
      </motion.div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 rounded-lg text-sm font-medium"
          style={{
            fontFamily: "var(--font-body)",
            backgroundColor: toast.type === "success" ? "#DCFCE7" : "#FEE2E2",
            color: toast.type === "success" ? "#166534" : "#991B1B",
            border: `1px solid ${toast.type === "success" ? "#BBF7D0" : "#FECACA"}`,
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
        </motion.div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Tabs */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div
            className="rounded-xl backdrop-blur-md border border-white/20 shadow-lg overflow-hidden"
            style={{ background: "rgba(255, 255, 255, 0.7)" }}
          >
            <div className="p-4">
              <h3
                className="text-xs font-bold uppercase tracking-wider text-warm-gray mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                PAGES
              </h3>
              <div className="space-y-1">
                {PAGE_SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isActive = activePage === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActivePage(section.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px] text-left"
                      style={{
                        fontFamily: "var(--font-body)",
                        backgroundColor: isActive ? "#0F172A" : "transparent",
                        color: isActive ? "#FAFAF8" : "#78716C",
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl backdrop-blur-md border border-white/20 shadow-lg overflow-hidden"
              style={{ background: "rgba(255, 255, 255, 0.7)" }}
            >
              <div
                className="p-5 border-b flex items-center gap-3"
                style={{ borderColor: "rgba(120, 113, 108, 0.15)" }}
              >
                {activeSection && (
                  <>
                    <Edit className="w-4 h-4 text-gold" />
                    <h2
                      className="text-sm font-bold uppercase tracking-wider text-brand"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      EDIT {activeSection.label.toUpperCase()}
                    </h2>
                  </>
                )}
              </div>
              <div className="p-5 space-y-5">
                {fields.map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={`${activePage}-${field.key}`}
                      className="block text-sm font-medium text-brand mb-1.5"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={`${activePage}-${field.key}`}
                        value={field.value}
                        onChange={(e) => handleFieldChange(activePage, field.key, e.target.value)}
                        rows={field.key === "faqItems" ? 8 : 5}
                        className="w-full px-4 py-3 rounded-lg border border-warm-gray-lighter bg-white text-sm text-brand placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold min-h-[44px] resize-none"
                        style={{ fontFamily: field.key === "faqItems" ? "monospace" : "var(--font-body)" }}
                      />
                    ) : (
                      <input
                        id={`${activePage}-${field.key}`}
                        type="text"
                        value={field.value}
                        onChange={(e) => handleFieldChange(activePage, field.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-warm-gray-lighter bg-white text-sm text-brand placeholder:text-warm-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold min-h-[44px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Note */}
      <motion.div
        variants={itemVariants}
        className="flex items-start gap-3 p-4 rounded-lg border border-gold/20 bg-gold/5"
      >
        <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
        <p className="text-sm text-warm-gray" style={{ fontFamily: "var(--font-body)" }}>
          Content persists via Supabase when connected. Currently using localStorage for demo mode.
        </p>
      </motion.div>
    </motion.div>
  );
}
