import { useState } from "react";

const COPY = {
  ar: {
    eyebrow: "بوابة المتجر",
    loginTitle: "تسجيل الدخول",
    signupTitle: "إنشاء حساب",
    subtitle:
      "ادخل لحسابك لمتابعة طلباتك المفضلة والاستمتاع بتجربة تسوق أسرع وأكثر سلاسة.",
    loginTab: "دخول",
    signupTab: "تسجيل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    fullName: "الاسم الكامل",
    confirmPassword: "تأكيد كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    loginButton: "دخول للحساب",
    signupButton: "إنشاء حساب جديد",
    signupCta: "سجل الآن",
    back: "العودة للمتجر",
    benefitsTitle: "مزايا الحساب",
    benefits: [
      "متابعة سريعة للطلبات والحالة الحالية لكل شحنة.",
      "حفظ المنتجات المفضلة والرجوع لها في أي وقت.",
      "إتمام الطلبات بشكل أسرع في الزيارات القادمة.",
    ],
    note: "استخدم نفس الحساب لاحقًا لتسجيل الدخول أو تغيير الحساب من الهيدر.",
    successLogin: "تم تسجيل الدخول بنجاح.",
    successSignup: "تم إنشاء الحساب وتسجيل الدخول مباشرة.",
    resetSent: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك.",
    passwordsMismatch: "كلمتا المرور غير متطابقتين.",
    fullNameRequired: "الاسم الكامل مطلوب لإنشاء الحساب.",
    emailRequired: "أدخل البريد الإلكتروني أولًا.",
    busy: "جارٍ التنفيذ...",
    loginHelper: "إذا ما عندك حساب، تقدر تنشئ واحد من زر التسجيل.",
  },
  en: {
    eyebrow: "Store Access",
    loginTitle: "Sign In",
    signupTitle: "Create Account",
    subtitle:
      "Access your account to track favorites, save time at checkout, and keep shopping smooth.",
    loginTab: "Login",
    signupTab: "Sign up",
    email: "Email address",
    password: "Password",
    fullName: "Full name",
    confirmPassword: "Confirm password",
    forgotPassword: "Forgot password?",
    loginButton: "Sign In",
    signupButton: "Create Account",
    signupCta: "Sign up",
    back: "Back to shop",
    benefitsTitle: "Why create an account?",
    benefits: [
      "Track orders and delivery updates in one place.",
      "Save favorite products and revisit them anytime.",
      "Checkout faster on your next visit.",
    ],
    note: "You can later use the same account to sign in or switch accounts from the header.",
    successLogin: "Signed in successfully.",
    successSignup: "Account created and signed in successfully.",
    resetSent: "A password reset link has been sent to your email.",
    passwordsMismatch: "Passwords do not match.",
    fullNameRequired: "Full name is required to create an account.",
    emailRequired: "Please enter your email first.",
    busy: "Please wait...",
    loginHelper: "If you do not have an account yet, use the sign up tab.",
  },
};

function mapAuthError(error, language) {
  const messages = {
    ar: {
      "auth/email-already-in-use": "هذا البريد مستخدم بالفعل.",
      "auth/invalid-email": "البريد الإلكتروني غير صالح.",
      "auth/user-not-found": "الحساب غير موجود.",
      "auth/wrong-password": "كلمة المرور غير صحيحة.",
      "auth/invalid-credential": "بيانات الدخول غير صحيحة.",
      "auth/weak-password": "كلمة المرور ضعيفة، استخدم 6 أحرف أو أكثر.",
      "auth/missing-password": "أدخل كلمة المرور أولًا.",
      default: "تعذر إكمال العملية الآن، حاول مرة أخرى.",
    },
    en: {
      "auth/email-already-in-use": "This email is already in use.",
      "auth/invalid-email": "Invalid email address.",
      "auth/user-not-found": "Account not found.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-credential": "Invalid login credentials.",
      "auth/weak-password": "Password is too weak. Use 6 characters or more.",
      "auth/missing-password": "Please enter your password first.",
      default: "Unable to complete this request right now. Please try again.",
    },
  };

  const locale = messages[language] || messages.en;
  return locale[error?.code] || locale.default;
}

