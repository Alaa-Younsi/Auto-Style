import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trackPageView } from "@/lib/pixel";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Landing } from "@/pages/Landing";
import { Shop } from "@/pages/Shop";
import { Product } from "@/pages/Product";
import { Checkout } from "@/pages/Checkout";
import { OrderConfirmation } from "@/pages/OrderConfirmation";
import { NotFound } from "@/pages/NotFound";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminLogin } from "@/pages/admin/Login";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { AdminProducts } from "@/pages/admin/Products";
import { AdminProductForm } from "@/pages/admin/ProductForm";
import { AdminCategories } from "@/pages/admin/Categories";
import { AdminOrders } from "@/pages/admin/Orders";
import { AdminOrderDetail } from "@/pages/admin/OrderDetail";
import { AdminDeliveryPrices } from "@/pages/admin/DeliveryPrices";
import { AdminReviews } from "@/pages/admin/Reviews";
// PHONE PREVIEW — temporary recording rig, delete with the folder it points at
import { PhonePreview } from "@/devtools/phone-preview/PhonePreview";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// The index.html Meta Pixel snippet fires the first PageView on initial load. Since this is
// a client-side-routed SPA, subsequent navigations never reload the page, so without this the
// Pixel would only ever see one PageView per visit. Admin routes are excluded — that's store
// owner/staff traffic, not customer traffic ads should optimize against.
function PixelPageView() {
  const { pathname } = useLocation();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    // Skip the initial mount (base snippet already tracked it) and StrictMode's dev-only
    // double-invoke of this same effect (prevPathname is already set to the current value).
    if (prevPathname.current === pathname) return;
    const isFirstRender = prevPathname.current === null;
    prevPathname.current = pathname;
    if (isFirstRender || pathname.startsWith("/admin")) return;
    trackPageView();
  }, [pathname]);

  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
      // A catalogue doesn't change while the shopper tabs away, and a refetch on every
      // focus burns their mobile data and the store's Supabase egress.
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <LanguageProvider>
        {/* PHONE PREVIEW — temporary recording rig. Delete this wrapper (keeping
            its children), its import, and src/devtools/phone-preview/ to remove.
            It sits OUTSIDE BrowserRouter on purpose: the rig replaces the whole
            app while it is up, and inside the router it would remount on every
            navigation. */}
        <PhonePreview>
        <BrowserRouter>
          <ScrollToTop />
          <PixelPageView />
          <Header />
          <CartDrawer />

          <main>
            <Routes>
              {/* Storefront */}
              <Route path="/" element={<Landing />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<Product />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/:orderNumber" element={<OrderConfirmation />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:id" element={<AdminProductForm />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />
                <Route path="delivery-prices" element={<AdminDeliveryPrices />} />
                <Route path="reviews" element={<AdminReviews />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </BrowserRouter>
        </PhonePreview>{/* PHONE PREVIEW — end of temporary recording rig */}
      </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
