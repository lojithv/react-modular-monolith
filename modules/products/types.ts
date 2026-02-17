export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  stock: number;
}

export interface CreateProductInput {
  name: string;
  price: string;
  category: string;
  stock: number;
  description?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;
