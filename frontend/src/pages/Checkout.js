import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

const Checkout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const response = await axios.get(`${API}/cart?token=${token}`);
      if (response.data.items.length === 0) {
        navigate('/cart');
        return;
      }
      setCart(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load cart', error);
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }

    setProcessing(true);

    try {
      // Create order items with product names
      const orderItems = cart.items.map(item => ({
        product_id: item.product_id,
        product_name: `Product ${item.product_id.substring(0, 8)}`,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price
      }));

      const orderData = {
        items: orderItems,
        shipping_address: address,
        total_amount: parseFloat(getTotalPrice())
      };

      await axios.post(`${API}/orders/create?token=${token}`, orderData);
      
      toast.success('Order placed successfully!');
      
      // Simulate payment processing
      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (error) {
      console.error('Order failed', error);
      toast.error('Failed to place order');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="checkout-page">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="space-y-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="text-orange-600" size={28} />
              <h2 className="text-2xl font-bold">Shipping Address</h2>
            </div>
            <div>
              <Label htmlFor="address" className="text-sm font-medium mb-2 block">
                Full Address
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St, Apt 4, City, State, ZIP"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="py-6 rounded-xl border-2"
                data-testid="address-input"
              />
            </div>
          </div>

          {/* Payment Method (Dummy) */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="text-orange-600" size={28} />
              <h2 className="text-2xl font-bold">Payment Method</h2>
            </div>
            <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl p-6 border-2 border-orange-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg mb-1">Dummy Payment Gateway</p>
                  <p className="text-sm text-gray-600">Test payment processor - No real charges</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-full font-bold text-green-600">
                  Active
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.items.map((item, index) => (
                <div key={index} className="flex justify-between text-gray-700" data-testid={`order-item-${index}`}>
                  <span>
                    Product {item.product_id.substring(0, 8)} ({item.size}, {item.color}) x {item.quantity}
                  </span>
                  <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span data-testid="checkout-subtotal">₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-2">
                <span>Total</span>
                <span className="text-orange-600" data-testid="checkout-total">₹{getTotalPrice()}</span>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <Button
            type="submit"
            disabled={processing}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-8 rounded-full text-xl hover:shadow-2xl"
            data-testid="place-order-button"
          >
            {processing ? 'Processing Order...' : `Place Order - $${getTotalPrice()}`}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;