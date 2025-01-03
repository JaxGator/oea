import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const FeaturedMerch = () => {
  const navigate = useNavigate();

  const featuredItems = [
    {
      name: "OEA Classic T-Shirt",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80",
      price: "$24.99"
    },
    {
      name: "Adventure Hoodie",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80",
      price: "$49.99"
    },
    {
      name: "Outdoor Cap",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80",
      price: "$19.99"
    }
  ];

  return (
    <div className="mt-16 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Merchandise</h2>
        <Button onClick={() => navigate('/store')} variant="outline">
          Visit Store
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-primary">{item.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};