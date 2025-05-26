"use client";
import { useSelector } from "react-redux";
import { selectCurrentRole } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useGetOrdersForAdminQuery,
  useUpdateOrderStatusMutation,
} from "@/store/apiSlice";
import { Order } from "@/types";

function AdminPage() {
  const role = useSelector(selectCurrentRole);
  const router = useRouter();

  // Secure redirection if not admin
  useEffect(() => {
    if (role !== "admin") {
      router.push("/");
    }
  }, [role, router]);

  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2">You don't have permission to view this page</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Current Orders</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm">
                Refresh
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">
                Filter
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <OrderList />
          </div>
        </section>

        <Menu />
      </div>

      {/* Admin Tools */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Admin Tools</h2>
        <div className="flex gap-4">
          <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition">
            Export Data
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            System Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderList() {
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useGetOrdersForAdminQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ orderId, updatedStatus: newStatus }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  if (isLoading)
    return <div className="text-center py-4">Loading orders...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-4">Error loading orders</div>
    );
  if (!orders?.length)
    return <p className="text-center py-4">No orders found</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${
            order.status === "completed"
              ? "border-green-500"
              : order.status === "processing"
              ? "border-blue-500"
              : "border-amber-500"
          }`}
        >
          <div
            className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors"
            onClick={() => toggleOrder(order._id)}
          >
            <div>
              <h3 className="font-bold">
                Order #{order._id.toString().slice(-6).toUpperCase()}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                <span className="font-medium">Status: {order.status}</span>
                <span>
                  Customer: {order.userId ? order.userId.name : order.guestName}
                </span>
                <span>Total: ${(order.totalAmount / 100).toFixed(2)}</span>
                <span>
                  Placed: {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <span className="text-lg">
              {expandedOrderId === order._id ? "−" : "+"}
            </span>
          </div>

          {expandedOrderId === order._id && (
            <div className="p-4 border-t">
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.menuItems.map((menuItem) => (
                    <li
                      key={menuItem.menuItemId._id.toString()}
                      className="flex justify-between"
                    >
                      <span>
                        {menuItem.quantity}x {menuItem.menuItemId.title}
                      </span>
                      <span>
                        $
                        {(menuItem.priceAtOrder * menuItem.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                {order.userId ? (
                  <div>
                    <h4 className="font-semibold">Customer:</h4>
                    <p>{order.userId.name}</p>
                    <p>{order.userId.email}</p>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-semibold">Guest:</h4>
                    <p>{order.guestName}</p>
                    <p>{order.guestEmail}</p>
                    {order.guestAddress && <p>{order.guestAddress}</p>}
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-2 flex-wrap">
                <button
                  onClick={() => handleStatusUpdate(order._id, "processing")}
                  className={`px-3 py-1 rounded text-sm ${
                    order.status === "processing"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                >
                  Mark as Processing
                </button>
                <button
                  onClick={() => handleStatusUpdate(order._id, "completed")}
                  className={`px-3 py-1 rounded text-sm ${
                    order.status === "completed"
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => handleStatusUpdate(order._id, "cancelled")}
                  className="px-3 py-1 rounded text-sm bg-red-100 text-red-800 hover:bg-red-200"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  isEditing?: boolean;
}

function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: "Margherita Pizza",
      price: 12.99,
      quantity: 10,
      description: "Classic tomato and mozzarella",
    },
    {
      id: 2,
      name: "Pasta Carbonara",
      price: 14.5,
      quantity: 8,
      description: "Creamy pasta with pancetta",
    },
  ]);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<MenuItem | null>(null);

  // Open dialog with item to edit
  const openEditDialog = (item: MenuItem) => {
    setCurrentEditItem(item);
    setIsDialogOpen(true);
  };

  const openAddNewItemDialog = () => {
    setIsDialogOpen(true);
  };

  // Close dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentEditItem(null);
  };

  // Save edited item
  const saveEditedItem = () => {
    if (!currentEditItem) return;

    setMenuItems(
      menuItems.map((item) =>
        item.id === currentEditItem.id ? currentEditItem : item
      )
    );
    closeDialog();
  };
  // Handle input changes in dialog
  const handleDialogInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentEditItem) return;

    const { name, value } = e.target;
    setCurrentEditItem({
      ...currentEditItem,
      [name]:
        name === "name" || name === "description"
          ? value
          : parseFloat(value) || 0,
    });
  };

  //ADD NEW ITEM LOGIC
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    stock: "",
  });

  const handleNewItemInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Menu Management</h2>
        <button
          className="px-3 py-1 bg-green-100 text-green-600 rounded-md text-sm"
          onClick={openAddNewItemDialog}
        >
          Add Item
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {`$${item.price.toFixed(2)}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-normal">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-400"
                    onClick={() => {
                      openEditDialog(item);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          title="Edit Menu Item"
        >
          {currentEditItem ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentEditItem.name}
                  onChange={handleDialogInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={currentEditItem.price}
                  onChange={handleDialogInputChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={currentEditItem.quantity}
                  onChange={handleDialogInputChange}
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={currentEditItem.description}
                  onChange={handleDialogInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="text"
                  name="description"
                  value={currentEditItem.description}
                  onChange={handleDialogInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={closeDialog}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedItem}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={saveEditedItem}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div>
              Add New Item
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  name="title"
                  placeholder="title"
                  value={form.title}
                  onChange={handleNewItemInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  description
                </label>
                <input
                  placeholder="description"
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleNewItemInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  price
                </label>
                <input
                  placeholder="price"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleNewItemInputChange}
                  min="0"
                  step="0.1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  quantity
                </label>
                <input
                  placeholder="quanity"
                  type="number"
                  name="quantity"
                  value={form.stock}
                  onChange={handleNewItemInputChange}
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  imageUrl
                </label>
                <input
                  placeholder="imageUrl"
                  type="file"
                  value={form.title}
                  onChange={handleNewItemInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={closeDialog}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 "
                >
                  Cancel
                </button>
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ">
                  Save
                </button>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </section>
  );
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

function Dialog({ isOpen, onClose, children, title }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4">
          <h3 className="text-lg font-semibold">{title || "Edit Item"}</h3>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default AdminPage;
