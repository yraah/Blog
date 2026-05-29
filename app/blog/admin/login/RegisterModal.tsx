// app/login/RegisterModal.tsx
"use client";

import { Input, Button, Modal, Row, Col, Typography } from "antd";
import { message } from "antd";
import ui from "@/styles/ui.module.css";
import auth from "@/styles/auth.module.css";
import type { RegisterForm } from "./page";

const { Text } = Typography;

type Props = {
  open: boolean;
  registerForm: RegisterForm;
  setRegisterForm: (form: RegisterForm) => void;
  loading: boolean;
  onRegister: () => void;
  onClose: () => void;
};

// Validation lives here — co-located with the form that owns it
const validate = (form: RegisterForm): string | null => {
  if (!form.username) return "Username is required";
  if (!form.email) return "Email is required";
  if (!form.password) return "Password is required";
  if (form.password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export default function RegisterModal({
  open,
  registerForm,
  setRegisterForm,
  loading,
  onRegister,
  onClose,
}: Props) {
  const handleSubmit = () => {
    const error = validate(registerForm);
    if (error) return message.error(error);
    onRegister();
  };

  const update = (field: keyof RegisterForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setRegisterForm({ ...registerForm, [field]: e.target.value });

  return (
    <Modal title="Create Account" open={open} onCancel={onClose} footer={null}>
      <Text strong>Account Information</Text>

      <Row gutter={10} className={ui.formRow}>
        <Col span={12}>
          <Input placeholder="Username" value={registerForm.username} onChange={update("username")} />
        </Col>
        <Col span={12}>
          <Input placeholder="Email" value={registerForm.email} onChange={update("email")} />
        </Col>
      </Row>

      <Input.Password
        placeholder="Password"
        className={ui.inputSpacing}
        value={registerForm.password}
        onChange={update("password")}
      />

      <Text className={auth.sectionTitle}>Personal Information</Text>

      <Row gutter={10} className={ui.formRow}>
        <Col span={12}>
          <Input placeholder="First Name" value={registerForm.first_name} onChange={update("first_name")} />
        </Col>
        <Col span={12}>
          <Input placeholder="Last Name" value={registerForm.last_name} onChange={update("last_name")} />
        </Col>
      </Row>

      <Row gutter={10} className={ui.formRow}>
        <Col span={12}>
          <Input placeholder="Phone" value={registerForm.phone} onChange={update("phone")} />
        </Col>
        <Col span={12}>
          <Input placeholder="Address" value={registerForm.address} onChange={update("address")} />
        </Col>
      </Row>

      <Button
        type="primary"
        block
        loading={loading}
        className={ui.mtLarge}
        onClick={handleSubmit}
      >
        Register
      </Button>
    </Modal>
  );
}