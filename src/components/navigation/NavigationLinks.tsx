import { Link } from "react-router-dom";

interface NavigationLink {
  to: string;
  label: string;
}

interface NavigationLinksProps {
  links: NavigationLink[];
  user: any;
}

export function NavigationLinks({ links, user }: NavigationLinksProps) {
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
      {user && (
        <li>
          <Link
            to="/members"
            className="hover:text-primary-100 transition-colors"
          >
            Members
          </Link>
        </li>
      )}
    </ul>
  );
}