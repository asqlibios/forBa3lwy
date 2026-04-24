const LINKS = {
  Company: ["About Us", "Careers", "Press", "Blog"],
  Support: ["Help Center", "Returns", "Shipping Info", "Contact Us"],
  Legal: ["Privacy Policy", "Terms of Use", "Cookie Settings"],
};

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-2xl font-extrabold tracking-widest mb-2">SHOP</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your one-stop destination for fashion — quality styles at unbeatable prices.
          </p>
          <div className="flex gap-3 mt-4">
            {["📘", "📸", "🐦", "🎵"].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-sm
                           hover:bg-white/25 hover:scale-110 transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {Object.entries(LINKS).map(([section, items]) => (
          <div key={section}>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">
              {section}
            </h3>
            <ul className="space-y-2">
              {items.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-white transition-colors duration-150 hover:underline underline-offset-2"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 text-center text-gray-500 text-sm py-5">
        © 2026 SHOP. All rights reserved.
      </div>
    </footer>
  );
}
