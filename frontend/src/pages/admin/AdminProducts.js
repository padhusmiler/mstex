import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '../../App';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'men',
    price: '',
    sizes: [],
    colors: [],
    stock: '100',
    imageUrls: []
  });
  const { token } = useContext(AuthContext);

  // Pre-defined T-shirt images from vision expert
  const tshirtImages = [
    'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450',
    'https://images.unsplash.com/photo-1516442719524-a603408c90cb',
    'https://images.unsplash.com/photo-1516082669438-2d2bb5082626',
    'https://images.unsplash.com/photo-1516177609387-9bad55a45194',
    'https://images.unsplash.com/photo-1509003124559-eb6678fe452b',
    'https://images.unsplash.com/photo-1589408871633-685343fb36b2',
    'https://images.unsplash.com/photo-1564430362299-113976f94001',
    'https://images.unsplash.com/photo-1533793735164-12065733b215',
    'https://images.pexels.com/photos/34253791/pexels-photo-34253791.jpeg',
    'https://images.pexels.com/photos/34277461/pexels-photo-34277461.jpeg',
    'https://images.pexels.com/photos/34277458/pexels-photo-34277458.jpeg',
    'https://images.pexels.com/photos/34286724/pexels-photo-34286724.jpeg'
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorOptions = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Gray', 'Navy', 'Orange'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load products', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleSize = (size) => {
    const sizes = formData.sizes.includes(size)
      ? formData.sizes.filter(s => s !== size)
      : [...formData.sizes, size];
    setFormData({ ...formData, sizes });
  };

  const toggleColor = (color) => {
    const colors = formData.colors.includes(color)
      ? formData.colors.filter(c => c !== color)
      : [...formData.colors, color];
    setFormData({ ...formData, colors });
  };

  const toggleImageUrl = (url) => {
    const imageUrls = formData.imageUrls.includes(url)
      ? formData.imageUrls.filter(u => u !== url)
      : [...formData.imageUrls, url];
    setFormData({ ...formData, imageUrls });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.sizes.length === 0) {
      toast.error('Please select at least one size');
      return;
    }
    if (formData.colors.length === 0) {
      toast.error('Please select at least one color');
      return;
    }

    // Create image metadata from selected URLs
    const images = formData.imageUrls.map(url => ({
      url: url,
      filename: url.split('/').pop(),
      size: 150000,
      width: 800,
      height: 1000
    }));

    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      sizes: formData.sizes,
      colors: formData.colors,
      stock: parseInt(formData.stock),
      images: images
    };

    try {
      if (editingProduct) {
        await axios.put(`${API}/admin/products/${editingProduct.id}?token=${token}`, productData);
        toast.success('Product updated successfully!');
      } else {
        await axios.post(`${API}/admin/products?token=${token}`, productData);
        toast.success('Product added successfully!');
      }
      
      loadProducts();
      resetForm();
      setShowAddModal(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock.toString(),
      imageUrls: product.images.map(img => img.url)
    });
    setShowAddModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${API}/admin/products/${productId}?token=${token}`);
      toast.success('Product deleted successfully!');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'men',
      price: '',
      sizes: [],
      colors: [],
      stock: '100',
      imageUrls: []
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50" data-testid="admin-products-page">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold">Product Management</h1>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingProduct(null);
                }}
                className="bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold px-6 py-6 rounded-full hover:shadow-lg"
                data-testid="add-product-button"
              >
                <Plus size={20} className="mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Cool T-Shirt"
                      data-testid="product-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                      <SelectTrigger data-testid="category-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="men">Men's</SelectItem>
                        <SelectItem value="women">Women's</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Product description..."
                    rows={3}
                    data-testid="product-description-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      placeholder="29.99"
                      data-testid="product-price-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      placeholder="100"
                      data-testid="product-stock-input"
                    />
                  </div>
                </div>

                <div>
                  <Label>Sizes</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sizeOptions.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-full font-semibold ${
                          formData.sizes.includes(size)
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                        data-testid={`size-option-${size}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Colors</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`px-4 py-2 rounded-full font-semibold flex items-center space-x-2 ${
                          formData.colors.includes(color)
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                        data-testid={`color-option-${color}`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                        <span>{color}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Product Images (Select up to 4)</Label>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {tshirtImages.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleImageUrl(url)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-4 ${
                          formData.imageUrls.includes(url)
                            ? 'border-orange-600'
                            : 'border-gray-200'
                        }`}
                        data-testid={`image-option-${idx}`}
                      >
                        <img src={url} alt={`T-shirt ${idx + 1}`} className="w-full h-full object-cover" />
                        {formData.imageUrls.includes(url) && (
                          <div className="absolute inset-0 bg-orange-600 bg-opacity-30 flex items-center justify-center">
                            <div className="bg-white rounded-full p-2">✓</div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-6 rounded-xl"
                  data-testid="save-product-button"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-lg" data-testid={`product-${product.id}`}>
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-orange-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                  ₹{product.price}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    {product.category}
                  </span>
                  <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                </div>

                <h3 className="text-lg font-bold mb-2 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>

                <div className="text-xs text-gray-500 mb-3">
                  <div>Sizes: {product.sizes.join(', ')}</div>
                  <div>Colors: {product.colors.join(', ')}</div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    data-testid={`edit-product-${product.id}`}
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    data-testid={`delete-product-${product.id}`}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No products yet. Add your first product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
