"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";

function subscribe() {
  return () => {};
}

function getAuthSnapshot() {
  return localStorage.getItem("vnatech-admin-auth") === "true";
}

function getServerSnapshot() {
  return false;
}

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useSyncExternalStore(
    subscribe,
    getAuthSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
}