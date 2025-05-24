"use client";
import { useSelector } from "react-redux";
import { selectCurrentRole } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetOrdersForAdminQuery } from "@/store/apiSlice";
import { Order } from "@/types";

function AdminPage() {
  const role = useSelector(selectCurrentRole);
  const router = useRouter();

  //Secure redirection if not admin
  useEffect(() => {
    if (role !== "admin") {
      console.log("user role", role);
      router.push("/");
    }
  }, [role, router]);

  if (role !== "admin") {
    return (
      <div>
        nothing here
        <h1>{role}</h1>
        <h1>hello</h1>
      </div>
    ); // Or loading spinner
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Orders Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current Orders</h2>
          <OrderList /> {/* Your order list component */}
        </section>

        {/* Customer Management */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Customer Management</h2>
          <CustomerTable /> {/* Your customer table component */}
        </section>
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

export default AdminPage;

// Mock components (replace with your actual implementations)
function OrderList() {
  const { data: orders, isLoading, error } = useGetOrdersForAdminQuery();
  console.log("ORDERS", orders);
  return (
    <div>
      {orders?.length ? (
        orders.map((order: Order) => {
          return (
            <div
              key={order._id}
              className="mt-6 bg-white p-6 rounded-lg shadow"
            >
              {/* <div>{order.menuItems.map((menuItem)=> {return (<p>{menuItem.t}</p>)})}</div> */}

              {order.menuItems.map((menuItem) => (
                <div key={menuItem.menuItemId._id}>
                  <ul>
                    <li>{menuItem.menuItemId.title}</li>
                    <li>{menuItem.priceAtOrder}</li>
                    <li>{menuItem.quantity}</li>
                  </ul>
                </div>
              ))}

              <p>{order.totalAmount}</p>
              <p>{order.status}</p>
              <p>{order.paymentStatus}</p>
            </div>
          );
        })
      ) : (
        <p>no orders</p>
      )}
    </div>
  );
}

function CustomerTable() {
  return <div>Customer management table will appear here</div>;
}
