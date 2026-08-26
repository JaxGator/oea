import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/hooks/useAuthState";
import { UserMenu } from "@/components/navigation/UserMenu";

const NAV_ITEMS = [
  { label: "Events", to: "/event" },
  { label: "Calendar", to: "/calendar" },
  { label: "Gallery", to: "/gallery" },
  { label: "Resources", to: "/resources" },
  { label: "About", to: "/about" },
];

const INVITE_EMAIL = "mailto:support@outdoorenergyadventures.org";

export function SiteHeader() {
  const { user, profile } = useAuthState();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? "text-accent" : "text-foreground hover:text-accent"
    }`;

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-primary text-primary-foreground">
        <div className="oea-container flex items-center justify-center gap-2 py-2 text-center text-xs sm:text-sm">
          <span className="opacity-80">Private Jacksonville adventure group</span>
          <span className="font-bold text-accent">Friends &amp; friends-of-friends only</span>
        </div>
      </div>

      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="oea-container flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="Outdoor Energy Adventures logo"
              className="h-12 w-12 rounded-full object-contain"
              width={48}
              height={48}
            />
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-base font-bold">Outdoor Energy Adventures</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Private event group · Est. 2022
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <UserMenu user={user} profile={profile} />
            ) : (
              <>
                <Button asChild variant="ghost" className="rounded-full font-semibold">
                  <Link to="/auth">Log in</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-accent font-semibold text-accent-foreground shadow-glow hover:bg-accent/90"
                >
                  <a href={INVITE_EMAIL}>Request Invite</a>
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {open && (
          <nav className="border-t border-border bg-background lg:hidden" aria-label="Mobile">
            <div className="oea-container flex flex-col py-3">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-3 text-sm font-semibold hover:bg-secondary"
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                {user ? (
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/profile" onClick={() => setOpen(false)}>
                      My profile
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link to="/auth" onClick={() => setOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <Button asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <a href={INVITE_EMAIL}>Request Invite</a>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
