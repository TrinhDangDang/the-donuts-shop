"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  logOut,
  selectCurrentRole,
  selectCurrentToken,
} from "@/store/authSlice";
import { useRouter } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  visible: boolean;
  onClick?: () => void;
}

export default function TopAppBar() {
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentRole);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logOut());
    router.push("/");
  };

  // Common nav item styling
  const navItemClass =
    "relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-600 after:w-0 hover:after:w-full after:transition-all after:duration-300";

  // Navigation items configuration
  const leftNavItems: NavItem[] = [
    { href: "/menu", label: "Menu", visible: true },
    { href: "/rewards", label: "Rewards", visible: true },
    { href: "/location", label: "Location", visible: true },
  ];

  const rightNavItems: NavItem[] = token
    ? [
        {
          href: role === "customer" ? "/account" : "/admin-orders",
          label: role === "customer" ? "My Account" : "Orders",
          visible: true,
        },
        { href: "/cart", label: "Cart", visible: true },
        {
          href: "#",
          label: "Logout",
          visible: true,
          onClick: handleLogout,
        },
      ]
    : [
        { href: "/create-account", label: "Join Rewards", visible: true },
        { href: "/signin", label: "Log in", visible: true },
        { href: "/cart", label: "Cart", visible: true },
      ];

  return (
    <header className="flex items-center px-4 py-6 shadow-md bg-white">
      <div className="text-2xl text-amber-700 font-[family-name:var(--font-open-sans)]">
        <Link href="/">The Donuts Shop</Link>
      </div>

      <nav className="flex flex-1 justify-between ml-8 font-[family-name:var(--font-open-sans)]">
        {/* Left navigation items */}
        <ul className="flex space-x-6 text-gray-700">
          {leftNavItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={navItemClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right navigation items */}
        <ul className="flex space-x-6 text-gray-700">
          {rightNavItems.map((item) => (
            <li key={item.href}>
              {item.onClick ? (
                <button onClick={item.onClick} className={navItemClass}>
                  {item.label}
                </button>
              ) : (
                <Link href={item.href} className={navItemClass}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
