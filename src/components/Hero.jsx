import { useEffect, useState } from "react";

const slides = {
  ar: [
    {
      title: "#عروض_الأمهات",
      subtitle: "أكثر القطع طلبًا هذا الأسبوع",
      button: "تسوق الآن",
      bg: "from-pink-500 to-orange-400",
      prices: ["SAR 1.35", "SAR 7.92", "SAR 0.99"],
    },
    {
      title: "#صيف_أنيق",
      subtitle: "وصل جديد كل يوم",
      button: "اكتشف الجديد",
      bg: "from-sky-500 to-indigo-500",
      prices: ["SAR 3.50", "SAR 12.99", "SAR 5.49"],
    },
    {
      title: "#أزياء_مختارة",
      subtitle: "خصومات تصل إلى 80%",
      button: "شاهد العروض",
      bg: "from-emerald-500 to-teal-400",
      prices: ["SAR 2.00", "SAR 8.00", "SAR 1.50"],
    },
  ],
  en: [
    {
      title: "#MothersDay",
      subtitle: "Top picks this week",
      button: "Shop Now",
      bg: "from-pink-500 to-orange-400",
      prices: ["SAR 1.35", "SAR 7.92", "SAR 0.99"],
    },
    {
      title: "#SummerVibes",
      subtitle: "New arrivals every day",
      button: "Explore New In",
      bg: "from-sky-500 to-indigo-500",
      prices: ["SAR 3.50", "SAR 12.99", "SAR 5.49"],
    },
    {
      title: "#CuratedStyle",
      subtitle: "Up to 80% off",
      button: "View Offers",
      bg: "from-emerald-500 to-teal-400",
      prices: ["SAR 2.00", "SAR 8.00", "SAR 1.50"],
    },
  ],
};

const PLACEHOLDER = "https://placehold.co/120x140/ffffff/cccccc?text=Item";

export default function Hero({ language = "ar" }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const activeSlides = slides[language] || slides.ar;

  const goTo = (index) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 300);
  };

  const prev = () => goTo((current - 1 + activeSlides.length) % activeSlides.length);
  const next = () => goTo((current + 1) % activeSlides.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((value) => (value + 1) % activeSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const slide = activeSlides[current];

  return (
    <div className="flex items-center justify-center p-6">
      <div
        className={`relative flex w-full max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-2xl bg-gradient-to-r ${slide.bg} p-8 md:flex-row`}
        style={{ minHeight: 220 }}
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />

        <div
          className="z-10 flex-1 space-y-4 text-white"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.3s" }}
        >
          <p className="text-sm font-medium tracking-widest opacity-80">
            {slide.title}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
            {slide.subtitle}
          </h1>
          <button className="rounded-lg border-2 border-white px-6 py-2 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-white hover:text-black active:scale-95">
            {slide.button}
          </button>
        </div>

        <div
          className="z-10 flex flex-1 justify-center gap-4"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.3s" }}
        >
          {slide.prices.map((price, i) => (
            <div
              key={i}
              className="w-28 cursor-pointer rounded-xl bg-white p-2 shadow-lg transition-transform duration-200 hover:scale-105"
            >
              <img
                src={PLACEHOLDER}
                className="w-full rounded-lg object-cover"
                alt="product"
              />
              <p className="mt-1 text-center text-sm font-bold text-red-500">
                {price}
              </p>
            </div>
          ))}
        </div>

        {[
          { fn: prev, side: "left-3", label: language === "ar" ? "›" : "‹" },
          { fn: next, side: "right-3", label: language === "ar" ? "‹" : "›" },
        ].map(({ fn, side, label }) => (
          <button
            key={side}
            onClick={fn}
            className={`absolute ${side} top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/40 active:scale-95`}
          >
            {label}
          </button>
        ))}

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
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
