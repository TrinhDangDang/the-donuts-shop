"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/store/authSlice"; // adjust path as needed

export default function TopAppBar() {
  const token = useSelector(selectCurrentToken); // Get auth state from Redux

  return (
    <header className="flex items-center px-4 py-6 shadow-md bg-white">
      <div className="text-2xl text-amber-700 font-[family-name:var(--font-open-sans)]">
        <Link href="/">The Donuts Shop</Link>
      </div>
      <nav className="flex flex-1 justify-between ml-8 font-[family-name:var(--font-open-sans)]">
        {/* Left navigation items (always visible) */}
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
        </ul>

        {/* Right navigation items (conditional) */}
        <ul className="flex space-x-6 text-gray-700">
          {token ? (
            // Logged-in state
            <>
              <li>
                <Link
                  href="/account"
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-600 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-600 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  My Orders
                </Link>
              </li>
              <li className="hover:text-amber-600 cursor-pointer">Cart</li>
              <li>
                <Link
                  href="/api/auth/signout"
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-600 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  Logout
                </Link>
              </li>
            </>
          ) : (
            // Guest state
            <>
              <li>
                <Link
                  href="/create-account"
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-600 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  Join Rewards
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-600 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  Log in
                </Link>
              </li>
              <li className="hover:text-amber-600 cursor-pointer">Cart</li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
