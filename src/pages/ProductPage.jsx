import { useState, useEffect } from "react";

const PRODUCT_SPECS = {
  1: { // Classic Shirt
    sizes: [
      { label: "XS", chest: 84, length: 66, shoulder: 40 },
      { label: "S",  chest: 88, length: 68, shoulder: 42 },
      { label: "M",  chest: 96, length: 71, shoulder: 44 },
      { label: "L",  chest: 104, length: 74, shoulder: 46 },
      { label: "XL", chest: 112, length: 77, shoulder: 48 },
    ],
    material: "100% Cotton",
    fit: "Regular Fit",
    care: "Machine wash 30°C",
    origin: "Made in Portugal",
    description: "A timeless classic shirt crafted from breathable 100% cotton. Features a button-down collar and chest pocket. Perfect for casual outings or smart-casual settings.",
  },
  2: { // Winter Jacket
    sizes: [
      { label: "XS", chest: 90, length: 65, shoulder: 41 },
      { label: "S",  chest: 96, length: 67, shoulder: 43 },
      { label: "M",  chest: 104, length: 70, shoulder: 45 },
      { label: "L",  chest: 112, length: 73, shoulder: 47 },
      { label: "XL", chest: 120, length: 76, shoulder: 49 },
    ],
    material: "Shell: 100% Polyester / Lining: 80% Down",
    fit: "Relaxed Fit",
    care: "Dry clean only",
    origin: "Made in China",
    description: "Stay warm without sacrificing style. This winter jacket features a quilted down lining and wind-resistant outer shell. Perfect for cold urban days.",
  },
  3: { // Summer Dress
    sizes: [
      { label: "XS", chest: 80, length: 88, shoulder: 36 },
      { label: "S",  chest: 84, length: 91, shoulder: 37 },
      { label: "M",  chest: 92, length: 94, shoulder: 39 },
      { label: "L",  chest: 100, length: 97, shoulder: 41 },
      { label: "XL", chest: 108, length: 100, shoulder: 43 },
    ],
    material: "95% Viscose, 5% Elastane",
    fit: "Flowy Fit",
    care: "Hand wash cold",
    origin: "Made in Turkey",
    description: "Light and breezy summer dress with a floral silhouette. The viscose blend drapes beautifully and keeps you cool on warm days.",
  },
  4: { // Casual Hoodie
    sizes: [
      { label: "XS", chest: 92, length: 64, shoulder: 43 },
      { label: "S",  chest: 98, length: 66, shoulder: 45 },
      { label: "M",  chest: 106, length: 69, shoulder: 47 },
      { label: "L",  chest: 114, length: 72, shoulder: 49 },
      { label: "XL", chest: 122, length: 75, shoulder: 51 },
    ],
    material: "80% Cotton, 20% Polyester",
    fit: "Oversized Fit",
    care: "Machine wash 40°C",
    origin: "Made in Bangladesh",
    description: "Ultra-soft fleece-lined hoodie for ultimate comfort. Features a kangaroo pocket and adjustable drawstring hood. Your go-to layer for lazy weekends.",
  },
  5: { // Slim Pants
    sizes: [
      { label: "XS", waist: 64, hip: 88, inseam: 76 },
      { label: "S",  waist: 68, hip: 92, inseam: 77 },
      { label: "M",  waist: 74, hip: 98, inseam: 78 },
      { label: "L",  waist: 80, hip: 104, inseam: 79 },
      { label: "XL", waist: 86, hip: 110, inseam: 80 },
    ],
    material: "98% Cotton, 2% Elastane",
    fit: "Slim Fit",
    care: "Machine wash 30°C",
    origin: "Made in Portugal",
    description: "Modern slim-cut trousers with a hint of stretch for ease of movement. Clean lines and a tapered leg make these perfect for both office and evening wear.",
  },
  6: { // Sneakers
    sizes: [
      { label: "EU 36", length: 23.0, width: 8.8 },
      { label: "EU 37", length: 23.7, width: 9.0 },
      { label: "EU 38", length: 24.3, width: 9.2 },
      { label: "EU 39", length: 25.0, width: 9.5 },
      { label: "EU 40", length: 25.7, width: 9.7 },
      { label: "EU 41", length: 26.3, width: 10.0 },
      { label: "EU 42", length: 27.0, width: 10.2 },
    ],
    material: "Upper: Leather / Sole: Rubber",
    fit: "True to size",
    care: "Wipe with damp cloth",
    origin: "Made in Vietnam",
    description: "Clean and versatile low-top sneakers with a cushioned insole. The leather upper ages beautifully over time. Pairs effortlessly with jeans or casual trousers.",
  },
  7: { // Handbag
    sizes: [
      { label: "One Size", width: 30, height: 22, depth: 12 },
    ],
    material: "PU Leather / Canvas Lining",
    fit: "Adjustable strap: 60–120 cm",
    care: "Wipe with dry cloth",
    origin: "Made in Italy",
    description: "Structured everyday handbag with a spacious main compartment, interior zip pocket, and two slip pockets. The magnetic clasp closure keeps everything secure.",
  },
  8: { // Sunglasses
    sizes: [
      { label: "One Size", lens: 5.2, bridge: 1.8, arm: 14.5 },
    ],
    material: "Frame: Acetate / Lens: UV400 Polycarbonate",
    fit: "Medium face fit",
    care: "Use microfibre cloth",
    origin: "Made in Italy",
    description: "Timeless square-frame sunglasses with full UV400 protection. The acetate frame is lightweight and durable. Includes hard case and cleaning cloth.",
  },
  9: { // Denim Jacket
    sizes: [
      { label: "XS", chest: 88, length: 55, shoulder: 40 },
      { label: "S",  chest: 94, length: 57, shoulder: 42 },
      { label: "M",  chest: 102, length: 60, shoulder: 44 },
      { label: "L",  chest: 110, length: 63, shoulder: 46 },
      { label: "XL", chest: 118, length: 66, shoulder: 48 },
    ],
    material: "100% Cotton Denim (12 oz)",
    fit: "Regular Fit",
    care: "Machine wash cold, inside out",
    origin: "Made in Mexico",
    description: "Classic raw-edge denim jacket with brass button closures and two chest flap pockets. The medium wash finish pairs well with almost everything.",
  },
  10: { // Maxi Skirt
    sizes: [
      { label: "XS", waist: 62, hip: 86, length: 98 },
      { label: "S",  waist: 66, hip: 90, length: 100 },
      { label: "M",  waist: 72, hip: 96, length: 102 },
      { label: "L",  waist: 78, hip: 102, length: 104 },
      { label: "XL", waist: 84, hip: 108, length: 106 },
    ],
    material: "100% Satin Polyester",
    fit: "High-waist, Flared",
    care: "Hand wash cold, do not tumble dry",
    origin: "Made in Turkey",
    description: "Elegant floor-length satin skirt with a high-waisted silhouette and subtle sheen. The fluid fabric moves beautifully. Available in a pull-on elasticated waist.",
  },
};

