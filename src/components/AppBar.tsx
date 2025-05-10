export default function TopAppBar() {
  return (
    <header className="flex items-center px-4 py-2 shadow-md bg-white">
      <div className="text-xl text-pink-600 font-[family-name:var(--font-ultra)]">
        The Donuts Shop
      </div>
      <nav className="flex flex-1 justify-between ml-8">
        {/* Left navigation items */}
        <ul className="flex space-x-6 text-gray-700">
          <li className="hover:text-pink-500 cursor-pointer">Menu</li>
          <li className="hover:text-pink-500 cursor-pointer">Rewards</li>
          <li className="hover:text-pink-500 cursor-pointer">Location</li>
          <li className="hover:text-pink-500 cursor-pointer">App</li>
        </ul>

        {/* Right navigation items */}
        <ul className="flex space-x-6 text-gray-700">
          <li className="hover:text-pink-500 cursor-pointer">
            Join Rewards / Login
          </li>
        </ul>
      </nav>
    </header>
  );
}
