"use client";
import { useSelector } from "react-redux";
import { selectCurrentRole } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AdminPage() {
  const role = useSelector(selectCurrentRole);
  const router = useRouter();

  // Secure redirection if not admin
  //   useEffect(() => {
  //     if (role !== "admin") {
  //       router.replace("/unauthorized");
  //     }
  //   }, [role, router]);

  if (role !== "admin") {
    return null; // Or loading spinner
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
  return <div>Order list will appear here</div>;
}

function CustomerTable() {
  return <div>Customer management table will appear here</div>;
}
