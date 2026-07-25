"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Package,
  Star,
  Upload,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";

interface SizeOption {
  name: string;
  price: number;
  stock: number;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  sku: string;
  featured: boolean;
  images: string[];
  colors: string[];
  sizes: SizeOption[];
  tags: string[];
  stock: number;
}

const emptyProduct: Omit<Product, "_id"> = {
  title: "",
  description: "",
  category: "Hats",
  price: 0,
  sku: "",
  featured: false,
  images: [],
  colors: [],
  sizes: [],
  tags: [],
  stock: 0,
};

export default function AdminProductsPage() {
  const { token } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [sizeNameInput, setSizeNameInput] = useState("");
  const [sizePriceInput, setSizePriceInput] = useState("");
  const [sizeStockInput, setSizeStockInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const headers = useCallback(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`/api/products`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products ?? data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ ...emptyProduct });
    setImageInput("");
    setColorInput("");
    setTagInput("");
    setSizeNameInput("");
    setSizePriceInput("");
    setSizeStockInput("");
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      sku: product.sku,
      featured: product.featured,
      images: [...product.images],
      colors: [...product.colors],
      sizes: product.sizes.map((s) => ({ ...s })),
      tags: [...product.tags],
      stock: product.stock,
    });
    setImageInput("");
    setColorInput("");
    setTagInput("");
    setSizeNameInput("");
    setSizePriceInput("");
    setSizeStockInput("");
    setModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : `/api/products`;
      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchProducts();
        setModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to save product:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      const res = await fetch(`/api/products/${deletingProduct._id}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (res.ok) {
        await fetchProducts();
        setDeleteModalOpen(false);
        setDeletingProduct(null);
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const addImage = () => {
    const trimmed = imageInput.trim();
    if (trimmed && !formData.images.includes(trimmed)) {
      setFormData((p) => ({ ...p, images: [...p.images, trimmed] }));
      setImageInput("");
    }
  };

  const removeImage = (idx: number) => {
    setFormData((p) => ({
      ...p,
      images: p.images.filter((_, i) => i !== idx),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) continue;
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newImages.push(base64);
    }
    setFormData((p) => ({ ...p, images: [...p.images, ...newImages] }));
    setUploading(false);
    e.target.value = "";
  };

  const addColor = () => {
    const trimmed = colorInput.trim();
    if (trimmed && !formData.colors.includes(trimmed)) {
      setFormData((p) => ({ ...p, colors: [...p.colors, trimmed] }));
      setColorInput("");
    }
  };

  const removeColor = (idx: number) => {
    setFormData((p) => ({
      ...p,
      colors: p.colors.filter((_, i) => i !== idx),
    }));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((p) => ({ ...p, tags: [...p.tags, trimmed] }));
      setTagInput("");
    }
  };

  const removeTag = (idx: number) => {
    setFormData((p) => ({
      ...p,
      tags: p.tags.filter((_, i) => i !== idx),
    }));
  };

  const addSize = () => {
    if (sizeNameInput.trim()) {
      setFormData((p) => ({
        ...p,
        sizes: [
          ...p.sizes,
          {
            name: sizeNameInput.trim(),
            price: parseFloat(sizePriceInput) || 0,
            stock: parseInt(sizeStockInput) || 0,
          },
        ],
      }));
      setSizeNameInput("");
      setSizePriceInput("");
      setSizeStockInput("");
    }
  };

  const removeSize = (idx: number) => {
    setFormData((p) => ({
      ...p,
      sizes: p.sizes.filter((_, i) => i !== idx),
    }));
  };

  const inputClass =
    "w-full min-h-[44px] rounded-lg border border-stone-300 bg-white px-4 py-2 font-[var(--font-body)] text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-[#B8935A] focus:ring-2 focus:ring-[#B8935A]/30";

  const labelClass =
    "mb-1 block text-sm font-medium text-stone-700 font-[var(--font-body)]";

  return (
    <div className="min-h-screen bg-[#FAFAF8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="font-[var(--font-display)] text-3xl font-bold text-[#0F172A]">
              Products
            </h1>
            <p className="mt-1 text-sm text-[#78716C]">
              Manage your product catalog
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-[#B8935A] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#a17e48] focus:outline-none focus:ring-2 focus:ring-[#B8935A] focus:ring-offset-2 min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B8935A] border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#78716C]">
              <Package className="mb-3 h-12 w-12 opacity-40" />
              <p className="font-[var(--font-display)] text-lg">
                No products found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wider text-[#78716C]">
                    <th className="px-4 py-3 font-medium">Image</th>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Featured</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((product, i) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-stone-100 transition-colors hover:bg-stone-50/50"
                      >
                        <td className="px-4 py-3">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                              <Package className="h-5 w-5 text-stone-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#0F172A]">
                          {product.title}
                        </td>
                        <td className="px-4 py-3 text-[#78716C]">
                          {product.category}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#0F172A]">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              product.stock > 0
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {product.featured ? (
                            <Star className="h-4 w-4 fill-[#B8935A] text-[#B8935A]" />
                          ) : (
                            <span className="text-stone-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(product)}
                              className="rounded-lg p-2 text-[#78716C] transition-colors hover:bg-stone-100 hover:text-[#0F172A]"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(product)}
                              className="rounded-lg p-2 text-[#78716C] transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[5vh] backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
                <h2 className="font-[var(--font-display)] text-xl font-bold text-[#0F172A]">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-2 text-[#78716C] transition-colors hover:bg-stone-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, title: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="Product title"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      className={`${inputClass} min-h-[100px] py-3`}
                      placeholder="Product description"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className={labelClass}>Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                        className={inputClass}
                      >
                        <option value="Hats">Hats</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Price</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            price: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className={inputClass}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>SKU</label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, sku: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="e.g. HAT-001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Stock (Total)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            stock: parseInt(e.target.value) || 0,
                          }))
                        }
                        className={inputClass}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 px-4 py-2.5 transition-colors hover:bg-stone-50 min-h-[44px]">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              featured: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-stone-300 text-[#B8935A] focus:ring-[#B8935A]"
                        />
                        <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 text-[#B8935A]" />
                          <span className="text-sm font-medium text-stone-700">
                            Featured
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Image URLs</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addImage()}
                        className={`${inputClass} flex-1`}
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        className="min-h-[44px] rounded-lg border border-stone-300 bg-stone-50 px-4 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
                      >
                        Add
                      </button>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.images.map((img, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 pl-3 pr-1.5 py-1 text-xs text-stone-600"
                          >
                            <img
                              src={img}
                              alt=""
                              className="h-5 w-5 rounded-full object-cover"
                            />
                            <button
                              onClick={() => removeImage(i)}
                              className="rounded-full p-0.5 transition-colors hover:bg-stone-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3">
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-4 text-sm font-medium text-stone-600 transition-colors hover:border-[#B8935A] hover:bg-[#B8935A]/5 min-h-[44px]">
                        <Upload className="h-4 w-4" />
                        {uploading ? "Uploading..." : "Upload images from device"}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      <p className="text-[0.65rem] text-stone-400 mt-1">Max 5MB per image. JPG, PNG, WebP.</p>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Colors</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addColor()}
                        className={`${inputClass} flex-1`}
                        placeholder="e.g. Black, White"
                      />
                      <button
                        type="button"
                        onClick={addColor}
                        className="min-h-[44px] rounded-lg border border-stone-300 bg-stone-50 px-4 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
                      >
                        Add
                      </button>
                    </div>
                    {formData.colors.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.colors.map((c, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600"
                          >
                            {c}
                            <button
                              onClick={() => removeColor(i)}
                              className="rounded-full p-0.5 transition-colors hover:bg-stone-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Sizes</label>
                    <div className="flex flex-wrap items-end gap-2">
                      <div className="flex-1 min-w-[120px]">
                        <label className="mb-1 block text-xs text-stone-500">
                          Name
                        </label>
                        <input
                          type="text"
                          value={sizeNameInput}
                          onChange={(e) => setSizeNameInput(e.target.value)}
                          className={`${inputClass} min-h-[38px] text-xs`}
                          placeholder="e.g. S, M, L"
                        />
                      </div>
                      <div className="min-w-[100px]">
                        <label className="mb-1 block text-xs text-stone-500">
                          Price Override
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={sizePriceInput}
                          onChange={(e) => setSizePriceInput(e.target.value)}
                          className={`${inputClass} min-h-[38px] text-xs`}
                          placeholder="0"
                        />
                      </div>
                      <div className="min-w-[80px]">
                        <label className="mb-1 block text-xs text-stone-500">
                          Stock
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={sizeStockInput}
                          onChange={(e) => setSizeStockInput(e.target.value)}
                          className={`${inputClass} min-h-[38px] text-xs`}
                          placeholder="0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addSize}
                        className="min-h-[38px] rounded-lg border border-stone-300 bg-stone-50 px-4 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100"
                      >
                        Add Size
                      </button>
                    </div>
                    {formData.sizes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.sizes.map((s, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#B8935A]/10 pl-3 pr-1.5 py-1 text-xs text-[#a17e48]"
                          >
                            {s.name} — ${s.price.toFixed(2)} ({s.stock})
                            <button
                              onClick={() => removeSize(i)}
                              className="rounded-full p-0.5 transition-colors hover:bg-[#B8935A]/20"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Tags</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTag()}
                        className={`${inputClass} flex-1`}
                        placeholder="e.g. summer, sale"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="min-h-[44px] rounded-lg border border-stone-300 bg-stone-50 px-4 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
                      >
                        Add
                      </button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.tags.map((t, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A]/5 px-3 py-1 text-xs text-[#0F172A]"
                          >
                            #{t}
                            <button
                              onClick={() => removeTag(i)}
                              className="rounded-full p-0.5 transition-colors hover:bg-[#0F172A]/10"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-stone-200 px-6 py-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="min-h-[44px] rounded-lg border border-stone-300 bg-white px-5 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.title.trim()}
                  className="min-h-[44px] rounded-lg bg-[#B8935A] px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#a17e48] focus:outline-none focus:ring-2 focus:ring-[#B8935A] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Create Product"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModalOpen && deletingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-[var(--font-display)] text-lg font-bold text-[#0F172A]">
                Delete Product
              </h3>
              <p className="mt-2 text-sm text-[#78716C]">
                Are you sure you want to delete &ldquo;{deletingProduct.title}
                &rdquo;? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="min-h-[44px] rounded-lg border border-stone-300 bg-white px-5 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="min-h-[44px] rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
