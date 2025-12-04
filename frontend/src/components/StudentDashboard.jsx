import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";

// Food Card Component with motion
function FoodCard({ food, addToCart }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-3xl shadow-2xl p-4 w-64 m-3 flex flex-col items-center transform perspective-1000"
    >
      <img
        src={food.image || "https://via.placeholder.com/150"}
        alt={food.name}
        className="rounded-xl w-full h-40 object-cover mb-3 shadow-inner"
      />
      <h3 className="font-extrabold text-lg text-purple-700">{food.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{food.description}</p>
      <p className="text-xl font-bold mb-2 text-green-600">₹{food.price}</p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-4 rounded-full shadow-lg"
        onClick={() => addToCart(food)}
      >
        <FaShoppingCart className="mr-2" /> Add to Cart
      </motion.button>
    </motion.div>
  );
}

export default function StudentDashboard({ name }) {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/food");
        setFoods(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: token },
        });
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFoods();
    fetchOrders();
  }, [token]);

  const addToCart = (food) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === food._id);
      if (exists) {
        return prev.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...food, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item._id !== id));

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cart.map((item) => ({
            food: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: totalPrice,
        },
        { headers: { Authorization: token } }
      );
      setCart([]);
      setOrders((prev) => [res.data, ...prev]);
      alert(`Order placed! Total: ₹${totalPrice}`);
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
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
        Welcome, {name}!
      </motion.h1>

      {/* Menu */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Menu</h2>
      <div className="flex flex-wrap justify-center">
        {foods.length === 0 ? (
          <p className="text-gray-500">Loading food items...</p>
        ) : (
          foods.map((food) => <FoodCard key={food._id} food={food} addToCart={addToCart} />)
        )}
      </div>

      {/* Cart */}
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-3xl mx-auto"
        >
          {cart.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.02 }}
              className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2"
            >
              <div>
                <h3 className="font-bold text-purple-700">{item.name}</h3>
                <p className="text-gray-600">₹{item.price} × {item.quantity}</p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
              >
                <FaTrashAlt />
              </button>
            </motion.div>
          ))}
          <div className="flex justify-between font-bold text-purple-700 mt-4 text-lg">
            <span>Total:</span>
            <span>₹{totalPrice}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full mt-4 shadow-lg"
            onClick={handleCheckout}
          >
            Checkout <FaShoppingCart className="inline ml-2" />
          </motion.button>
        </motion.div>
      )}

      {/* Orders */}
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
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
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-2">
                Date: {new Date(order.date).toLocaleString()}
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
