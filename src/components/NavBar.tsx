import Link from "next/link";

export default function TopAppBar() {
  return (
    <header className="flex items-center px-4 py-6 shadow-md bg-white">
      <div className="text-2xl text-amber-700 font-[family-name:var(--font-open-sans)]">
        The Donuts Shop
      </div>
      <nav className="flex flex-1 justify-between ml-8 font-[family-name:var(--font-open-sans)]">
        {/* Left navigation items */}
        <ul className="flex space-x-6 text-gray-700">
          <li>
            <Link href="/menu" className="hover:text-amber-500">
              Menu
            </Link>
          </li>
          <li className="hover:text-amber-600 cursor-pointer">
            <Link href="/rewards">Rewards</Link>
          </li>
          <li className="hover:text-amber-600 cursor-pointer">
            <Link href="/location">Location</Link>
          </li>
          <li className="hover:text-amber-600 cursor-pointer">
            <Link href="/mobile-app">App</Link>
          </li>
        </ul>

        {/* Right navigation items */}
        <ul className="flex space-x-6 text-gray-700">
          <li className="hover:text-amber-600 cursor-pointer">Join Rewards</li>
          <li className="hover:text-amber-600 cursor-pointer">Log in</li>
          <li className="hover:text-amber-600 cursor-pointer">Cart</li>
        </ul>
      </nav>
    </header>
  );
}
