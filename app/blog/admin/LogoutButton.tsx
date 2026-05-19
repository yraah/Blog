"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/blog/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      style={{
        marginTop: 20,
        padding: "10px 20px",
        background: "red",
        color: "white",
        border: "none",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}