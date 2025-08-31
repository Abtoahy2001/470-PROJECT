export interface Category {
  name: string;
}

export interface Product {
  _id: string;  
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  categories?: Category; 
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;  
  __v?: number;       
}

export interface ProductsResponse {
  status: string;
  results: number;
  data: {
    products: Product[];
  };
}