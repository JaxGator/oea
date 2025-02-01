import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthState } from "@/hooks/useAuthState";
import { ShoppingBag } from "lucide-react";

const products = [
  {
    id: '1',
    title: 'Columbia Embroidered Short Sleeve Button Shirt',
    price: 55.00,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  },
  {
    id: '2',
    title: 'Unisex Columbia Fleece Jacket',
    price: 58.50,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  },
  {
    id: '3',
    title: 'Backpack',
    price: 32.95,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  },
  {
    id: '4',
    title: 'Embroidered Columbia Booney Hat',
    price: 29.95,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  },
  {
    id: '5',
    title: 'Offtrack Adventure Team Rash Guard - Blue Waves',
    price: 34.00,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  },
  {
    id: '6',
    title: 'Offtrack Adventure Team Rash Guard - Grey',
    price: 34.00,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  },
  {
    id: '7',
    title: 'Offtrack Adventure Team Jersey - Blue Waves',
    price: 30.00,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  },
  {
    id: '8',
    title: 'Offtrack Adventure Team Jersey - Grey',
    price: 30.00,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  },
  {
    id: '9',
    title: 'Offtrack Adventure Team T-Shirt',
    price: 15.50,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  },
  {
    id: '10',
    title: 'Embroidered Hat',
    price: 14.50,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  },
  {
    id: '11',
    title: 'Embroidered Polo',
    price: 20.00,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  },
  {
    id: '12',
    title: 'Embroidered Visor',
    price: 17.50,
    image_url: '/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png'
  }
];

export const FeaturedMerch = () => {
  const { profile } = useAuthState();
  const canAccessStore = profile?.is_member || profile?.is_admin;

  if (!canAccessStore) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Member-Only Merch</h2>
          <p className="text-gray-600">Become a member to access our exclusive merchandise store!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Member-Only Merch
        </h2>
        <Button
          variant="outline"
          onClick={() => window.open('https://outdoorenergyadventures.printful.me/', '_blank')}
        >
          Visit Store
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
              <p className="text-blue-700 font-medium">From ${product.price.toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};