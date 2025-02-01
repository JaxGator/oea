import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthState } from "@/hooks/useAuthState";
import { ShoppingBag, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScrapedProduct {
  id: string;
  title: string;
  price: number;
  image_url: string;
}

export const FeaturedMerch = () => {
  const { profile } = useAuthState();
  const { toast } = useToast();
  const [products, setProducts] = useState<ScrapedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const canAccessStore = profile?.is_member || profile?.is_admin;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // First try to get cached products from the database
        const { data: cachedProducts, error: dbError } = await supabase
          .from('scraped_products')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;

        // If we have cached products, use them
        if (cachedProducts && cachedProducts.length > 0) {
          setProducts(cachedProducts);
          setIsLoading(false);
          return;
        }

        // If no cached products, trigger the scraper
        const { data, error } = await supabase.functions.invoke('scrape-printful-store');
        
        if (error) {
          console.error('Scraping error:', error);
          throw error;
        }

        if (!data || !data.products) {
          throw new Error('Invalid data format received from scraper');
        }

        setProducts(data.products);
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
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-blue-700 font-medium">${product.price.toFixed(2)}</p>
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