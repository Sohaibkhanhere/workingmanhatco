import { ProductsResponse } from "./types";

const API = "";

export async function fetchProducts(
  params: Record<string, string | number> = {}
): Promise<ProductsResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") query.set(k, String(v));
  });
  const res = await fetch(`${API}/api/products?${query}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(slug: string) {
  const res = await fetch(`${API}/api/products/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export const LOGO_URL =
  "https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1754520881053-GITP2B476NHFI441CJ5Y/IMG_3617.jpeg?format=1500w";

export const HERO_BG =
  "https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/f4c02976-3f0a-4d66-975f-c6eee8ed8a36/F16BBA54-AF60-4D50-9739-4A570BD208D5.png";

export const CATEGORY_IMAGES: Record<string, string> = {
  Hats: "https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1782667569729-3KH00YRK70BMIYQ0WX96/C6807D21-9765-4674-9A45-5402349A9011.jpeg",
  Apparel: "https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/6577b43c-4483-4d19-bbd8-e42816dbec0f/IMG_0339.jpeg",
  Accessories: "https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1754520881053-GITP2B476NHFI441CJ5Y/IMG_3617.jpeg?format=800w",
};
