import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { useSocialLinks } from '@/hooks/useSocialLinks';

export const Footer = () => {
  const { data: socialLinks } = useSocialLinks();

  const socialIcons = [
    { icon: Facebook, href: socialLinks?.facebook, label: "Facebook" },
    { icon: Instagram, href: socialLinks?.instagram, label: "Instagram" },
    { icon: Youtube, href: socialLinks?.youtube, label: "YouTube" },
  ];

  return (
    <footer className="bg-[#222222] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-8">
          {socialIcons.map(({ icon: Icon, href, label }) => 
            href ? (
              <a 
                key={label}
                href={href}
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary-100 transition-colors"
                aria-label={label}
              >
                <Icon size={32} />
              </a>
            ) : null
          )}
        </div>
        <div className="mt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Outdoor Energy Adventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};