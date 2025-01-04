import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthState } from "@/hooks/useAuthState";
import { ShoppingBag } from "lucide-react";

export const FeaturedMerch = () => {
  const { profile } = useAuthState();
  const canAccessStore = profile?.is_member || profile?.is_admin;

  const featuredItems = [
    {
      name: "Embroidered Hat",
      image: "https://cdn.printful.me/t/quick-stores/products/w168/15064221-206-67709c96c7922__360",
      price: "$14.50"
    },
    {
      name: "Unisex Two-Sided Cotton T-Shirt",
      image: "https://cdn.printful.me/t/quick-stores/products/w168/15064221-438-67604fc7efd6c__360",
      price: "$15.50"
    },
    {
      name: "Short Sleeve Jersey - Solid",
      image: "https://cdn.printful.me/t/quick-stores/products/w168/15064221-644-676032870e1bf__360",
      price: "$30.00"
    }
  ];

  return (
    <div className="mt-16 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" role="presentation" />
          Member-Only Merch
        </h2>
        {canAccessStore && (
          <Button
            variant="outline"
            onClick={() => window.open('https://outdoorenergyadventures.printful.me/', '_blank')}
          >
            Visit Store
          </Button>
        )}
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
              <p className="text-blue-700 font-medium">{item.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};