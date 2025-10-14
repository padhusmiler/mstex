import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${API}/auth/profile?token=${token}`, formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12" data-testid="profile-page">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-5xl font-bold mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-4 mb-8 pb-6 border-b">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                {user?.role === 'admin' ? 'Admin' : 'Customer'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 py-6 rounded-xl border-2"
                  data-testid="name-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 py-6 rounded-xl border-2"
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 py-6 rounded-xl border-2"
                  data-testid="phone-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium mb-2 block">
                Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 text-gray-400" size={20} />
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 py-6 rounded-xl border-2"
                  data-testid="address-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-6 rounded-xl hover:shadow-lg"
              data-testid="update-profile-button"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;