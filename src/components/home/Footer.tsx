import React from 'react';
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="mb-2">Email: info@outdoorenergyadventures.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate("/events")} className="hover:text-primary-100 transition-colors">Events</button></li>
              <li><button onClick={() => navigate("/about")} className="hover:text-primary-100 transition-colors">About Us</button></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-100 transition-colors">Facebook</a>
              <a href="#" className="hover:text-primary-100 transition-colors">Instagram</a>
              <a href="#" className="hover:text-primary-100 transition-colors">Twitter</a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Outdoor Energy Adventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};