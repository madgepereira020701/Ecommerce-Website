import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // Example: Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with your backend route
        const res = await fetch("http://localhost:3000/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order._id || index}
              className="bg-white shadow-md rounded-lg p-4"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h2 className="font-semibold text-lg">Order #{index + 1}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>

              {/* Products in Order */}
              <div className="space-y-2">
                {order.products.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{item.price}</p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center mt-3">
                <p className="font-bold text-lg">Total: ₹{order.total}</p>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
