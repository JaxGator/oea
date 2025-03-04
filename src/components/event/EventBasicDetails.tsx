
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef, useEffect } from 'react';

interface EventBasicDetailsProps {
  form: UseFormReturn<EventFormValues>;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['link', 'image'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image'
];

export function EventBasicDetails({ form }: EventBasicDetailsProps) {
  const quillRef = useRef<ReactQuill>(null);

  // Ensure proper initialization of ReactQuill
  useEffect(() => {
    // Short timeout to ensure the editor is mounted before we try to access it
    const timer = setTimeout(() => {
      if (quillRef.current && quillRef.current.getEditor) {
        try {
          const editor = quillRef.current.getEditor();
          // Force a refresh of the editor
          editor.update();
        } catch (e) {
          console.error('Error initializing Quill editor:', e);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Event title" 
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex-grow">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <div className="min-h-[300px]">
                <ReactQuill 
                  ref={quillRef}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={field.value || ''}
                  onChange={(content) => {
                    console.log('Quill content updated:', content);
                    // Ensure we're not sending undefined to the form
                    field.onChange(content === '' ? null : content);
                  }}
                  className="bg-white h-full"
                  style={{ minHeight: '250px' }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
