
import { ReactNode } from "react";

interface AdminUserTableWrapperProps {
  children: ReactNode;
}

export function AdminUserTableWrapper({ children }: AdminUserTableWrapperProps) {
  return (
    <div 
      className="relative overflow-x-auto -mx-4 sm:mx-0 sm:overflow-visible"
      role="region"
      aria-label="User management table"
      tabIndex={0}
    >
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden md:rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
