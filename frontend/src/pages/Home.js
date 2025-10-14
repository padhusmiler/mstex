import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import ProductCard from '../components/ProductCard';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [size, setSize] = useState('all');
  const [color, setColor] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, search, category, size, color, priceRange]);

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

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Size filter
    if (size !== 'all') {
      filtered = filtered.filter((p) => p.sizes.includes(size));
    }

    // Color filter
    if (color !== 'all') {
      filtered = filtered.filter((p) => p.colors.includes(color));
    }

    // Price range filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter((p) => {
        if (max) {
          return p.price >= min && p.price <= max;
        } else {
          return p.price >= min;
        }
      });
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setSize('all');
    setColor('all');
    setPriceRange('all');
  };

  const allSizes = [...new Set(products.flatMap((p) => p.sizes))];
  const allColors = [...new Set(products.flatMap((p) => p.colors))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white py-20" data-testid="hero-section">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 fade-in">
            MS TEX PREMIUM KNITS
          </h1>
          <p className="text-xl md:text-2xl mb-4 fade-in">
            Premium T-Shirts for Men & Women
          </p>
          <p className="text-lg mb-8 fade-in opacity-90">
            Finest Quality Knitted Clothing from Tiruppur, Tamil Nadu
          </p>
          <div className="flex flex-wrap justify-center gap-4 fade-in">
            <Button
              onClick={() => setCategory('men')}
              className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-full"
              data-testid="shop-men-button"
            >
              Shop Men's
            </Button>
            <Button
              onClick={() => setCategory('women')}
              className="bg-white text-pink-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-full"
              data-testid="shop-women-button"
            >
              Shop Women's
            </Button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white shadow-md sticky top-16 z-40" data-testid="filters-section">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 py-6 rounded-full border-2 border-gray-200 focus:border-orange-500"
                  data-testid="search-input"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[150px] rounded-full" data-testid="category-filter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="men">Men's</SelectItem>
                <SelectItem value="women">Women's</SelectItem>
              </SelectContent>
            </Select>

            {/* Size Filter */}
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="w-[120px] rounded-full" data-testid="size-filter">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {allSizes.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Color Filter */}
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="w-[120px] rounded-full" data-testid="color-filter">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                {allColors.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[150px] rounded-full" data-testid="price-filter">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-20">Under $20</SelectItem>
                <SelectItem value="20-30">$20 - $30</SelectItem>
                <SelectItem value="30-50">$30 - $50</SelectItem>
                <SelectItem value="50-999">$50+</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              onClick={clearFilters}
              variant="outline"
              className="rounded-full"
              data-testid="clear-filters-button"
            >
              <X size={18} className="mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12" data-testid="products-grid">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Our Collection</h2>
          <p className="text-gray-600">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters</p>
            <Button onClick={clearFilters} className="rounded-full" data-testid="no-products-clear-button">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;