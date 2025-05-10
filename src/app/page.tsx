import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-6 bg-white text-gray-800 font-[family-name:var(--font-open-sans)] space-y-16">
      {/* Hero Section */}
      <div className="relative w-full h-[700px]">
        <Image
          src="/images/menu/matcha-donuts.png"
          alt="Matcha Donuts"
          fill
          className="object-cover rounded"
          quality={100}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white text-center rounded">
          <h1 className="text-4xl font-display mb-2">Matcha Donuts</h1>
          <p className="text-lg">Current Favorite. Limited Time Only.</p>
        </div>
        <Link
          href="/order/matcha-donut"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-amber-50 transition"
        >
          Get Yours Now
        </Link>
      </div>

      {/* Rewards Section */}
      <div className="w-full text-center px-6">
        <h2 className="text-4xl font-display mb-2 text-amber-700">Rewards</h2>
        <p className="text-lg text-gray-700">
          Earn points with every purchase and unlock free treats!
        </p>
      </div>

      {/* $4 Breakfast Promo Section */}
      <div className="w-full h-[500px] flex flex-col md:flex-row items-center justify-between px-6 gap-8">
        {/* Text Side */}
        <div className="md:w-1/2 text-left">
          <h2 className="text-4xl font-display mb-4 text-amber-700">
            $4 Breakfast Deal
          </h2>
          <p className="text-lg text-gray-700">
            A fresh start with coffee and a classic donut — all for just four
            bucks!
          </p>
        </div>

        {/* Image Side */}
        <div className="md:w-1/2 relative h-full">
          <Image
            src="/images/menu/current-promotion.png"
            alt="Breakfast Promotion"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Location Section */}
      <div className="w-full text-center px-6">
        <h2 className="text-4xl font-display mb-2 text-amber-700">Locations</h2>
        <p className="text-lg text-gray-700">
          Find your nearest Donuts Shop and grab your favorite treat today!
        </p>
      </div>
    </main>
  );
}
