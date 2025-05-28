import Link from "next/link";
export default function RewardsPage() {
  const rewards = [
    {
      title: "🎉 Sign-Up Bonus",
      description: "Get 50 points just for joining the rewards program.",
      points: "+50 pts",
    },
    {
      title: "☕ Free Coffee",
      description: "Earn a free coffee after your 5th drink purchase.",
      points: "5 drinks",
    },
    {
      title: "🍩 Donut Perks",
      description: "Redeem 100 points for your favorite donut, anytime!",
      points: "100 pts",
    },
    {
      title: "⭐ Double Points Days",
      description: "Every Wednesday, earn double points on all purchases!",
      points: "2x pts",
    },
    {
      title: "🎂 Birthday Treat",
      description: "Get a free dessert during your birthday month!",
      points: "Special",
    },
    {
      title: "💎 VIP Status",
      description: "Reach 500 points for exclusive member benefits.",
      points: "500 pts",
    },
  ];

  return (
    <main className="min-h-screen px-4 py-12 bg-amber-50 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-4">
            Rewards Program
          </h1>
          <p className="text-lg md:text-xl text-amber-700 max-w-2xl mx-auto">
            Earn points with every order and unlock delicious rewards!
          </p>
        </section>

        {/* Rewards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, index) => (
            <div
              key={index}
              className="bg-white border border-amber-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-amber-800">
                  {reward.title}
                </h2>
                <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
                  {reward.points}
                </span>
              </div>
              <p className="text-gray-600">{reward.description}</p>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to start earning?
          </h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Join our rewards program today and get your first 50 points
            instantly!
          </p>
          <Link href="/create-account" passHref>
            <button className="bg-white text-amber-800 font-semibold px-6 py-3 rounded-lg hover:bg-amber-100 transition-colors duration-300 shadow-md">
              Sign Up Now
            </button>
          </Link>
        </section>
      </div>
    </main>
  );
}
