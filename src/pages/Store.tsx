import { Card } from "@/components/ui/card";

export default function Store() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">OEA Store</h1>
        <div className="w-full aspect-[4/3]">
          <iframe
            src="https://outdoorenergyadventures.printful.me/"
            className="w-full h-full border-0"
            title="Printful Store"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        </div>
      </Card>
    </div>
  );
}