import Link from "next/link";

export default function TopAppBar() {
  return (
    <header className="flex items-center px-4 py-6 shadow-md bg-white">
      <div className="text-2xl text-amber-700 font-[family-name:var(--font-open-sans)]">
        <Link href="/">The Donuts Shop</Link>
      </div>
      <nav className="flex flex-1 justify-between ml-8 font-[family-name:var(--font-open-sans)]">
        {/* Left navigation items */}
        <ul className="flex space-x-6 text-gray-700">
          <li>
            <Link
              href="/menu"
              className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-600 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              href="/rewards"
              className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-600 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Rewards
            </Link>
          </li>
          <li>
            <Link
              href="/location"
              className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-600 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Location
            </Link>
          </li>
          <li>
            <Link
              href="/mobile-app"
              className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-600 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              App
            </Link>
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
