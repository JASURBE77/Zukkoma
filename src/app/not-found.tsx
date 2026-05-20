import Link from "next/link"
import { Search, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#faf8ff", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Decorative mesh background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 20% 20%, hsla(222, 100%, 90%, 0.6) 0, transparent 50%),
            radial-gradient(at 80% 80%, hsla(210, 100%, 90%, 0.4) 0, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 text-center max-w-lg">
        {/* Giant 404 */}
        <div
          className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter select-none mb-2"
          style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #93c5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>

        {/* Illustration circle */}
        <div className="flex justify-center mb-8">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center bg-blue-700 shadow-lg"
            style={{ boxShadow: "0 8px 32px rgba(29,78,216,0.25)" }}
          >
            <Search className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-2xl sm:text-3xl font-black text-slate-900 mb-3"
          style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
        >
          Sahifa topilmadi
        </h1>
        <p className="text-slate-500 text-base mb-8 leading-relaxed">
          Siz izlagan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi mumkin.
          <br />Bosh sahifaga qaytib ko&apos;ring.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all"
            style={{ boxShadow: "0 4px 16px rgba(29,78,216,0.3)" }}
          >
            <Home className="w-4 h-4" /> Bosh sahifa
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-[#e1e1ee] text-slate-700 font-bold rounded-xl hover:bg-white hover:border-blue-700/30 active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Orqaga
          </Link>
        </div>

        {/* Decorative card */}
        <div
          className="mt-12 inline-flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-[#e1e1ee]"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="w-8 h-8 rounded-xl bg-blue-700 flex items-center justify-center text-white text-sm font-black">Z</div>
          <span className="font-black text-blue-700" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
            ZUKKOMA
          </span>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Education Platform</span>
        </div>
      </div>
    </div>
  )
}
