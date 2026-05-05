import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_HERO_SLIDES,
  getHeroSlideCopy,
} from "../data/heroSlides";
import { getProductDisplayName } from "../data/products";

const PLACEHOLDER = "https://placehold.co/120x140/ffffff/cccccc?text=Item";

export default function Hero({
  language = "ar",
  slides = DEFAULT_HERO_SLIDES,
  products = [],
  onProductClick,
}) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const activeSlides = useMemo(() => {
    const visibleSlides = slides.filter((slide) => slide.isActive !== false);
    return visibleSlides.length > 0 ? visibleSlides : DEFAULT_HERO_SLIDES;
  }, [slides]);

  useEffect(() => {
    if (current >= activeSlides.length) {
      setCurrent(0);
    }
  }, [activeSlides.length, current]);

  const goTo = (index) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 300);
  };

  const prev = () =>
    goTo((current - 1 + activeSlides.length) % activeSlides.length);
  const next = () => goTo((current + 1) % activeSlides.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((value) => (value + 1) % activeSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const slide = activeSlides[current] || activeSlides[0];
  const copy = getHeroSlideCopy(slide, language);
  const featuredProducts = (slide.productIds || [])
    .map((id) => products.find((product) => String(product.id) === String(id)))
    .filter(Boolean);
  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  return (
    <div className="flex items-center justify-center px-4 py-3 sm:p-6">
      <div
        className={`relative flex w-full max-w-6xl flex-col items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-r ${slide.bg} px-5 py-5 sm:gap-6 sm:rounded-2xl sm:p-8 md:flex-row`}
        style={{ minHeight: "clamp(150px, 42vw, 220px)" }}
      >
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 pointer-events-none sm:h-64 sm:w-64" />
        <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/10 pointer-events-none sm:h-40 sm:w-40" />

        <div
          className="z-10 flex-1 space-y-2 text-white sm:space-y-4"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.3s" }}
        >
          <p className="text-xs font-medium tracking-widest opacity-80 sm:text-sm">
            {copy.title}
          </p>
          <h1 className="text-xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
            {copy.subtitle}
          </h1>
          <button
            type="button"
            onClick={() => displayProducts[0] && onProductClick?.(displayProducts[0])}
            className="rounded-lg border-2 border-white px-4 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-white hover:text-black active:scale-95 sm:px-6 sm:py-2 sm:text-base"
          >
            {copy.buttonText}
          </button>
        </div>

        <div
          className="z-10 flex flex-1 justify-center gap-2 sm:gap-4"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.3s" }}
        >
          {(displayProducts.length > 0 ? displayProducts : [null, null, null]).map(
            (product, index) => (
              <button
                key={product?.id ?? index}
                type="button"
                onClick={() => product && onProductClick?.(product)}
                className="w-20 cursor-pointer rounded-lg bg-white p-1.5 text-left shadow-lg transition-transform duration-200 hover:scale-105 sm:w-28 sm:rounded-xl sm:p-2"
              >
                <img
                  src={product?.img || PLACEHOLDER}
                  className="aspect-[6/7] w-full rounded-md object-cover sm:rounded-lg"
                  alt={product ? getProductDisplayName(product, language) : "product"}
                />
                <p className="mt-1 truncate text-center text-xs font-bold text-red-500 sm:text-sm">
                  {product ? `SAR ${Number(product.price).toFixed(2)}` : "SAR 0.00"}
                </p>
              </button>
            )
          )}
        </div>

        {[
          { fn: prev, side: "left-3", label: language === "ar" ? "›" : "‹" },
          { fn: next, side: "right-3", label: language === "ar" ? "‹" : "›" },
        ].map(({ fn, side, label }) => (
          <button
            key={side}
            type="button"
            onClick={fn}
            className={`absolute ${side} top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/40 active:scale-95 sm:h-9 sm:w-9`}
          >
            {label}
          </button>
        ))}

        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-4">
          {activeSlides.map((slideItem, index) => (
            <button
              key={slideItem.id ?? index}
              type="button"
              onClick={() => goTo(index)}
              className={`rounded-full transition-all duration-300 ${
                index === current
                  ? "h-2 w-6 bg-white"
                  : "h-2 w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
