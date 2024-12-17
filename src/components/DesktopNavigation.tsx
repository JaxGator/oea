import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Reusable Navigation Links
const NAV_LINKS = [
  { to: "/events", label: "Events" },
  { to: "/members", label: "Members" },
  { to: "/about", label: "About" },
];

const STORE_LINK = {
  href: "https://outdoorenergyadventures.printful.me/",
  label: "Store",
};

// Component for rendering navigation links
function NavigationLinks({ links }: { links: { to: string; label: string }[] }) {
  return (
    <ul className="flex space-x-8">
      {links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            className="hover:text-primary-100 transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Store Link Component
function StoreLink() {
  return (
    <a
      href={STORE_LINK.href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary-100 transition-colors"
    >
      {STORE_LINK.label}
    </a>
  );
}

// Main Desktop Navigation Component
export function DesktopNavigation() {
  return (
    <nav className="hidden md:block bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="Logo"
              className="h-12"
            />
          </Link>
          <NavigationLinks links={NAV_LINKS} />
          <StoreLink />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-white hover:text-primary-100"
          >
            Contact
          </Button>
        </div>
      </div>
    </nav>
  );
}