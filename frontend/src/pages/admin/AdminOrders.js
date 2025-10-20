import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '../../App';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get(`${API}/admin/orders?token=${token}`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load orders', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API}/admin/orders/${orderId}/status?token=${token}&status=${newStatus}`
      );
      toast.success('Order status updated!');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handlePaymentStatusUpdate = async (orderId, paymentStatus) => {
    try {
      await axios.put(
        `${API}/admin/orders/${orderId}/status?token=${token}&status=${orders.find(o => o.id === orderId).status}&payment_status=${paymentStatus}`
      );
      toast.success('Payment status updated!');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update payment status');
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

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50" data-testid="admin-orders-page">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold">Order Management</h1>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]" data-testid="order-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Package size={80} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
            <p className="text-gray-600">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-lg" data-testid={`admin-order-${order.id}`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Order Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-xl font-bold" data-testid={`order-id-${order.id}`}>
                          Order #{order.id.substring(0, 12)}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-bold mb-2">Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-gray-700 bg-gray-50 p-3 rounded-lg" data-testid={`admin-order-item-${order.id}-${idx}`}>
                            <span>
                              {item.product_name} ({item.size}, {item.color}) x {item.quantity}
                            </span>
                            <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm">
                        <span className="font-semibold">Shipping Address:</span>
                      </p>
                      <p className="text-gray-700">{order.shipping_address}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-600">User ID: {order.user_id.substring(0, 12)}</span>
                      <span className="text-2xl font-bold text-orange-600" data-testid={`admin-order-total-${order.id}`}>
                        ₹{order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Status Management */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Order Status</label>
                      <Select
                        value={order.status}
                        onValueChange={(val) => handleStatusUpdate(order.id, val)}
                      >
                        <SelectTrigger className={`w-full ${getStatusColor(order.status)}`} data-testid={`status-select-${order.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Payment Status</label>
                      <Select
                        value={order.payment_status}
                        onValueChange={(val) => handlePaymentStatusUpdate(order.id, val)}
                      >
                        <SelectTrigger
                          className={`w-full ${
                            order.payment_status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                          data-testid={`payment-select-${order.id}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Items:</span>
                          <span className="font-semibold">{order.items.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Quantity:</span>
                          <span className="font-semibold">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
