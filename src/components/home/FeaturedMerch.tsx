import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthState } from "@/hooks/useAuthState";
import { ShoppingBag, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PrintfulProduct {
  id: number;
  name: string;
  thumbnail_url: string;
  retail_price: string;
}

export const FeaturedMerch = () => {
  const { profile } = useAuthState();
  const { toast } = useToast();
  const [products, setProducts] = useState<PrintfulProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const canAccessStore = profile?.is_member || profile?.is_admin;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from Printful...');
        const { data, error } = await supabase.functions.invoke('get-printful-store');
        
        if (error) {
          console.error('Supabase function error:', error);
          throw error;
        }

        if (!data || !data.result) {
          console.error('Invalid data format received:', data);
          throw new Error('Invalid data format received from Printful');
        }

        console.log('Received products:', data.result);

        // Take the first 3 products
        const formattedProducts = data.result.slice(0, 3).map((product: any) => ({
          id: product.id,
          name: product.name,
          thumbnail_url: product.thumbnail_url,
          retail_price: product.retail_price,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error loading products",
          description: "Unable to load store products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (canAccessStore) {
      fetchProducts();
    } else {
      setIsLoading(false);
    }
  }, [canAccessStore, toast]);

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
        {canAccessStore && (
          <Button
            variant="outline"
            onClick={() => window.open('https://outdoorenergyadventures.printful.me/', '_blank')}
          >
            Visit Store
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="aspect-square overflow-hidden rounded-lg mb-4">
                  <img
                    src={product.thumbnail_url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-blue-700 font-medium">${product.retail_price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      )}
    </div>
  );
};