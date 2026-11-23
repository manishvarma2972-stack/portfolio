import { profile } from "@/content/profile";
import { navItems } from "@/content/nav";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 bg-inv text-inv-fg">
      <div className="container-x">
      <div className="grid gap-10 border-t border-inv-fg/15 py-12 md:grid-cols-12" data-footer>
        <div className="md:col-span-5">
          <p className="font-serif text-2xl">{profile.name}</p>
          <p className="mt-1 text-sm text-inv-fg/60">{profile.role}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-4">
          <ul className="grid grid-cols-2 gap-y-2 text-sm text-inv-fg/70">
            {navItems.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="link-underline hover:text-inv-fg">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="space-y-2 text-sm text-inv-fg/70 md:col-span-3 md:text-right">
          <li><a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-inv-fg">GitHub</a></li>
          <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-inv-fg">LinkedIn</a></li>
          <li><a href={`mailto:${profile.email}`} className="link-underline hover:text-inv-fg">Email</a></li>
        </ul>
        <p className="font-mono text-xs text-inv-fg/60 md:col-span-12">
          © {year} {profile.name}. Built with Next.js and AI-assisted development.
        </p>
      </div>
      </div>
    </footer>
  );
}
