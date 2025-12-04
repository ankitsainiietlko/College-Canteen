import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaSpinner, FaPlus, FaTrash } from "react-icons/fa";

export default function AdminDashboard({ name }) {
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({ name: "", description: "", price: "", image: "" });
  const token = localStorage.getItem("token");

  // Fetch orders and menu items
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders/all", {
          headers: { Authorization: token },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    const fetchFoods = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/food");
        setFoods(res.data);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };

    fetchOrders();
    fetchFoods();
  }, [token]);

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: token } }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: res.data.status } : o))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Add new food item
  const addFood = async () => {
    if (!newFood.name || !newFood.price) return alert("Name and Price required!");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/food",
        { ...newFood, price: parseFloat(newFood.price) },
        { headers: { Authorization: token } }
      );
      setFoods((prev) => [...prev, res.data]);
      setNewFood({ name: "", description: "", price: "", image: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add food");
    }
  };

  // Delete food item
  const deleteFood = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/food/${id}`, {
        headers: { Authorization: token },
      });
      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete food");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-purple-200 via-blue-100 to-green-200 min-h-screen">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-extrabold mb-6 text-purple-800 text-center"
      >
        Welcome, Admin {name}!
      </motion.h1>

      {/* ===== Menu Management ===== */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Menu Management</h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-3xl shadow-2xl mb-8"
      >
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
          <input
            type="text"
            placeholder="Name"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newFood.description}
            onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newFood.price}
            onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
            className="w-32 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newFood.image}
            onChange={(e) => setNewFood({ ...newFood, image: e.target.value })}
            className="flex-1 p-2 border rounded"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={addFood}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full flex items-center shadow-md"
          >
            <FaPlus className="mr-2" /> Add Food
          </motion.button>
        </div>

        {/* Food list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {foods.map((food) => (
            <motion.div
              key={food._id}
              whileHover={{ scale: 1.03, rotate: 1 }}
              className="bg-gray-50 p-4 rounded-2xl shadow-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-purple-700">{food.name}</h3>
                <p className="text-gray-500 text-sm">{food.description}</p>
                <p className="font-bold text-green-600">₹{food.price}</p>
              </div>
              <button
                onClick={() => deleteFood(food._id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
              >
                <FaTrash />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== Order Management ===== */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white p-6 rounded-3xl shadow-2xl border-l-8 border-purple-500"
            >
              <div className="flex justify-between mb-2">
                <span className="font-bold text-purple-700">Order ID: {order._id}</span>
                <span
                  className={`font-semibold ${
                    order.status === "Completed"
                      ? "text-green-600"
                      : order.status === "Preparing"
                      ? "text-yellow-600"
                      : "text-purple-700"
                  } flex items-center`}
                >
                  {order.status === "Pending" && <FaSpinner className="animate-spin mr-1" />}
                  {order.status === "Preparing" && <FaSpinner className="animate-spin mr-1" />}
                  {order.status === "Completed" && <FaCheck className="mr-1" />}
                  {order.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-2">
                Student: {order.student?.name} ({order.student?.email})
              </p>
              {order.items.map((item) => (
                <div key={item.food} className="flex justify-between text-gray-700 text-sm mb-1">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-purple-700 mt-2">
                <span>Total:</span>
                <span>₹{order.total}</span>
              </div>

              <div className="mt-4 flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded-full shadow-md"
                  onClick={() => updateStatus(order._id, "Preparing")}
                >
                  <FaSpinner className="mr-2 animate-spin" /> Preparing
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full shadow-md"
                  onClick={() => updateStatus(order._id, "Completed")}
                >
                  <FaCheck className="mr-2" /> Completed
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full shadow-md"
                  onClick={() => updateStatus(order._id, "Pending")}
                >
                  <FaTimes className="mr-2" /> Pending
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
