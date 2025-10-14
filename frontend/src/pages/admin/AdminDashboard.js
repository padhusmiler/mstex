import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../../App';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/button';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/admin/orders?token=${token}`)
      ]);

      const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.total_amount, 0);
      const pendingOrders = ordersRes.data.filter(order => order.status === 'pending').length;

      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to load stats', error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color, link }) => (
    <Link to={link} className="block">
      <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-4 rounded-full ${color}`}>{icon}</div>
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50" data-testid="admin-dashboard">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your e-commerce store</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Package size={32} className="text-blue-600" />}
            title="Total Products"
            value={stats.totalProducts}
            color="bg-blue-100"
            link="/admin/products"
          />
          <StatCard
            icon={<ShoppingBag size={32} className="text-green-600" />}
            title="Total Orders"
            value={stats.totalOrders}
            color="bg-green-100"
            link="/admin/orders"
          />
          <StatCard
            icon={<DollarSign size={32} className="text-orange-600" />}
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            color="bg-orange-100"
            link="/admin/orders"
          />
          <StatCard
            icon={<Users size={32} className="text-purple-600" />}
            title="Pending Orders"
            value={stats.pendingOrders}
            color="bg-purple-100"
            link="/admin/orders"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/admin/products">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-6 rounded-xl hover:shadow-lg">
                Manage Products
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-6 rounded-xl hover:shadow-lg">
                Manage Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;