import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders?token=${token}`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load orders', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600" size={24} />;
      case 'processing':
        return <Package className="text-blue-600" size={24} />;
      case 'shipped':
        return <Truck className="text-purple-600" size={24} />;
      case 'delivered':
        return <CheckCircle className="text-green-600" size={24} />;
      default:
        return <Package className="text-gray-600" size={24} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="no-orders">
        <div className="text-center">
          <Package size={100} className="mx-auto mb-6 text-gray-300" />
          <h2 className="text-3xl font-bold mb-4">No Orders Yet</h2>
          <p className="text-gray-600">Start shopping to see your orders here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="orders-page">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-8 shadow-lg" data-testid={`order-${order.id}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="text-xl font-bold" data-testid={`order-id-${order.id}`}>
                      Order #{order.id.substring(0, 12)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`} data-testid={`order-status-${order.id}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-2xl font-bold text-orange-600" data-testid={`order-total-${order.id}`}>
                    ${order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold mb-3">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700" data-testid={`order-item-${order.id}-${idx}`}>
                      <span>
                        {item.product_name} ({item.size}, {item.color}) x {item.quantity}
                      </span>
                      <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <p className="text-gray-600">
                  <span className="font-semibold">Shipping to:</span> {order.shipping_address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;