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

  const [addMenuItem, { isLoading: mutationLoading, error: mutationError }] =
    useAddMenuItemMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    stock: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stockQuantity = parseFloat(form.stock);

    try {
      await addMenuItem({
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl,
        stock: { quantity: stockQuantity, lowStockAlert: 5, autoDisable: true },
      }).unwrap();

      setForm({
        title: "",
        description: "",
        price: "",
        imageUrl: "",
        stock: "",
      });
      refetch(); // optional: refresh menu list
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

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
      <h1 className="text-2xl font-bold mb-4">Add New Menu Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 border rounded"
        />
        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="stock quantity"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={mutationLoading}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          {mutationLoading ? "Adding..." : "Add Menu Item"}
        </button>
        {mutationError && <p className="text-red-500">Failed to add item.</p>}
      </form>
      {queryLoading && <p>Loading menu...</p>}
      {queryError && <p className="text-red-500">Failed to load menu.</p>}
      {menuItems?.map((item) => (
        <div key={item._id} className="border-b py-2">
          <p>
            <strong>{item.title}</strong> – ${item.price}
          </p>
          <p className="text-sm text-gray-600">{item.description}</p>
          <button
            className="border-2 px-2 py-1 mt-1 hover:bg-gray-100"
            onClick={() => handleAddToCart(item)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
