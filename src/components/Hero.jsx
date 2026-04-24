import { useState } from "react";

const slides = [
  {
    title: "#SHEINMothersDay",
    subtitle: "400K+ TOP SELLERS",
    images: ["/img1.jpg", "/img1.jpg", "/img1.jpg"],
    prices: ["$1.35", "$7.92", "$0.99"],
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const slide = slides[current];

  const prev = () =>
    setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));

  const next = () =>
    setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));

  return (
    <div className="flex items-center justify-center p-6">
      <div className="relative w-full max-w-6xl rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 p-8 flex flex-col md:flex-row items-center">

        {/* LEFT */}
        <div className="flex-1 text-white space-y-4">
          <p>{slide.title}</p>
          <h1 className="text-4xl font-bold">{slide.subtitle}</h1>

          <button className="border border-white px-6 py-2 rounded-lg">
            SHOP NOW
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex gap-4 flex-1 justify-center">
          {slide.images.map((img, i) => (
            <div key={i} className="bg-white rounded-xl p-2 w-32">
              <img src={img} />
              <p className="text-red-500 text-center">{slide.prices[i]}</p>
            </div>
          ))}
        </div>

        {/* ARROWS */}
        <button onClick={prev} className="absolute left-4">◀</button>
        <button onClick={next} className="absolute right-4">▶</button>

      </div>
    </div>
  );
}