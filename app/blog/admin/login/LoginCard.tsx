// app/login/LoginCard.tsx
"use client";

import { Input, Button, Card } from "antd";
import auth from "@/styles/auth.module.css";
import ui from "@/styles/ui.module.css";
import type { LoginForm } from "./page";

type Props = {
  loginForm: LoginForm;
  setLoginForm: (form: LoginForm) => void;
  loading: boolean;
  onLogin: () => void;
  onOpenRegister: () => void;
};

export default function LoginCard({
  loginForm,
  setLoginForm,
  loading,
  onLogin,
  onOpenRegister,
}: Props) {
  return (
    <Card title="Login" className={auth.card}>
      <Input
        placeholder="Username"
        className={ui.inputSpacing}
        value={loginForm.username}
        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
      />

      <Input.Password
        placeholder="Password"
        className={ui.inputSpacing}
        value={loginForm.password}
        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
      />

      <Button type="primary" block loading={loading} onClick={onLogin}>
        Login
      </Button>

      <Button type="link" block onClick={onOpenRegister}>
        Create Account
      </Button>
    </Card>
  );
}