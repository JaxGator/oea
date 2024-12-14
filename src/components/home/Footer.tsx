import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-8">
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary-100 transition-colors"
          >
            <Facebook size={32} />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary-100 transition-colors"
          >
            <Instagram size={32} />
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
      </div>
    </footer>
  );
};