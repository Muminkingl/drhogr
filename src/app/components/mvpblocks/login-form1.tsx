"use client";

import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function LoginForm1() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(180deg, #160900 0%, #1A0C07 100%)" }}
    >
      {/* Grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px",
        }}
      />
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.1) 0%, transparent 60%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(201,168,76,0.2)",
            boxShadow: "0 16px 60px -16px rgba(0,0,0,0.5)",
          }}
        >
          {/* Gold top accent */}
          <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />

          <div className="p-8 sm:p-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-5 flex items-center justify-center bg-transparent"
                style={{ border: "2px solid rgba(201,168,76,0.2)", background: "radial-gradient(ellipse at center, rgba(201,168,76,0.08), transparent)", boxShadow: "0 8px 24px -8px rgba(201,168,76,0.2)" }}
              >
                <img src="/textH.png" alt="Dr.Hogr ghareeb" className="w-full h-full object-contain p-2" />
              </div>
              <h1
                className="text-2xl sm:text-3xl font-black tracking-tight mb-2"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#F5EDD0" }}
              >
                Admin Login
              </h1>
              <p className="text-sm" style={{ color: "rgba(191,168,130,0.55)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                Sign in to access the admin panel
              </p>
            </div>

            {/* Google Button */}
            <motion.button
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 30px -8px rgba(201,168,76,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(201,168,76,0.3)",
                color: "#F5EDD0",
              }}
            >
              {/* Google SVG icon */}
              <svg className="h-5 w-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_17_40)">
                  <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                  <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                  <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                  <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_17_40">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Sign in with Google

              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: "rgba(201,168,76,0.2)" }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.5)" }}>
                Secure Login
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(201,168,76,0.2)" }} />
            </div>

            {/* Info */}
            <p className="text-[11px] text-center leading-relaxed" style={{ color: "rgba(191,168,130,0.4)", fontFamily: "Georgia, serif" }}>
              Only authorized administrators can access the admin panel.
              <br />
              Contact the organization if you need access.
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs font-bold transition-colors hover:text-[#C9A84C]"
            style={{ color: "rgba(201,168,76,0.5)", fontFamily: "Georgia, serif", letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            ← Back to website
          </a>
        </div>
      </motion.div>
    </main>
  );
}
