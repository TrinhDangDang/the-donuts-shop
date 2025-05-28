"use client";
import { useAddMenuItemMutation, useGetMenuQuery } from "@/store/apiSlice";
import { addItem } from "@/store/cartSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { CartItem } from "@/types";
import { ToastContainer, toast } from "react-toastify";

export default function MenuPage() {
  const {
    data: menuItems,
    error: queryError,
    isLoading: queryLoading,
    refetch,
  } = useGetMenuQuery();

  const dispatch = useDispatch();

  const handleAddToCart = (item: {
    _id: string;
    title: string;
    price: number;
  }) => {
    const cartItem: CartItem = {
      menuItemId: item._id, // Reference to original menu item
      name: item.title,
      price: item.price,
      quantity: 1, // Default quantity
    };

    dispatch(addItem(cartItem));

    toast.success(`${item.title} added to cart!`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <h2 className="text-xl font-semibold mb-2">Current Menu</h2>

      {queryLoading && <p>Loading menu...</p>}
      {queryError && <p className="text-red-500">Failed to load menu.</p>}
      {menuItems?.map((item) => (
        <div key={item._id} className="flex flex-row border-b py-2">
          <div>
            <p>
              <strong>{item.title}</strong> – ${item.price}
            </p>
            <p className="text-sm text-gray-600">{item.description}</p>
            {item.inStock ? (
              <button
                className="border-2 px-2 py-1 mt-1 hover:bg-gray-100"
                onClick={() => handleAddToCart(item)}
              >
                Add to Cart
              </button>
            ) : (
              <div>Currently out of stock</div>
            )}
          </div>
          <img
            src={item.imageUrl}
            alt="menu Item"
            className="w-25 h-full"
          ></img>
        </div>
      ))}
    </div>
  );
}
