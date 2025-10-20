import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const { token, loadCartCount } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await axios.get(`${API}/cart?token=${token}`);
      setCart(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load cart', error);
      setLoading(false);
    }
  };

  const updateQuantity = async (itemIndex, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = [...cart.items];
    updatedItems[itemIndex].quantity = newQuantity;

    try {
      await axios.put(`${API}/cart/update?token=${token}`, updatedItems);
      setCart({ ...cart, items: updatedItems });
      loadCartCount();
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${API}/cart/remove/${productId}?token=${token}`);
      loadCart();
      loadCartCount();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full spinner"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="empty-cart">
        <Toaster position="top-right" />
        <div className="text-center">
          <ShoppingBag size={100} className="mx-auto mb-6 text-gray-300" />
          <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some amazing T-shirts to your cart!</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold px-8 py-6 rounded-full"
            data-testid="continue-shopping-button"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="cart-page">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg flex items-center space-x-6"
                data-testid={`cart-item-${index}`}
              >
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={40} className="text-gray-400" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1" data-testid={`item-product-id-${index}`}>
                    Product ID: {item.product_id.substring(0, 8)}...
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Size: <span className="font-semibold">{item.size}</span></p>
                    <p>Color: <span className="font-semibold">{item.color}</span></p>
                    <p className="text-lg font-bold text-orange-600">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    data-testid={`decrease-quantity-${index}`}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="text-xl font-bold w-8 text-center" data-testid={`quantity-${index}`}>
                    {item.quantity}
                  </span>
                  <Button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    data-testid={`increase-quantity-${index}`}
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                <Button
                  onClick={() => removeItem(item.product_id)}
                  className="p-3 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                  data-testid={`remove-item-${index}`}
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span data-testid="subtotal">${getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-orange-600" data-testid="total-price">${getTotalPrice()}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-6 rounded-full text-lg hover:shadow-2xl"
                data-testid="checkout-button"
              >
                Proceed to Checkout
              </Button>

              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full mt-4 py-6 rounded-full"
                data-testid="continue-shopping-link"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;