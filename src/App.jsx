import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import Hero from "./components/Hero";
import Products from "./components/Product";
import ProductPage from "./pages/ProductPage";
import Footer from "./components/Footer";
import AdminPage from "./pages/AdminPage";
import AdminOrders from "./pages/AdminOrders";
import AdminLoginPage from "./pages/AdminLoginPage";
import { PRODUCTS as INITIAL_PRODUCTS } from "./data/products";
import {
  signInAdmin,
  signOutAdmin,
  subscribeToAdminAuth,
} from "./services/auth";
import {
  enableAdminNotifications,
  subscribeToForegroundMessages,
} from "./services/notifications";
import { subscribeToOrders } from "./services/orders";
import {
  createProduct,
  editProduct,
  fetchProducts,
  removeProduct,
  seedProductsIfEmpty,
} from "./services/products";

function getRouteFromLocation() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const productMatch = path.match(/^\/product\/([^/]+)$/);

  if (productMatch) {
    return { name: "product", productId: productMatch[1] };
  }

  return { name: "shop" };
}

export default function App() {
  const ORDERS_LAST_SEEN_KEY = "adminOrdersLastSeenAt";
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState("shop");
  const [adminSection, setAdminSection] = useState("products");
  const [products, setProducts] = useState([]);
  const [route, setRoute] = useState(getRouteFromLocation);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  const [isCheckingAdminAuth, setIsCheckingAdminAuth] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [ordersUnreadCount, setOrdersUnreadCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsBusy, setNotificationsBusy] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [notificationToast, setNotificationToast] = useState(null);

  useEffect(() => {
    const handlePopState = () => setRoute(getRouteFromLocation());

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth((user) => {
      setAdminUser(user);
      setIsCheckingAdminAuth(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoadingProducts(true);
        setProductsError("");

        const liveProducts = await fetchProducts();
        const finalProducts =
          liveProducts.length > 0
            ? liveProducts
            : await seedProductsIfEmpty(INITIAL_PRODUCTS);

        if (isMounted) {
          setProducts(finalProducts);
        }
      } catch (error) {
        console.error("Failed to load products from Firestore:", error);

        if (isMounted) {
          setProducts(INITIAL_PRODUCTS.map((product) => ({
            ...product,
            id: String(product.id),
          })));
          setProductsError("Unable to reach Firebase. Showing local products for now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((orders) => {
      const lastSeenAt = Number(localStorage.getItem(ORDERS_LAST_SEEN_KEY) || 0);

      const unreadOrders = orders.filter((order) => {
        if (!order.createdAt || typeof order.createdAt.toDate !== "function") {
          return false;
        }

        return order.createdAt.toDate().getTime() > lastSeenAt;
      });

      setOrdersUnreadCount(unreadOrders.length);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToForegroundMessages((payload) => {
      setNotificationToast({
        title: payload.notification?.title || "طلب جديد",
        body: payload.notification?.body || "تمت إضافة طلب جديد.",
      });

      window.clearTimeout(subscribeToForegroundMessages.toastTimeoutId);
      subscribeToForegroundMessages.toastTimeoutId = window.setTimeout(() => {
        setNotificationToast(null);
      }, 4000);
    });

    return unsubscribe;
  }, []);

  const navigateTo = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
      setRoute(getRouteFromLocation());
    }
  };

  const selectedProduct = useMemo(() => {
    if (route.name !== "product") return null;

    return products.find(
      (product) => String(product.id) === String(route.productId)
    );
  }, [products, route]);

  const addToCart = (product, qty) => {
    setCart((prev) => {
      const exists = prev.find(
        (item) => String(item.id) === String(product.id)
      );
      if (exists) {
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }

      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );
  };

  const updateQty = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, qty } : item
      )
    );
  };

  const openProductPage = (product) => {
    navigateTo(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToShop = () => {
    navigateTo("/");
  };

  const handleCreateProduct = async (product) => {
    const savedProduct = await createProduct(product);
    setProducts((prev) => [...prev, savedProduct]);
    return savedProduct;
  };

  const handleUpdateProduct = async (id, product) => {
    const savedProduct = await editProduct(id, product);
    setProducts((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? savedProduct : item))
    );
    return savedProduct;
  };

  const handleDeleteProduct = async (id) => {
    await removeProduct(id);
    setProducts((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const handleAdminLogin = async (email, password) => {
    await signInAdmin(email, password);
  };

  const handleAdminLogout = async () => {
    try {
      setIsSigningOut(true);
      await signOutAdmin();
      setPage("shop");
      setAdminSection("products");
      setNotificationsEnabled(false);
      backToShop();
    } finally {
      setIsSigningOut(false);
    }
  };

  const markOrdersAsSeen = () => {
    localStorage.setItem(ORDERS_LAST_SEEN_KEY, String(Date.now()));
    setOrdersUnreadCount(0);
  };

  const handleEnableNotifications = async () => {
    try {
      setNotificationsBusy(true);
      setNotificationsError("");
      await enableAdminNotifications(adminUser);
      setNotificationsEnabled(true);
      setNotificationToast({
        title: "الإشعارات مفعلة",
        body: "سيصلك تنبيه عند وصول طلب جديد.",
      });
    } catch (error) {
      console.error("Failed to enable notifications:", error);
      setNotificationsError(
        error.message === "Missing VITE_FIREBASE_VAPID_KEY."
          ? "أضف VITE_FIREBASE_VAPID_KEY في ملف البيئة أولًا."
          : "تعذر تفعيل إشعارات المتصفح."
      );
    } finally {
      setNotificationsBusy(false);
    }
  };

  if (page === "admin") {
    if (isCheckingAdminAuth) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
          <p className="text-gray-300">Checking admin session...</p>
        </div>
      );
    }

    if (!adminUser) {
      return (
        <AdminLoginPage
          onLogin={handleAdminLogin}
          onBack={() => {
            setPage("shop");
            backToShop();
          }}
          isCheckingAuth={isCheckingAdminAuth}
        />
      );
    }

    return (
      <div>
        <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                Admin
              </p>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Store Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-gray-100 p-1">
              <button
                onClick={handleEnableNotifications}
                disabled={notificationsBusy || notificationsEnabled}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  notificationsEnabled
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-500 hover:bg-white hover:text-gray-900"
                } disabled:opacity-60`}
              >
                {notificationsEnabled
                  ? "Notifications On"
                  : notificationsBusy
                  ? "Enabling..."
                  : "Enable Notifications"}
              </button>
              <button
                onClick={() => setAdminSection("products")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  adminSection === "products"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => {
                  setAdminSection("orders");
                  markOrdersAsSeen();
                }}
                className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  adminSection === "orders"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Orders
                {ordersUnreadCount > 0 && (
                  <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {ordersUnreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {notificationsError && (
          <div className="mx-auto mt-4 max-w-6xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {notificationsError}
          </div>
        )}

        <div className="fixed bottom-6 right-6 z-50 flex gap-3">
          <button
            onClick={handleAdminLogout}
            disabled={isSigningOut}
            className="bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-full shadow-xl text-sm font-bold hover:bg-gray-50 active:scale-95 transition-all duration-150 disabled:opacity-60"
          >
            {isSigningOut ? "Signing Out..." : "Logout"}
          </button>
          <button
            onClick={() => setPage("shop")}
            className="bg-black text-white px-5 py-3 rounded-full shadow-xl text-sm font-bold hover:bg-gray-800 active:scale-95 transition-all duration-150"
          >
            Back to Shop
          </button>
        </div>

        {adminSection === "products" ? (
          <AdminPage
            products={products}
            isLoading={isLoadingProducts}
            error={productsError}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        ) : (
          <AdminOrders onSeen={markOrdersAsSeen} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        cart={cart}
        removeFromCart={removeFromCart}
        updateQty={updateQty}
      />

      {productsError && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-sm text-amber-800 text-center">
          {productsError}
        </div>
      )}

      {route.name === "product" && isLoadingProducts ? (
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-500">Loading product...</p>
        </div>
      ) : route.name === "product" && selectedProduct ? (
        <ProductPage
          product={selectedProduct}
          onBack={backToShop}
          addToCart={addToCart}
          inCart={cart.some(
            (item) => String(item.id) === String(selectedProduct.id)
          )}
        />
      ) : route.name === "product" ? (
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-3">
            Product Not Found
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
            This product is no longer available.
          </h2>
          <p className="text-gray-500 mb-8">
            The item may have been removed or the link is incorrect.
          </p>
          <button
            onClick={backToShop}
            className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      ) : (
        <>
          <CategoryBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {activeCategory === "All" && <Hero />}

          <Products
            cart={cart}
            onProductClick={openProductPage}
            activeCategory={activeCategory}
            products={products}
            isLoading={isLoadingProducts}
          />

          <Footer />
        </>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            backToShop();
            setPage("admin");
          }}
          className="relative bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-full shadow-lg text-xs font-bold hover:bg-gray-50 active:scale-95 transition-all duration-150"
        >
          Admin
          {ordersUnreadCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {ordersUnreadCount}
            </span>
          )}
        </button>
      </div>

      {notificationToast && (
        <div className="fixed left-6 top-6 z-[60] w-full max-w-sm rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-2xl">
          <p className="text-sm font-bold text-gray-900">
            {notificationToast.title}
          </p>
          <p className="mt-1 text-sm text-gray-600">{notificationToast.body}</p>
        </div>
      )}
    </div>
  );
}
