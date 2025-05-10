export default function RewardsPage() {
  return (
    <main className="min-h-screen px-6 py-10 bg-white text-gray-800 font-[family-name:var(--font-open-sans)]">
      <h1 className="text-4xl font-display text-amber-700 mb-6 text-center">
        Rewards
      </h1>
      <p className="text-center text-lg mb-10 text-gray-600">
        Earn points every time you order and unlock free treats, drinks, and
        more!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="border border-amber-200 rounded-lg p-6 shadow-sm text-center">
          <h2 className="text-xl font-semibold text-amber-700 mb-2">
            🎉 Sign-Up Bonus
          </h2>
          <p className="text-gray-700">
            Get 50 points just for joining the rewards program.
          </p>
        </div>
        <div className="border border-amber-200 rounded-lg p-6 shadow-sm text-center">
          <h2 className="text-xl font-semibold text-amber-700 mb-2">
            ☕ Free Coffee
          </h2>
          <p className="text-gray-700">
            Earn a free coffee after your 5th drink purchase.
          </p>
        </div>
        <div className="border border-amber-200 rounded-lg p-6 shadow-sm text-center">
          <h2 className="text-xl font-semibold text-amber-700 mb-2">
            🍩 Donut Perks
          </h2>
          <p className="text-gray-700">
            Redeem 100 points for your favorite donut, anytime!
          </p>
        </div>
      </div>
    </main>
  );
}
