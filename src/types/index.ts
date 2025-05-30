export interface MenuItem {
  _id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isMadeToOrder: boolean;
  inStock: boolean;
  stock: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  DoB?: string;
  password: string;
  points: number;
  role: string;
}

export interface OrderMenuItem {
  menuItemId: MenuItem;
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  _id: string;
  userId: User;
  menuItems: OrderMenuItem[];
  status: "pending" | "processing" | "completed" | "cancelled";
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
  guestName: string;
  guestEmail: string;
  guestAddress: string;
}

// types/index.ts
export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string; // Required: used by Stripe.js to complete payment on frontend
  amount: number;
}

export interface PaymentIntentRequest {
  cart?: CartItem[]; // Required: amount in cents
  email?: string; // Optional: used for receipts and fraud detection
  metadata?: Record<string, string>; // Optional: custom internal data (e.g., userId, cartId)
  shipping?: {
    name: string;
    address: {
      line1: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
}
