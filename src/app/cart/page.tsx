"use client";
import { removeItem, selectCurrentCart } from "@/store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { CartItem } from "@/types"; // Define this type based on your data structure
import { useRouter } from "next/navigation";

export default function CartPage() {
  const cartItems = useSelector(selectCurrentCart);
  const dispatch = useDispatch();

  // Calculate total with proper typing
  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  // Calculate taxes (example: 10% tax rate)
  const taxRate = 0.0825;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleDeleteItem = (itemId: string) => {
    dispatch(removeItem(itemId));
  };
  const router = useRouter();
  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <a href="/menu" className="text-blue-600 hover:underline">
            Browse our menu
          </a>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {cartItems.map((item: CartItem) => (
              <div
                key={item.menuItemId}
                className="py-4 flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {item.specialInstructions && (
                        <>
                          Note: {item.specialInstructions}
                          <br />
                        </>
                      )}
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDeleteItem(item.menuItemId)}
                    className="text-red-500 hover:text-red-700 p-2"
                    aria-label="Remove item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({taxRate * 100}%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