const SPEC_KEYS = {
  chest: "Chest",
  length: "Length",
  shoulder: "Shoulder",
  waist: "Waist",
  hip: "Hip",
  inseam: "Inseam",
  width: "Width",
  height: "Height",
  depth: "Depth",
  lens: "Lens Width",
  bridge: "Bridge",
  arm: "Arm Length",
};

export default function ProductPage({ product, onBack, addToCart, inCart }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [visible, setVisible] = useState(false);

  const specs = PRODUCT_SPECS[product.id] || {
    sizes: [{ label: "One Size" }],
    material: "N/A",
    fit: "N/A",
    care: "N/A",
    origin: "N/A",
    description: product.name,
  };

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = () => {
    setVisible(false);
    setTimeout(onBack, 300);
  };

  const handleAdd = () => {
    if (!selectedSize && specs.sizes.length > 1) return;
    addToCart({ ...product, size: selectedSize || specs.sizes[0].label }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const sizeKeys = specs.sizes[0]
    ? Object.keys(specs.sizes[0]).filter((k) => k !== "label")
    : [];

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {/* Breadcrumb / Back */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 hover:text-black transition-colors duration-150 font-medium group"
        >
          <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">←</span>
          Back to Shop
        </button>
        <span>/</span>
        <span className="text-black font-semibold">{product.name}</span>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT — Image */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-lg" style={{ aspectRatio: "4/5" }}>
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.tag && (
            <span className={`absolute top-4 left-4 text-white text-sm font-bold px-3 py-1 rounded-full
              ${product.tag === "Bestseller" ? "bg-orange-500" : product.tag === "New" ? "bg-blue-500" : "bg-red-500"}`}>
              {product.tag}
            </span>
          )}
          {inCart && (
            <span className="absolute top-4 right-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              ✓ In Cart
            </span>
          )}
        </div>

        {/* RIGHT — Info */}
        <div className="flex flex-col gap-6 py-2">
          <div>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">{specs.origin}</p>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-red-500 mt-2">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-gray-600 leading-relaxed">{specs.description}</p>

          {/* Details strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🧵", label: "Material", value: specs.material },
              { icon: "👕", label: "Fit", value: specs.fit },
              { icon: "🫧", label: "Care", value: specs.care },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <div className="text-xl mb-1">{icon}</div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                <p className="text-xs font-medium text-gray-700 mt-0.5 leading-snug">{value}</p>
              </div>
            ))}
          </div>

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-sm uppercase tracking-wide">Select Size</p>
              {specs.sizes.length > 1 && !selectedSize && (
                <p className="text-xs text-red-400 font-medium">Please select a size</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {specs.sizes.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSize(s.label)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150
                    ${selectedSize === s.label
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size chart */}
          {sizeKeys.length > 0 && (
            <div>
              <p className="font-bold text-sm uppercase tracking-wide mb-3">Size Chart (cm)</p>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wide">
                      <th className="px-4 py-3 text-left">Size</th>
                      {sizeKeys.map((k) => (
                        <th key={k} className="px-4 py-3 text-center">{SPEC_KEYS[k] || k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {specs.sizes.map((s, i) => (
                      <tr
                        key={s.label}
                        onClick={() => setSelectedSize(s.label)}
                        className={`cursor-pointer border-t border-gray-50 transition-colors duration-100
                          ${selectedSize === s.label ? "bg-black text-white" : i % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50/50 hover:bg-gray-100"}`}
                      >
                        <td className="px-4 py-3 font-bold">{s.label}</td>
                        {sizeKeys.map((k) => (
                          <td key={k} className="px-4 py-3 text-center">{s[k]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-2">* All measurements are in centimeters. Click a row to select that size.</p>
            </div>
          )}

          {/* Qty + CTA */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center text-xl font-bold hover:bg-gray-100 transition-colors duration-150"
              >−</button>
              <span className="w-12 text-center font-bold text-lg">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-11 h-11 flex items-center justify-center text-xl font-bold hover:bg-gray-100 transition-colors duration-150"
              >+</button>
            </div>
            <span className="text-gray-400 text-sm font-medium">${(product.price * qty).toFixed(2)} total</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={specs.sizes.length > 1 && !selectedSize}
            className={`w-full py-4 rounded-2xl font-extrabold text-base tracking-wide transition-all duration-200
              ${added
                ? "bg-green-500 text-white scale-95"
                : specs.sizes.length > 1 && !selectedSize
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-95"
              }`}
          >
            {added ? "✓ Added to Cart!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
