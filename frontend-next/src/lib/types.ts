export interface ProductSize {
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  images: string[];
  colors: string[];
  sizes: ProductSize[];
  featured: boolean;
  sku: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  images: string[];
  slug: string;
  size: string;
  quantity: number;
}
