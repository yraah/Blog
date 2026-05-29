// app/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { fetchWithRetry } from "@/utils/fetchWithRetry";
import { formatError } from "@/utils/error";
import auth from "@/styles/auth.module.css";
import ui from "@/styles/ui.module.css";

// --- Skeleton fallbacks ---
function CardSkeleton() {
  return (
    <div style={{
      width: 360,
      padding: 24,
      borderRadius: 8,
      background: "#fff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      {[100, 100, 100, 60].map((w, i) => (
        <div key={i} style={{ height: 36, width: `${w}%`, background: "#e5e7eb", borderRadius: 6 }} />
      ))}
    </div>
  );
}

function ModalSkeleton() {
  return null; // Modal is hidden until opened — no skeleton needed
}

// --- Dynamic imports ---
const LoginCard = dynamic(() => import("./LoginCard"), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

const RegisterModal = dynamic(() => import("./RegisterModal"), {
  loading: () => <ModalSkeleton />,
  ssr: false,
});

// --- Shared form state types ---
export type LoginForm = { username: string; password: string };
export type RegisterForm = {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
};

const INITIAL_REGISTER: RegisterForm = {
  username: "", email: "", password: "",
  first_name: "", last_name: "", address: "", phone: "",
};

export default function LoginPage() {
  const router = useRouter();

  const [loginForm, setLoginForm] = useState<LoginForm>({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState<RegisterForm>(INITIAL_REGISTER);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const { message } = await import("antd");

    if (!loginForm.username || !loginForm.password) {
      return message.error("Please fill all login fields");
    }

    try {
      setLoading(true);
      await fetchWithRetry("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      message.success("Login success 🚀");
      router.push("/blog/admin");
    } catch (error) {
      message.error(formatError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const { message } = await import("antd");

    try {
      setLoading(true);
      await fetchWithRetry("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      message.success("Registered successfully 🎉");
      setIsRegisterOpen(false);
      setRegisterForm(INITIAL_REGISTER);
    } catch (error) {
      message.error(formatError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={auth.page}>
      <Suspense fallback={<CardSkeleton />}>
        <LoginCard
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          loading={loading}
          onLogin={handleLogin}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />
      </Suspense>

      <Suspense fallback={null}>
        <RegisterModal
          open={isRegisterOpen}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          loading={loading}
          onRegister={handleRegister}
          onClose={() => setIsRegisterOpen(false)}
        />
      </Suspense>
    </div>
  );
}