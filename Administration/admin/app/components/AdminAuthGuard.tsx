"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  ADMIN_AUTH_EVENT,
  clearAdminToken,
  getAdminToken,
  isAdminTokenValid,
} from "@/lib/auth";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(ADMIN_AUTH_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(ADMIN_AUTH_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getAuthSnapshot() {
  const token = getAdminToken();
  return Boolean(token && isAdminTokenValid(token));
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
    const token = getAdminToken();

    if (token && !isAdminTokenValid(token)) {
      clearAdminToken();
    }

    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
