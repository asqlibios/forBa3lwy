import { useState, useEffect } from "react";

const slides = [
  {
    title: "#SHEINMothersDay",
    subtitle: "400K+ TOP SELLERS",
    bg: "from-pink-500 to-orange-400",
    prices: ["$1.35", "$7.92", "$0.99"],
  },
  {
    title: "#SummerVibes",
    subtitle: "NEW ARRIVALS DAILY",
    bg: "from-sky-500 to-indigo-500",
    prices: ["$3.50", "$12.99", "$5.49"],
  },
  {
    title: "#FashionWeek",
    subtitle: "UP TO 80% OFF",
    bg: "from-emerald-500 to-teal-400",
    prices: ["$2.00", "$8.00", "$1.50"],
  },
];

const PLACEHOLDER = "https://placehold.co/120x140/ffffff/cccccc?text=Item";

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (index) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 300);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((value) => (value + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="flex items-center justify-center p-6">
      <div
        className={`relative w-full max-w-6xl rounded-2xl bg-gradient-to-r ${slide.bg} p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden transition-all duration-500`}
        style={{ minHeight: 220 }}
      >
        {/* Decorative circle */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />

        {/* LEFT */}
        <div
          className="flex-1 text-white space-y-4 z-10"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.3s" }}
        >
          <p className="text-sm font-medium tracking-widest uppercase opacity-80">
            {slide.title}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            {slide.subtitle}
          </h1>
          <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold
                             hover:bg-white hover:text-black transition-all duration-200 hover:scale-105 active:scale-95">
            SHOP NOW
          </button>
        </div>

        {/* RIGHT */}
        <div
          className="flex gap-4 flex-1 justify-center z-10"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.3s" }}
        >
          {slide.prices.map((price, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-2 w-28 shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <img src={PLACEHOLDER} className="w-full rounded-lg object-cover" alt="product" />
              <p className="text-red-500 text-center font-bold text-sm mt-1">{price}</p>
            </div>
          ))}
        </div>

        {/* ARROWS */}
        {[{ fn: prev, side: "left-3", label: "◀" }, { fn: next, side: "right-3", label: "▶" }].map(({ fn, side, label }) => (
          <button
            key={side}
            onClick={fn}
            className={`absolute ${side} top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95`}
          >
            {label}
          </button>
        ))}

        {/* DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
