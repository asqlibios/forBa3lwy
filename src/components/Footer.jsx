const LINKS = {
  ar: {
    sections: {
      الشركة: ["من نحن", "الوظائف", "الأخبار", "المدونة"],
      الدعم: ["مركز المساعدة", "الاسترجاع", "معلومات الشحن", "تواصل معنا"],
      القانونية: ["سياسة الخصوصية", "شروط الاستخدام", "إعدادات الكوكيز"],
    },
    description: "وجهتك السريعة للأزياء والمنتجات المختارة بأسعار مناسبة.",
    rights: "© 2026 SHOP. جميع الحقوق محفوظة.",
  },
  en: {
    sections: {
      Company: ["About Us", "Careers", "Press", "Blog"],
      Support: ["Help Center", "Returns", "Shipping Info", "Contact Us"],
      Legal: ["Privacy Policy", "Terms of Use", "Cookie Settings"],
    },
    description:
      "Your one-stop destination for fashion and curated finds at great prices.",
    rights: "© 2026 SHOP. All rights reserved.",
  },
};

export default function Footer({ language = "ar" }) {
  const content = LINKS[language] || LINKS.ar;

  return (
    <footer className="mt-10 bg-black text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <h2 className="mb-2 text-2xl font-extrabold tracking-widest">SHOP</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            {content.description}
          </p>
          <div className="mt-4 flex gap-3">
            {["📘", "📸", "✉️", "🎵"].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm transition-all duration-200 hover:scale-110 hover:bg-white/25"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {Object.entries(content.sections).map(([section, items]) => (
          <div key={section}>
            <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-300">
              {section}
            </h3>
            <ul className="space-y-2">
              {items.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 transition-colors duration-150 hover:text-white hover:underline underline-offset-2"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-gray-500">
        {content.rights}
      </div>
    </footer>
  );
}
