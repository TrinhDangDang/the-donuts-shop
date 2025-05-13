"use client";
import { useAddMenuItemMutation, useGetMenuQuery } from "@/store/apiSlice";
import { useState } from "react";

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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addMenuItem({
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        image: form.imageUrl,
      }).unwrap();

      setForm({ title: "", description: "", price: "", imageUrl: "" });
      refetch(); // optional: refresh menu list
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
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
        <button
          type="submit"
          disabled={mutationLoading}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          {mutationLoading ? "Adding..." : "Add Menu Item"}
        </button>
        {mutationError && <p className="text-red-500">Failed to add item.</p>}
      </form>

      <h2 className="text-xl font-semibold mb-2">Current Menu</h2>
      {queryLoading && <p>Loading menu...</p>}
      {queryError && <p className="text-red-500">Failed to load menu.</p>}
      {menuItems?.map((item) => (
        <div key={item._id} className="border-b py-2">
          <p>
            <strong>{item.title}</strong> – ${item.price}
          </p>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

// <div className="min-h-screen px-6 py-10 bg-white text-gray-800 font-[family-name:var(--font-open-sans)]">
// {
/* <h1 className="text-4xl font-display text-amber-700 mb-10">Donuts</h1>
<div className="flex gap-8 overflow-x-auto px-2 no-scrollbar">
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
</div>
<h1 className="text-4xl font-display text-amber-700 mb-10">Donuts</h1>
<div className="flex gap-8 overflow-x-auto px-2 no-scrollbar">
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
  <MenuItemCard
    title="Matcha Donut"
    description="Fluffy green tea donut with white chocolate drizzle."
    price="$2.99"
    image="/images/menu/matcha-donuts.png"
  />
</div>
</div> */
// }
