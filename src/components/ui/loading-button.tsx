
import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  isVerifyingPermission?: boolean;
  permissionDenied?: boolean; 
  permissionMessage?: string;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    isLoading = false, 
    loadingText, 
    children, 
    className, 
    disabled,
    isVerifyingPermission = false,
    permissionDenied = false,
    permissionMessage = "You don't have permission for this action",
    ...props 
  }, ref) => {
    // Determine overall disabled state
    const isDisabled = disabled || isLoading || isVerifyingPermission || permissionDenied;
    
    // Determine what to show
    const showLoading = isLoading;
    const showVerifying = !isLoading && isVerifyingPermission;
    const showPermissionDenied = !isLoading && !isVerifyingPermission && permissionDenied;
    const showNormal = !showLoading && !showVerifying && !showPermissionDenied;
    
    // Button content based on state
    let buttonContent;
    
    if (showLoading) {
      buttonContent = (
        <span className="flex items-center gap-2">
          {loadingText || "Loading..."}
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      );
    } else if (showVerifying) {
      buttonContent = (
        <span className="flex items-center gap-2">
          Checking permissions...
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      );
    } else if (showPermissionDenied) {
      buttonContent = (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-2 text-amber-600">
                Permission required
                <AlertTriangle className="h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{permissionMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      buttonContent = children;
    }
    
    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "relative", 
          permissionDenied && "opacity-70 hover:opacity-70", 
          className
        )}
        aria-busy={isLoading || isVerifyingPermission}
        {...props}
      >
        {buttonContent}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
