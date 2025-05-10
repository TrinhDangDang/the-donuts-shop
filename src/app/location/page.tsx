export default function LocationPage() {
  return (
    <main className="min-h-screen px-6 py-10 bg-white text-gray-800 font-[family-name:var(--font-open-sans)]">
      <h1 className="text-4xl font-display text-amber-700 mb-6 text-center">
        Find a Location
      </h1>
      <p className="text-center text-lg mb-10 text-gray-600">
        Locate the nearest Donuts Shop and get your favorite treat fast.
      </p>

      <div className="w-full max-w-4xl mx-auto">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3..."
          loading="lazy"
          allowFullScreen
          className="w-full h-[400px] rounded-lg border border-gray-300"
        />
      </div>
    </main>
  );
}
