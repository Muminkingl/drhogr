"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isAdminAllowed } from "@/lib/admin-whitelist";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          if (isAdminAllowed(session.user.email)) {
             router.push("/admin");
          } else {
             await supabase.auth.signOut();
             if (mounted) setError("Access denied. Your email is not whitelisted.");
             setTimeout(() => { if (mounted) router.push("/login?error=unauthorized"); }, 3000);
          }
        } else {
          // If no session exists immediately, wait a moment for Supabase to process URL hash
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, newSession: Session | null) => {
            if (event === "SIGNED_IN" && newSession) {
              if (isAdminAllowed(newSession.user.email)) {
                router.push("/admin");
              } else {
                await supabase.auth.signOut();
                if (mounted) setError("Access denied. Your email is not whitelisted.");
                setTimeout(() => { if (mounted) router.push("/login?error=unauthorized"); }, 3000);
              }
            } else if (event === "SIGNED_OUT") {
               if (mounted) setError("Authentication failed or cancelled.");
               setTimeout(() => { if (mounted) router.push("/login"); }, 3000);
            }
          });
          
          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "An error occurred during authentication.");
        setTimeout(() => { if (mounted) router.push("/login"); }, 3000);
      }
    };
    
    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A] text-[#F0EBD8] font-mono">
      <div className="text-center">
        {error ? (
          <div>
            <h2 className="text-red-500 text-xl font-bold mb-4">Authentication Failed</h2>
            <p>{error}</p>
            <p className="mt-4 text-sm opacity-60">Redirecting back to login...</p>
          </div>
        ) : (
          <div>
            <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Verifying authentication...</p>
          </div>
        )}
      </div>
    </div>
  );
}
