import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TermsAndConditions() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'terms_and_conditions_content')
        .single();

      if (error) {
        console.error('Error fetching terms and conditions:', error);
        return;
      }

      setContent(data?.value || '');
    };

    fetchContent();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms and Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  );
}