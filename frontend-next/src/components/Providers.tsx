"use client";

import { CartProvider } from "@/lib/cart-context";
import AuthProviderWrapper from "./AuthProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderWrapper>
      <CartProvider>{children}</CartProvider>
    </AuthProviderWrapper>
  );
}