export default function AuthPage({
  language = "ar",
  onBack,
  onLogin,
  onSignup,
  onForgotPassword,
  isBusy = false,
  currentUser = null,
}) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const copy = COPY[language] || COPY.en;
  const isLogin = mode === "login";

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isLogin) {
      if (!form.fullName.trim()) {
        setError(copy.fullNameRequired);
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError(copy.passwordsMismatch);
        return;
      }
    }

    try {
      if (isLogin) {
        await onLogin?.(form.email, form.password);
        setSuccess(copy.successLogin);
      } else {
        await onSignup?.({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        });
        setSuccess(copy.successSignup);
      }
    } catch (authError) {
      setError(mapAuthError(authError, language));
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    if (!form.email.trim()) {
      setError(copy.emailRequired);
      return;
    }

    try {
      await onForgotPassword?.(form.email);
      setSuccess(copy.resetSent);
    } catch (authError) {
      setError(mapAuthError(authError, language));
    }
  };

  return (
    <div
      className="relative overflow-hidden bg-[#f7f4ef] px-4 py-8 sm:px-6 lg:px-8"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5rem] top-10 h-36 w-36 rounded-full bg-[#f97316]/10 blur-3xl sm:h-56 sm:w-56" />
        <div className="absolute bottom-0 right-[-4rem] h-40 w-40 rounded-full bg-[#111827]/10 blur-3xl sm:h-60 sm:w-60" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="overflow-hidden rounded-[2rem] bg-[#111111] p-6 text-white shadow-[0_25px_80px_rgba(17,17,17,0.18)] sm:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/55">
            {copy.eyebrow}
          </p>
          {currentUser && (
            <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
              {currentUser.displayName || currentUser.email}
            </div>
          )}
          <h1 className="mt-4 max-w-md text-3xl font-black leading-tight sm:text-5xl">
            {isLogin ? copy.loginTitle : copy.signupTitle}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
            {copy.subtitle}
          </p>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur sm:p-6">
            <p className="text-sm font-bold text-white">{copy.benefitsTitle}</p>
            <div className="mt-4 space-y-3">
              {copy.benefits.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3"
                >
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#f97316]" />
                  <p className="text-sm leading-6 text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/8 bg-white/85 p-4 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
          <div className="rounded-[1.5rem] bg-[#f5efe7] p-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-[1.1rem] px-4 py-3 text-sm font-bold transition-all ${
                  isLogin
                    ? "bg-[#111111] text-white shadow-lg"
                    : "text-[#62564b] hover:bg-white/80"
                }`}
              >
                {copy.loginTab}
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-[1.1rem] px-4 py-3 text-sm font-bold transition-all ${
                  !isLogin
                    ? "bg-[#111111] text-white shadow-lg"
                    : "text-[#62564b] hover:bg-white/80"
                }`}
              >
                {copy.signupCta}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#322c25]">
                  {copy.fullName}
                </span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  className="h-12 w-full rounded-2xl border border-[#e8dfd2] bg-[#fffdfa] px-4 text-sm text-[#111111] outline-none transition focus:border-[#111111]"
                  placeholder={copy.fullName}
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#322c25]">
                {copy.email}
              </span>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="h-12 w-full rounded-2xl border border-[#e8dfd2] bg-[#fffdfa] px-4 text-sm text-[#111111] outline-none transition focus:border-[#111111]"
                placeholder="name@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#322c25]">
                {copy.password}
              </span>
              <input
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                className="h-12 w-full rounded-2xl border border-[#e8dfd2] bg-[#fffdfa] px-4 text-sm text-[#111111] outline-none transition focus:border-[#111111]"
                placeholder="********"
              />
            </label>

            {!isLogin && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#322c25]">
                  {copy.confirmPassword}
                </span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  className="h-12 w-full rounded-2xl border border-[#e8dfd2] bg-[#fffdfa] px-4 text-sm text-[#111111] outline-none transition focus:border-[#111111]"
                  placeholder="********"
                />
              </label>
            )}

            <div className="flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={() => setMode(isLogin ? "signup" : "login")}
                className="font-bold text-[#f97316] transition hover:text-[#ea580c]"
              >
                {isLogin ? copy.signupCta : copy.loginTab}
              </button>
              {isLogin && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-[#6b5f53] transition hover:text-[#111111]"
                >
                  {copy.forgotPassword}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full rounded-[1.2rem] bg-[#111111] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(17,17,17,0.18)] transition hover:-translate-y-0.5 hover:bg-[#222222] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isBusy
                ? copy.busy
                : isLogin
                  ? copy.loginButton
                  : copy.signupButton}
            </button>

            <button
              type="button"
              onClick={() => setMode("signup")}
              disabled={isBusy || !isLogin}
              className="w-full rounded-[1.2rem] border border-[#e5d7c6] bg-[#fff7ed] px-5 py-3.5 text-sm font-bold text-[#9a3412] transition hover:-translate-y-0.5 hover:border-[#fdba74] hover:bg-[#ffedd5] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {copy.signupCta}
            </button>
          </form>

          {(error || success) && (
            <div
              className={`mt-5 rounded-[1.35rem] px-4 py-3 text-sm ${
                error
                  ? "border border-red-200 bg-red-50 text-red-700"
                  : "border border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {error || success}
            </div>
          )}

          <div className="mt-5 rounded-[1.35rem] border border-dashed border-[#e7d8c4] bg-[#fcfaf6] px-4 py-3">
            <p className="text-sm leading-6 text-[#6b5f53]">
              {isLogin ? copy.loginHelper : copy.note}
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="mt-5 w-full rounded-[1.2rem] border border-black/10 bg-white px-5 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#f8f6f2]"
          >
            {copy.back}
          </button>
        </section>
      </div>
    </div>
  );
}
