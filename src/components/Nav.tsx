import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-ink text-stone">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-lg tracking-tight">
          Your Name
        </Link>
        <nav className="hidden sm:flex items-center gap-8 font-mono-label text-xs uppercase">
          <a href="#capabilities" className="hover:text-marigold transition-colors">
            Capabilities
          </a>
          <a href="#work" className="hover:text-marigold transition-colors">
            Work
          </a>
          <Link href="/pay" className="hover:text-marigold transition-colors">
            Pay an invoice
          </Link>
          <a
            href="#contact"
            className="rounded-full bg-marigold px-4 py-2 text-ink hover:bg-marigold-dark transition-colors"
          >
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  );
}
