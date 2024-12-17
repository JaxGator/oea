import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Auth() {
  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png" 
              alt="Logo" 
              className="h-16 w-auto mb-2"
            />
          </div>
          <CardTitle className="text-center">Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Authentication has been reset and is ready to be configured.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}