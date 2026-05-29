// types/posts.ts
// FIX: All types now use consistent PascalCase naming (postRow → PostRow, etc.)
import type { RowDataPacket } from "mysql2";

export type PostParams = {
  id?:   string;
  slug?: string;
};

export type PostBody = {
  title:            string;
  category:         string;
  description:      string;
  image:            string;
  meta_title:       string;
  meta_description: string;
  alt_image_name:   string;
};

export type PostRow = RowDataPacket & {
  id:               number;
  title:            string;
  slug:             string;
  category:         string;
  description:      string;
  image:            string;
  meta_title:       string;
  meta_description: string;
  alt_image_name:   string;
  deleted_at:       string | null;
};

export type PostCreateBody = {
  title:            string;
  slug:             string;
  category:         string;
  description:      string;
  image:            string;
  meta_title:       string;
  meta_description: string;
  alt_image_name:   string;
};

export type PostFormValues = {
  title:            string;
  description:      string;
  category:         string;
  meta_title:       string;
  meta_description: string;
  alt_image_name?:  string;
  image?:           string;
  slug?:            string;
};

export type PostRowWithId = PostFormValues & {
  id:    number;
  image: string;
};
