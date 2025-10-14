import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto" data-testid="footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              MS TEX
            </h3>
            <p className="text-gray-400 mb-3">
              Premium knitted clothing from Tiruppur, Tamil Nadu.
            </p>
            <p className="text-gray-500 text-sm">
              Your destination for high-quality T-shirts and knitted wear.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-orange-400">Home</a></li>
              <li><a href="/" className="text-gray-400 hover:text-orange-400">Shop</a></li>
              <li><a href="/orders" className="text-gray-400 hover:text-orange-400">Orders</a></li>
              <li><a href="/profile" className="text-gray-400 hover:text-orange-400">Profile</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@trendyshirts.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Fashion St, NY</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 hover:bg-orange-600 rounded-full">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-orange-600 rounded-full">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-orange-600 rounded-full">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-orange-600 rounded-full">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 TrendyShirts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;