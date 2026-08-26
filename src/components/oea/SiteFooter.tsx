import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useSocialLinks } from "@/hooks/useSocialLinks";

export function SiteFooter() {
  const { data: socialLinks } = useSocialLinks();

  const socials = [
    { icon: Facebook, href: socialLinks?.facebook, label: "Facebook" },
    { icon: Instagram, href: socialLinks?.instagram, label: "Instagram" },
    { icon: Youtube, href: socialLinks?.youtube, label: "YouTube" },
  ].filter((s) => !!s.href);

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="oea-container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">Outdoor Energy Adventures</p>
          <p className="mt-3 max-w-xs text-sm opacity-75">
            A private, friends-based adventure group in Jacksonville and Northeast Florida.
            Kayaks, trails, tacos, good people.
          </p>
        </div>

        <div>
          <p className="oea-eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/event" className="opacity-80 hover:opacity-100">Events</Link></li>
            <li><Link to="/calendar" className="opacity-80 hover:opacity-100">Calendar</Link></li>
            <li><Link to="/gallery" className="opacity-80 hover:opacity-100">Gallery</Link></li>
            <li><Link to="/resources" className="opacity-80 hover:opacity-100">Resources</Link></li>
            <li><Link to="/about" className="opacity-80 hover:opacity-100">About</Link></li>
          </ul>
        </div>

        <div>
          <p className="oea-eyebrow">Join us</p>
          <p className="mt-4 text-sm opacity-80">
            Events are for friends and friends-of-friends. Ask a member to vouch for you, or
            email us.
          </p>
          <a
            href="mailto:support@outdoorenergyadventures.org"
            className="mt-3 inline-block text-sm font-semibold text-accent hover:underline"
          >
            support@outdoorenergyadventures.org
          </a>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href!} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon className="h-5 w-5 opacity-80 transition-opacity hover:opacity-100" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="oea-container flex flex-col items-center justify-between gap-3 py-5 text-xs opacity-70 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Outdoor Energy Adventures. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:underline">Terms and Conditions</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
