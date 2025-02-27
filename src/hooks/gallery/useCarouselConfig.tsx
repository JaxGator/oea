
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useCarouselConfig() {
  const [carouselEnabled, setCarouselEnabled] = useState(false);

  const fetchCarouselConfig = async () => {
    try {
      console.log('Fetching carousel configuration...');
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'gallery_carousel_enabled')
        .single();

      if (error) throw error;
      
      console.log('Carousel config fetched:', data?.value);
      setCarouselEnabled(data?.value === 'true');
    } catch (error) {
      console.error('Error fetching carousel config:', error);
      toast.error("Failed to fetch carousel configuration");
    }
  };

  const updateCarouselConfig = async (enabled: boolean) => {
    try {
      console.log('Updating carousel configuration:', enabled);
      const { error } = await supabase
        .from('site_config')
        .upsert({
          key: 'gallery_carousel_enabled',
          value: enabled.toString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      console.log('Carousel configuration updated successfully');
      setCarouselEnabled(enabled);
      toast.success(`Gallery carousel ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating carousel config:', error);
      toast.error("Failed to update carousel settings");
      setCarouselEnabled(!enabled);
    }
  };

  useEffect(() => {
    fetchCarouselConfig();
  }, []);

  return { carouselEnabled, updateCarouselConfig };
}
