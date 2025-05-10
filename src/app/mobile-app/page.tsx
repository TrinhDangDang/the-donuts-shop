export default function AppPage() {
  return (
    <main className="min-h-screen px-6 py-10 bg-white text-gray-800 font-[family-name:var(--font-open-sans)]">
      <h1 className="text-4xl font-display text-amber-700 mb-6 text-center">
        Get the Mobile App
      </h1>
      <p className="text-center text-lg mb-10 text-gray-600">
        Order ahead, earn rewards, and get exclusive deals with our app.
      </p>

      <div className="flex flex-col items-center gap-6">
        <img
          src="/images/app-preview.png"
          alt="Mobile App Preview"
          className="w-full max-w-md rounded-lg shadow"
        />

        <div className="flex gap-4 mt-4">
          <a
            href="#"
            className="bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800"
          >
            Download on the App Store
          </a>
          <a
            href="#"
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-500"
          >
            Get it on Google Play
          </a>
        </div>
      </div>
    </main>
  );
}
