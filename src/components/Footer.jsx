export default function Footer() {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-2xl font-bold">SHEIN</h2>
          <p className="text-gray-400 text-sm">
            Your one-stop shop for fashion.
          </p>
        </div>

        <div>
          <h3>Company</h3>
          <p className="text-gray-400">About Us</p>
        </div>

        <div>
          <h3>Support</h3>
          <p className="text-gray-400">Help Center</p>
        </div>

        <div>
          <h3>Follow</h3>
          <p>📘 📸 🐦</p>
        </div>

      </div>

      <div className="text-center text-gray-500 border-t py-4">
        © 2026
      </div>
    </footer>
  );
}