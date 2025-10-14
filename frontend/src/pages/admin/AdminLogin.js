import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../../App';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Shield, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      
      if (response.data.user.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }
      
      login(response.data.token, response.data.user);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4" data-testid="admin-login-page">
      <Toaster position="top-right" />
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full mb-4">
              <Shield size={40} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-2">Admin Portal</h2>
            <p className="text-gray-600">Login to access admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@trendyshirts.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 py-6 rounded-xl border-2"
                  data-testid="admin-email-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 py-6 rounded-xl border-2"
                  data-testid="admin-password-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-6 rounded-xl hover:shadow-lg"
              data-testid="admin-login-button"
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-orange-600 font-medium hover:underline">
              ← Back to Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;