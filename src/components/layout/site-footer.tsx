const footerLinks = ["Buy", "Rent", "Sell", "Commercial", "Agents", "Support"];

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className="text-xl font-semibold text-zinc-950">PropertyDekho</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Premium property discovery for residential and commercial real
            estate across Bhilai and nearby growth corridors.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-zinc-600">
          {footerLinks.map((link) => (
            <a key={link} href="#" className="transition hover:text-zinc-950">
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
