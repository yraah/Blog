"use client";

import { useState } from "react";
import { Input, Button, Modal, message, Card, Row, Col, Typography } from "antd";


const { Text } = Typography;
export default function LoginPage() {
  // 🔐 LOGIN STATE
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  // 📝 REGISTER STATE
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    address: "",
    phone:"",
  });

  const [loading, setLoading] = useState(false);

  // 🔐 LOGIN FUNCTION
  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      return message.error("Please fill all login fields");
    }

    setLoading(true);
    message.loading("Logging in...", 0.5);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setTimeout(() => {
        message.success("Login success 🚀");

        window.location.href = "/blog/admin";
      }, 800);
    } else {
      message.error(data.error || "Login failed");
    }
  };

  // 📝 REGISTER FUNCTION
  const handleRegister = async () => {
    if (
      !registerForm.username ||
      !registerForm.email ||
      !registerForm.password
    ) {
      return message.error("Please fill required fields");
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerForm),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      message.success("Registered successfully 🎉");

      setTimeout(() => {
        setIsRegisterOpen(false);
      }, 800);

      setRegisterForm({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone:"",
        address:""
      });
    } else {
      message.error(data.error || "Registration failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      {/* LOGIN CARD */}
      <Card title="Login" style={{ width: 360 }}>

        {/* USERNAME */}
        <Input
          placeholder="Username"
          style={{ marginBottom: 10 }}
          value={loginForm.username}
          onChange={(e) =>
            setLoginForm({ ...loginForm, username: e.target.value })
          }
        />

        {/* PASSWORD */}
        <Input.Password
          placeholder="Password"
          style={{ marginBottom: 15 }}
          value={loginForm.password}
          onChange={(e) =>
            setLoginForm({ ...loginForm, password: e.target.value })
          }
        />

        {/* LOGIN BUTTON */}
        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* OPEN REGISTER */}
        <Button
          type="link"
          block
          onClick={() => setIsRegisterOpen(true)}
        >
          Create Account
        </Button>
      </Card>

      {/* 📝 REGISTER MODAL */}
<Modal
  title="Create Account"
  open={isRegisterOpen}
  onCancel={() => setIsRegisterOpen(false)}
  footer={null}
>
  {/* 🔹 ACCOUNT INFORMATION */}
  <Text strong>Account Information</Text>

  <Row gutter={10} style={{ marginTop: 10 }}>
    <Col span={12}>
      <Input
        placeholder="Username"
        value={registerForm.username}
        onChange={(e) =>
          setRegisterForm({ ...registerForm, username: e.target.value })
        }
      />
    </Col>

    <Col span={12}>
      <Input
        placeholder="Email"
        value={registerForm.email}
        onChange={(e) =>
          setRegisterForm({ ...registerForm, email: e.target.value })
        }
      />
    </Col>
  </Row>

  <Input.Password
    placeholder="Password"
    style={{ marginTop: 10 }}
    value={registerForm.password}
    onChange={(e) =>
      setRegisterForm({ ...registerForm, password: e.target.value })
    }
  />

  {/* 🔹 PERSONAL INFORMATION */}
  <Text strong style={{ display: "block", marginTop: 20 }}>
    Personal Information
  </Text>

  <Row gutter={10} style={{ marginTop: 10 }}>
    <Col span={12}>
      <Input
        placeholder="First Name"
        value={registerForm.first_name}
        onChange={(e) =>
          setRegisterForm({ ...registerForm, first_name: e.target.value })
        }
      />
    </Col>

    <Col span={12}>
      <Input
        placeholder="Last Name"
        value={registerForm.last_name}
        onChange={(e) =>
          setRegisterForm({ ...registerForm, last_name: e.target.value })
        }
      />
    </Col>
  </Row>

  <Row gutter={10} style={{ marginTop: 10 }}>
    <Col span={12}>
      <Input
        placeholder="Phone"
        value={registerForm.phone}
        onChange={(e) =>
          setRegisterForm({ ...registerForm, phone: e.target.value })
        }
      />
    </Col>

    <Col span={12}>
      <Input
        placeholder="Address"
        value={registerForm.address}
        onChange={(e) =>
          setRegisterForm({ ...registerForm, address: e.target.value })
        }
      />
    </Col>
  </Row>

  {/* 🔥 REGISTER BUTTON */}
  <Button
    type="primary"
    block
    loading={loading}
    style={{ marginTop: 20 }}
    onClick={() => {
      // 🔥 VALIDATION
      if (!registerForm.username) {
        return message.error("Username is required");
      }

      if (!registerForm.email) {
        return message.error("Email is required");
      }

      if (!registerForm.password) {
        return message.error("Password is required");
      }

      if (registerForm.password.length < 6) {
        return message.error("Password must be at least 6 characters");
      }

      handleRegister();
    }}
  >
    Register
  </Button>
</Modal>
    </div>
  );
}