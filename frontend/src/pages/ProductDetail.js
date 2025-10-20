import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { ShoppingCart, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { token, loadCartCount } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
      setSelectedSize(response.data.sizes[0]);
      setSelectedColor(response.data.colors[0]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load product', error);
      toast.error('Product not found');
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${API}/cart/add?token=${token}`, {
        product_id: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor,
        price: product.price
      });
      toast.success('Added to cart!');
      loadCartCount();
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate('/')} className="rounded-full">Go Home</Button>
      </div>
    );
  }

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
  const imageUrl = product.images && product.images.length > 0 && product.images[selectedImage]
    ? `${BACKEND_URL}${product.images[selectedImage].url}`
    : 'https://via.placeholder.com/600x800?text=No+Image';

  console.log('ProductDetail image URL:', imageUrl);

  return (
    <div className="min-h-screen py-12" data-testid="product-detail-page">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Product detail image failed:', imageUrl);
                  e.target.src = 'https://via.placeholder.com/600x800?text=No+Image';
                }}
                onLoad={() => {
                  console.log('Product detail image loaded:', imageUrl);
                }}
                data-testid="main-product-image"
              />
              <button className="absolute top-4 right-4 p-3 bg-white rounded-full hover:bg-gray-100">
                <Heart size={24} className="text-gray-600" />
              </button>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-orange-600' : 'border-gray-200'
                    }`}
                    data-testid={`thumbnail-${idx}`}
                  >
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}${img.url}`}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                {product.category === 'men' ? "Men's Collection" : "Women's Collection"}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="product-name">{product.name}</h1>
              <p className="text-3xl font-bold text-orange-600" data-testid="product-price">₹{product.price}</p>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed" data-testid="product-description">
              {product.description}
            </p>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-bold mb-3">Select Size:</label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-full font-bold ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    data-testid={`size-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-bold mb-3">Select Color:</label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 rounded-full font-bold flex items-center space-x-2 ${
                      selectedColor === color
                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    data-testid={`color-${color}`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    <span>{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold mb-3">Quantity:</label>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-6 py-6 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                  data-testid="decrease-quantity"
                >
                  -
                </Button>
                <span className="text-2xl font-bold w-12 text-center" data-testid="quantity-display">{quantity}</span>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-6 py-6 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                  data-testid="increase-quantity"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-6 rounded-full text-lg hover:shadow-2xl"
              data-testid="add-to-cart-button"
            >
              <ShoppingCart className="mr-2" size={24} />
              Add to Cart - ₹{(product.price * quantity).toFixed(2)}
            </Button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="mx-auto mb-2 text-orange-600" size={32} />
                <p className="text-sm font-semibold">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-2 text-orange-600" size={32} />
                <p className="text-sm font-semibold">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="mx-auto mb-2 text-orange-600" size={32} />
                <p className="text-sm font-semibold">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;