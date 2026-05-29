// types/users.ts
import type { RowDataPacket } from "mysql2";

export type LoginBody = {
  username: string;
  password: string;
};

export type UserRow = RowDataPacket & {
  id:       number;
  username: string;
  password: string;
  email:    string;
};

export type RegisterBody = {
  username:   string;
  email:      string;
  password:   string;
  first_name: string;
  last_name:  string;
};

// Used by auth.service — login accepts username (not email)
export type AuthLoginPayload = Pick<LoginBody, "username" | "password">;
