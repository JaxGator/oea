import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#222222] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-8">
          <a 
            href="https://www.facebook.com/groups/outdoorenergyadventures" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary-100 transition-colors"
          >
            <Facebook size={32} />
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary-100 transition-colors"
          >
            <Youtube size={32} />
          </a>
        </div>
        <div className="mt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Outdoor Energy Adventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};