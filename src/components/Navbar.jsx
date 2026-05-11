import { useEffect, useRef, useState } from "react";

const WHATSAPP_NUMBER = "734743477";

const COPY = {
  ar: {
    searchAria: "البحث في المنتجات",
    searchPlaceholder: "ابحث بالاسم أو القسم",
    settings: "الإعدادات",
    admin: "الأدمن",
    complaints: "الشكاوى والتواصل",
    cart: "السلة",
    darkMode: "الوضع الليلي",
    language: "اللغة",
    login: "تسجيل الدخول",
    changeAccount: "تغيير الحساب",
    signOut: "تسجيل الخروج",
  },
  en: {
    searchAria: "Search products",
    searchPlaceholder: "Search by name or category",
    settings: "Settings",
    admin: "Admin",
    complaints: "Complaints",
    cart: "Cart",
    darkMode: "Dark mode",
    language: "Language",
    login: "Login",
    changeAccount: "Change account",
    signOut: "Sign out",
  },
};

function buildComplaintUrl(language) {
  const message =
    language === "ar"
      ? "السلام عليكم، عندي شكوى أو استفسار بخصوص المتجر."
      : "Hello, I have a complaint or question about the store.";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function SearchIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SettingsIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.82-.33 1.7 1.7 0 0 0-1 1.53V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.53 1.7 1.7 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .33-1.82 1.7 1.7 0 0 0-1.53-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.53-1 1.7 1.7 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.82.33h.01a1.7 1.7 0 0 0 1-1.53V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.53 1.7 1.7 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.33 1.82v.01a1.7 1.7 0 0 0 1.53 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.53 1Z" />
    </svg>
  );
}

function ChevronIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export default function Navbar({
  cart = [],
  language = "ar",
  onLanguageChange,
  searchTerm = "",
  onSearchChange,
  theme = "light",
  onThemeToggle,
  onOpenAdmin,
  onOpenCart,
  onOpenAccount,
  onOpenLogin,
  currentUser = null,
  onLogout,
  searchFocusToken = 0,
}) {
  const [openSettings, setOpenSettings] = useState(false);
  const settingsRef = useRef(null);
  const searchInputRef = useRef(null);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const isDark = theme === "dark";
  const copy = COPY[language] || COPY.en;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target)
      ) {
        setOpenSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchFocusToken > 0) {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [searchFocusToken]);

  const closeSettings = () => setOpenSettings(false);
  const loginLabel =
    currentUser?.displayName || currentUser?.email?.split("@")[0] || copy.login;

  return (
    <>
      <nav
        className="sticky top-0 z-40 flex flex-nowrap items-center gap-2 bg-black px-3 py-3 text-white sm:gap-4 sm:px-6 sm:py-4"
        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
        dir="ltr"
      >
        <h1
          className="shrink-0 text-lg font-bold tracking-widest uppercase sm:text-2xl"
          style={{ letterSpacing: "0.16em" }}
        >
          SHOP
        </h1>

        <div className="min-w-0 flex-1 sm:min-w-[280px]">
          <label className="group relative block">
            <input
              ref={searchInputRef}
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchChange?.(event.target.value)}
              aria-label={copy.searchAria}
              placeholder={copy.searchPlaceholder}
              dir={language === "ar" ? "rtl" : "ltr"}
              className="h-9 w-full rounded-full border border-white/15 bg-white/10 text-xs text-white outline-none transition-all duration-300 placeholder:text-white/35 hover:border-white/35 hover:bg-white/14 focus:border-white/55 focus:bg-white/16 sm:h-11 sm:text-sm sm:hover:-translate-y-0.5 sm:hover:shadow-[0_10px_24px_rgba(255,255,255,0.08)] sm:focus:-translate-y-0.5 sm:focus:shadow-[0_14px_30px_rgba(255,255,255,0.12)]"
              style={{
                paddingLeft: language === "ar" ? "1rem" : "3rem",
                paddingRight: language === "ar" ? "3rem" : "1rem",
              }}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-base text-white/60 transition-all duration-300 group-hover:scale-110 group-hover:text-white group-focus-within:scale-110 group-focus-within:text-white ${
                language === "ar" ? "right-4" : "left-4"
              }`}
            >
              <SearchIcon />
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={() => {
            closeSettings();
            onOpenAccount?.();
          }}
          className="max-w-[132px] shrink-0 truncate rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/14 sm:max-w-[180px] sm:px-5 sm:py-2.5 sm:text-sm"
          title={currentUser?.email || loginLabel}
        >
          {loginLabel}
        </button>

        <div className="relative shrink-0" ref={settingsRef}>
          <button
            type="button"
            onClick={() => setOpenSettings((value) => !value)}
            aria-label={copy.settings}
            aria-expanded={openSettings}
            className="group relative flex h-9 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/14 active:scale-95 sm:h-11 sm:px-4"
          >
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm text-black transition-transform duration-200 group-hover:rotate-12"
            >
              <SettingsIcon />
            </span>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-white/70 sm:inline">
              {copy.settings}
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-black bg-red-500 px-1 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {openSettings && (
            <div
              className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-extrabold">{copy.settings}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeSettings();
                  onOpenLogin?.();
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition-colors hover:bg-gray-50"
              >
                <span>{currentUser ? copy.changeAccount : copy.login}</span>
                <span aria-hidden="true">
                  <ChevronIcon />
                </span>
              </button>

              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    closeSettings();
                    onLogout?.();
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <span>{copy.signOut}</span>
                  <span aria-hidden="true">
                    <ChevronIcon />
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  closeSettings();
                  onOpenAdmin?.();
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition-colors hover:bg-gray-50"
              >
                <span>{copy.admin}</span>
                <span aria-hidden="true">
                  <ChevronIcon />
                </span>
              </button>

              <a
                href={buildComplaintUrl(language)}
                target="_blank"
                rel="noreferrer"
                onClick={closeSettings}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition-colors hover:bg-gray-50"
              >
                <span>{copy.complaints}</span>
                <span className="text-xs text-green-600">WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  closeSettings();
                  onOpenCart?.();
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition-colors hover:bg-gray-50"
              >
                <span>{copy.cart}</span>
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  {totalItems}
                </span>
              </button>

              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                <span className="text-sm font-semibold">{copy.darkMode}</span>
                <button
                  type="button"
                  onClick={onThemeToggle}
                  className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
                    isDark ? "bg-black" : "bg-gray-200"
                  }`}
                  aria-pressed={isDark}
                >
                  <span
                    className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      isDark
                        ? language === "ar"
                          ? "-translate-x-5"
                          : "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="border-t border-gray-100 px-4 py-3">
                <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                  {copy.language}
                </p>
                <div className="flex items-center rounded-full bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => onLanguageChange?.("ar")}
                    className={`flex-1 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                      language === "ar"
                        ? "bg-black text-white"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    AR
                  </button>
                  <button
                    type="button"
                    onClick={() => onLanguageChange?.("en")}
                    className={`flex-1 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                      language === "en"
                        ? "bg-black text-white"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
