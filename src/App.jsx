import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import Hero from "./components/Hero";
import Products from "./components/Product";
import ProductPage from "./pages/ProductPage";
import Footer from "./components/Footer";
import AdminPage from "./pages/AdminPage";
import { PRODUCTS as INITIAL_PRODUCTS } from "./data/products";

function getRouteFromLocation() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const productMatch = path.match(/^\/product\/([^/]+)$/);

  if (productMatch) {
    return { name: "product", productId: productMatch[1] };
  }

  return { name: "shop" };
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState("shop");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [route, setRoute] = useState(getRouteFromLocation);

  useEffect(() => {
    const handlePopState = () => setRoute(getRouteFromLocation());

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
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
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }

      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  const openProductPage = (product) => {
    navigateTo(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToShop = () => {
    navigateTo("/");
  };

  if (page === "admin") {
    return (
      <div>
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setPage("shop")}
            className="bg-black text-white px-5 py-3 rounded-full shadow-xl text-sm font-bold hover:bg-gray-800 active:scale-95 transition-all duration-150"
          >
            Back to Shop
          </button>
        </div>

        <AdminPage products={products} setProducts={setProducts} />
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

      {route.name === "product" && selectedProduct ? (
        <ProductPage
          product={selectedProduct}
          onBack={backToShop}
          addToCart={addToCart}
          inCart={cart.some((item) => item.id === selectedProduct.id)}
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
          className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-full shadow-lg text-xs font-bold hover:bg-gray-50 active:scale-95 transition-all duration-150"
        >
          Admin
        </button>
      </div>
    </div>
  );
}
