export interface ProductImage {
    url: string;
    display_order: number;
  }
  
  export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    quantity: number;
    product_images: ProductImage[];
  }
  