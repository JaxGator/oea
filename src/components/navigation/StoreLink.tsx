interface StoreLinkProps {
  href: string;
  label: string;
}

export function StoreLink({ href, label }: StoreLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary-100 transition-colors"
    >
      {label}
    </a>
  );
}