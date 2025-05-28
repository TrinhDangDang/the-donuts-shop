"use client";
import { useSelector } from "react-redux";
import { selectCurrentRole } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuItem, Order } from "@/types";
import { ToastContainer, toast } from "react-toastify";
import {
  useAddMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetMenuQuery,
  useGetOrdersForAdminQuery,
  useUpdateMenuItemMutation,
  useUpdateOrderStatusMutation,
} from "@/store/apiSlice";

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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Orders</h2>
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

/*

LIST OF ORDER
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
----------------------------------------------------------------------------------------------------------------------------------------------------------
*/
const groupOrdersByDay = (orders: Order[]) => {
  const grouped: { [key: string]: Order[] } = {};

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);

    const dateKey = orderDate.toISOString().split("T")[0];

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(order);
  });
  return grouped;
};

const getSortedDaysWithOrders = (orders: Order[]) => {
  const grouped = groupOrdersByDay(orders);

  // Sort days (newest first)
  const sortedDays = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Sort orders within each day (newest first)
  sortedDays.forEach((day) => {
    grouped[day].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  return { sortedDays, grouped };
};

function OrderList() {
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useGetOrdersForAdminQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  console.log("Menu items:", orders);
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
  const { sortedDays, grouped } = getSortedDaysWithOrders(orders);

  return (
    <div className="space-y-8">
      {sortedDays.map((day) => (
        <div key={day} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 sticky top-0 bg-white py-2 z-10">
            {new Date(day).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>

          {grouped[day].map((order) => (
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
                      Customer:{" "}
                      {order.userId ? order.userId.name : order.guestName}
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
                            {(
                              menuItem.priceAtOrder * menuItem.quantity
                            ).toFixed(2)}
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
                      onClick={() =>
                        handleStatusUpdate(order._id, "processing")
                      }
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
      ))}
    </div>
  );
}
//   return (
//     <div className="space-y-4">
//       {orders.map((order) => (
//         <div
//           key={order._id}
//           className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${
//             order.status === "completed"
//               ? "border-green-500"
//               : order.status === "processing"
//               ? "border-blue-500"
//               : "border-amber-500"
//           }`}
//         >
//           <div
//             className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors"
//             onClick={() => toggleOrder(order._id)}
//           >
//             <div>
//               <h3 className="font-bold">
//                 Order #{order._id.toString().slice(-6).toUpperCase()}
//               </h3>
//               <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
//                 <span className="font-medium">Status: {order.status}</span>
//                 <span>
//                   Customer: {order.userId ? order.userId.name : order.guestName}
//                 </span>
//                 <span>Total: ${(order.totalAmount / 100).toFixed(2)}</span>
//                 <span>
//                   Placed: {new Date(order.createdAt).toLocaleString()}
//                 </span>
//               </div>
//             </div>
//             <span className="text-lg">
//               {expandedOrderId === order._id ? "−" : "+"}
//             </span>
//           </div>

//           {expandedOrderId === order._id && (
//             <div className="p-4 border-t">
//               <div className="mb-4">
//                 <h4 className="font-semibold mb-2">Items:</h4>
//                 <ul className="space-y-2">
//                   {order.menuItems.map((menuItem) => (
//                     <li
//                       key={menuItem.menuItemId._id.toString()}
//                       className="flex justify-between"
//                     >
//                       <span>
//                         {menuItem.quantity}x {menuItem.menuItemId.title}
//                       </span>
//                       <span>
//                         $
//                         {(menuItem.priceAtOrder * menuItem.quantity).toFixed(2)}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="pt-4 border-t">
//                 {order.userId ? (
//                   <div>
//                     <h4 className="font-semibold">Customer:</h4>
//                     <p>{order.userId.name}</p>
//                     <p>{order.userId.email}</p>
//                   </div>
//                 ) : (
//                   <div>
//                     <h4 className="font-semibold">Guest:</h4>
//                     <p>{order.guestName}</p>
//                     <p>{order.guestEmail}</p>
//                     {order.guestAddress && <p>{order.guestAddress}</p>}
//                   </div>
//                 )}
//               </div>

//               <div className="pt-4 flex gap-2 flex-wrap">
//                 <button
//                   onClick={() => handleStatusUpdate(order._id, "processing")}
//                   className={`px-3 py-1 rounded text-sm ${
//                     order.status === "processing"
//                       ? "bg-blue-600 text-white"
//                       : "bg-blue-100 text-blue-800 hover:bg-blue-200"
//                   }`}
//                 >
//                   Mark as Processing
//                 </button>
//                 <button
//                   onClick={() => handleStatusUpdate(order._id, "completed")}
//                   className={`px-3 py-1 rounded text-sm ${
//                     order.status === "completed"
//                       ? "bg-green-600 text-white"
//                       : "bg-green-100 text-green-800 hover:bg-green-200"
//                   }`}
//                 >
//                   Mark as Completed
//                 </button>
//                 <button
//                   onClick={() => handleStatusUpdate(order._id, "cancelled")}
//                   className="px-3 py-1 rounded text-sm bg-red-100 text-red-800 hover:bg-red-200"
//                 >
//                   Cancel Order
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

/*

ADMIN MENU CONTROL
----------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------
*/

function Menu() {
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [addMenuItem] = useAddMenuItemMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<MenuItem | null>(null);
  const [mode, setMode] = useState("Edit");
  const { data: menuItems, isLoading, error } = useGetMenuQuery();
  const [deleteMenuItem, { isLoading: deleteLoading }] =
    useDeleteMenuItemMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    // Check required text fields
    if (!form.title.trim() || !form.description.trim()) {
      return false;
    }

    // Check price is valid number > 0
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      return false;
    }

    if (form.stock && !form.isMadeToOrder) {
      if (isNaN(parseFloat(form.stock)) || parseFloat(form.stock) < 0) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    console.log(form);
    if (!validateForm()) {
      alert("Please fill out all fields correctly");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", form.title);
    formDataToSend.append("description", form.description);
    formDataToSend.append("price", form.price);
    formDataToSend.append("isMadeToOrder", form.isMadeToOrder.toString());
    // if (!form.isMadeToOrder && form.quantity) {
    formDataToSend.append("quantity", form.stock);
    // }

    if (selectedFile) {
      formDataToSend.append("image", selectedFile);
    }

    try {
      await addMenuItem(formDataToSend).unwrap();
      toast.success("Menu item added successfully!");
      // Reset form
      setForm({
        title: "",
        description: "",
        price: "",
        imageUrl: "",
        stock: "",
        isMadeToOrder: false,
      });
      setSelectedFile(null);
      closeDialog();
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Failed to add menu item");
    }
  };

  // Open dialog with item to edit
  const openEditDialog = (item: MenuItem) => {
    setMode("Edit");
    setCurrentEditItem(item);
    setIsDialogOpen(true);
  };

  const openAddNewItemDialog = () => {
    setMode("Add");
    setIsDialogOpen(true);
  };

  // Close dialog
  const closeDialog = () => {
    setSelectedFile(null);
    setIsDialogOpen(false);
    setCurrentEditItem(null);
  };
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
    try {
      await deleteMenuItem(id).unwrap();
      toast.success("Item deleted successfully"); // Using react-toastify or similar
      // Or: setState for a success message
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete item. Please try again.");
      // Or: setState for an error message
    } finally {
      setIsDialogOpen(false); // Always close dialog
    }
  };
  // Save edited item
  const saveEditedItem = async () => {
    if (!currentEditItem) {
      alert("No item selected for editing");
      return;
    }

    try {
      const formData = new FormData();

      // Append required fields
      formData.append("id", currentEditItem._id);
      formData.append("title", currentEditItem.title);
      formData.append("description", currentEditItem.description ?? "");
      formData.append("price", currentEditItem.price.toString());
      formData.append("inStock", currentEditItem.inStock.toString());
      formData.append(
        "isMadeToOrder",
        currentEditItem.isMadeToOrder.toString()
      );

      // Conditionally append stock quantity
      // if (
      //   !currentEditItem.isMadeToOrder &&
      //   currentEditItem.stock !== undefined
      // ) {

      formData.append(
        "quantity",
        currentEditItem.isMadeToOrder ? "0" : currentEditItem.stock.toString()
      );
      // }

      // Append image if selected
      if (selectedFile) {
        formData.append("image", selectedFile);
        // Clear the selectedFile state after appending
        setSelectedFile(null);
      }
      toast.info("Updating menu item...");

      // Send the update request
      await updateMenuItem(formData).unwrap();

      // Close dialog on success
      closeDialog();

      // Optional: Show success feedback
      toast.success("Menu item updated successfully!");
    } catch (error) {
      console.error("Failed to update item:", error);
      alert("Failed to update menu item. Please try again.");
    }
  };
  // Handle input changes in dialog
  const handleDialogInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setCurrentEditItem((prevState) => {
      if (!prevState) return prevState; // Early return if null

      // Handle quantity field separately
      // if (name === "quantity") {
      //   return {
      //     ...prevState,
      //     stock: {
      //       ...prevState.stock,
      //       quantity: Number(value), // Convert to number explicitly
      //     },
      //   };
      // }

      // Handle all other fields
      return {
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  //ADD NEW ITEM LOGIC

  interface MenuItemForm {
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    stock: string;
    isMadeToOrder: boolean;
  }
  const [form, setForm] = useState<MenuItemForm>({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    stock: "",
    isMadeToOrder: false,
  });

  const handleNewItemInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
            {menuItems &&
              menuItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {`$${item.price.toFixed(2)}`}
                  </td>
                  {item.isMadeToOrder ? (
                    <td className="px-6 py-4 whitespace-nowrap">
                      make to order
                    </td>
                  ) : (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.stock}
                    </td>
                  )}

                  <td className="px-6 py-4 whitespace-normal">
                    {item.description?.substring(0, 30) + "..."}
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
          title={mode == "Edit" ? "Edit Menu Item" : "Add Menu Item"}
        >
          {
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  name="title"
                  value={mode == "Edit" ? currentEditItem?.title : form.title}
                  onChange={
                    mode == "Edit"
                      ? handleDialogInputChange
                      : handleNewItemInputChange
                  }
                  placeholder={
                    mode !== "Edit" ? "Enter item name..." : undefined
                  }
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
                  value={mode == "Edit" ? currentEditItem?.price : form.price}
                  placeholder={
                    mode !== "Edit" ? "Enter item price..." : undefined
                  }
                  onChange={
                    mode == "Edit"
                      ? handleDialogInputChange
                      : handleNewItemInputChange
                  }
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {(mode === "Edit"
                ? !currentEditItem?.isMadeToOrder
                : !form.isMadeToOrder) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={
                      mode === "Edit" ? currentEditItem?.stock : form.stock
                    }
                    placeholder={
                      mode !== "Edit" ? "Enter item quantity..." : undefined
                    }
                    onChange={
                      mode === "Edit"
                        ? handleDialogInputChange
                        : handleNewItemInputChange
                    }
                    // disabled={
                    //   mode === "Edit"
                    //     ? currentEditItem?.isMadeToOrder
                    //     : form.isMadeToOrder
                    // }
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  style={{ height: "80px", lineHeight: "1" }}
                  name="description"
                  value={
                    mode == "Edit"
                      ? currentEditItem?.description
                      : form.description
                  }
                  placeholder={
                    mode !== "Edit" ? "Enter item description..." : undefined
                  }
                  onChange={
                    mode == "Edit"
                      ? handleDialogInputChange
                      : handleNewItemInputChange
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                {mode == "Edit" ? (
                  <img
                    src={currentEditItem?.imageUrl}
                    alt="Placeholder image"
                    className="w-45 h-auto"
                  />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-semibold
      file:bg-indigo-50 file:text-indigo-700
      hover:file:bg-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Made To Order
                </label>
                <input
                  type="checkbox"
                  name="isMadeToOrder"
                  checked={currentEditItem?.isMadeToOrder}
                  onChange={
                    mode == "Edit"
                      ? handleDialogInputChange
                      : handleNewItemInputChange
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  In Stock
                </label>
                <input
                  type="checkbox"
                  name="inStock"
                  checked={currentEditItem?.inStock}
                  onChange={
                    mode == "Edit"
                      ? handleDialogInputChange
                      : handleNewItemInputChange
                  }
                />
              </div>

              {mode == "Edit" ? (
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
                    onClick={() => handleDeleteItem(currentEditItem!._id)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={closeDialog}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600"
                  >
                    Add Menu Item
                  </button>
                </div>
              )}
            </div>
          }
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
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
