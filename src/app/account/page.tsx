"use client";
import {
  useGetCustomerInfoQuery,
  useGetRecentOrdersQuery,
} from "@/store/apiSlice";
import type { Order } from "@/types"; // Import your Order type

export default function AccountPage() {
  // Fetch customer info
  const {
    data: customerInfo,
    isLoading: isCustomerLoading,
    error: customerError,
  } = useGetCustomerInfoQuery();

  // Fetch recent orders (last 5 orders)
  const {
    data: orders,
    isLoading: isOrdersLoading,
    error: ordersError,
  } = useGetRecentOrdersQuery();

  // Combined loading state
  const isLoading = isCustomerLoading || isOrdersLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error handling component
  const ErrorDisplay = ({ error }: { error: any }) => {
    if ("status" in error) {
      const errorMessage =
        "error" in error ? error.error : JSON.stringify(error.data);
      return <div className="text-red-500">Error: {errorMessage}</div>;
    }
    return (
      <div className="text-red-500">Error: {(error as Error).message}</div>
    );
  };

  if (customerError) return <ErrorDisplay error={customerError} />;
  if (ordersError) return <ErrorDisplay error={ordersError} />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Account Summary Section */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-r border-gray-200 pr-6">
              <h2 className="text-lg font-semibold text-gray-600">Name</h2>
              <p className="text-xl mt-1">{customerInfo?.name}</p>
            </div>
            <div className="border-r border-gray-200 pr-6">
              <h2 className="text-lg font-semibold text-gray-600">Email</h2>
              <p className="text-xl mt-1">{customerInfo?.email}</p>
            </div>
            <div className="border-r border-gray-200 pr-6">
              <h2 className="text-lg font-semibold text-gray-600">Points</h2>
              <p className="text-xl mt-1">
                {customerInfo?.points?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Orders Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
        {orders?.length ? (
          <div className="space-y-4">
            {orders.map((order: Order) => (
              <div
                key={order._id.toString()}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Order #{order._id.toString().slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium mb-2">Items Ordered:</h4>
                    <ul className="space-y-3">
                      {order.menuItems.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <div>
                            <p className="font-medium">
                              {item.quantity} × {item.menuItemId.title}
                            </p>
                          </div>
                          <p>
                            ${(item.priceAtOrder * item.quantity).toFixed(2)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Payment:{" "}
                        {order.paymentStatus.charAt(0).toUpperCase() +
                          order.paymentStatus.slice(1)}
                      </p>
                    </div>
                    <p className="text-lg font-bold">
                      Total: ${(order.totalAmount / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
