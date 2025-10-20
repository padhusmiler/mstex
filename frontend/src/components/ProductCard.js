import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0
    ? `${process.env.REACT_APP_BACKEND_URL}${product.images[0].url}`
    : 'https://via.placeholder.com/300x400?text=No+Image';

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl"
      data-testid={`product-card-${product.id}`}
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
        <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full font-bold text-sm">
          ₹{product.price}
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-xs">
            Only {product.stock} left!
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {product.category}
          </span>
          <div className="flex space-x-1">
            {product.colors && product.colors.slice(0, 3).map((color, idx) => (
              <div
                key={idx}
                className="w-5 h-5 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Sizes: {product.sizes && product.sizes.join(', ')}
          </div>
        </div>

        <button className="mt-4 w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-3 rounded-full hover:shadow-lg flex items-center justify-center space-x-2">
          <ShoppingCart size={18} />
          <span>View Details</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;