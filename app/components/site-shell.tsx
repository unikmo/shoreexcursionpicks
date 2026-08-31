import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="cse-nav">
      <Link className="cse-brand" href="/" aria-label="Shore Excursion Picks home">
        <span className="cse-brand-mark">SEP</span>
        <span>Shore Excursion Picks</span>
      </Link>
      <nav className="cse-nav-links" aria-label="Main navigation">
        <Link href="/ports">All ports</Link>
        <Link href="/methodology">How we pick</Link>
        <Link className="cse-nav-cta" href="/ports">Choose your port</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="cse-footer">
      <div className="cse-brand">
        <span className="cse-brand-mark">SEP</span>
        <span>Shore Excursion Picks</span>
      </div>
      <p><Link href="/methodology">How we choose the picks</Link></p>
      <p>We may earn a commission from qualifying bookings, at no extra cost to you.</p>
    </footer>
  );
}
