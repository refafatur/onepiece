"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "ELBAPH", href: "#scene-1" },
  { label: "VOYAGE", href: "#scene-2" },
  { label: "CAPTAIN", href: "#scene-3" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state
      setScrolled(currentScrollY > 50);
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setHidden(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`voyage-header${scrolled ? " scrolled" : ""}${hidden ? " hidden" : ""}`}>
      <a
        className="voyage-brand"
        href="#scene-1"
        aria-label="One Piece — back to top"
        onClick={() => setMenuOpen(false)}
      >
        <img src="/assets/logo1.png" alt="One Piece" className="voyage-brand__logo" />
      </a>

      <button
        className={`menu-toggle${menuOpen ? " is-open" : ""}`}
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="voyage-menu"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        <span />
        <span />
      </button>

      <nav
        id="voyage-menu"
        className={`voyage-menu${menuOpen ? " is-open" : ""}`}
        aria-label="Main navigation"
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
        <span className="voyage-menu__edition">STRAW HAT CREW <i>•</i> SINCE EAST BLUE</span>
      </nav>
    </header>
  );
}
