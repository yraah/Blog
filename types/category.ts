// types/category.ts
export type CategoryBody = {
  name: string;
  icon?: string;
};

export type CategoryBodyParams = {
  id: string;
};

export type CategoryRow = {
  id:   number;
  name: string;
  icon: string | null;
};
