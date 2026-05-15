"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user && pathname !== "/login") {
        router.push("/login");
      }

      if (data.user && pathname === "/login") {
        router.push("/dashboard");
      }

      setLoading(false);
    }

    checkUser();
  }, [pathname, router]);

  if (loading) {
    return <p className="p-8 text-black">Checking login...</p>;
  }

  return <>{children}</>;
}