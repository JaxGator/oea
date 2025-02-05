
import { ReactNode } from "react";

interface AdminUserTableWrapperProps {
  children: ReactNode;
}

export function AdminUserTableWrapper({ children }: AdminUserTableWrapperProps) {
  return (
    <div 
      className="relative overflow-x-auto sm:overflow-visible bg-white rounded-lg border"
      role="region"
      aria-label="User management table"
      tabIndex={0}
    >
      <div className="w-full min-w-full align-middle">
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
