export default function LocationPage() {
  return (
    <main className="min-h-screen px-6 py-12 bg-white text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-700 mb-4">
            Our Donut Shops
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visit us at any of our locations or get in touch
          </p>
        </header>

        <div className="space-y-16">
          {/* Locations Section */}
          <section>
            <h2 className="text-2xl font-semibold text-amber-800 mb-6 pb-2 border-b border-amber-100">
              Our Locations
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Downtown",
                  address: "123 Main Street",
                  city: "Cityville, ST 12345",
                  hours: "6AM-9PM Daily",
                  phone: "(555) 123-4567",
                },
                {
                  name: "Uptown",
                  address: "456 Oak Avenue",
                  city: "Cityville, ST 12345",
                  hours: "6AM-9PM Daily",
                  phone: "(555) 987-6543",
                },
                {
                  name: "Westside",
                  address: "789 Elm Boulevard",
                  city: "Cityville, ST 12345",
                  hours: "6AM-9PM Daily",
                  phone: "(555) 456-7890",
                },
              ].map((location, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <h3 className="text-xl font-semibold text-amber-800 mb-2">
                    {location.name}
                  </h3>
                  <address className="not-italic">
                    <p className="text-gray-700">{location.address}</p>
                    <p className="text-gray-700 mb-4">{location.city}</p>
                  </address>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Hours:</span>{" "}
                      {location.hours}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span>{" "}
                      {location.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-amber-50 rounded-lg p-8 border border-amber-100">
            <h2 className="text-2xl font-semibold text-amber-800 mb-6 pb-2 border-b border-amber-200">
              Contact Us
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  General Inquiries
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-3 text-amber-700">✉️</span>
                    <span>
                      Email:{" "}
                      <a
                        href="mailto:hello@donutshop.com"
                        className="text-amber-700 hover:underline"
                      >
                        hello@donutshop.com
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-amber-700">📞</span>
                    <span>
                      Phone:{" "}
                      <a
                        href="tel:+15551234567"
                        className="text-amber-700 hover:underline"
                      >
                        (555) 123-4567
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-amber-700">📍</span>
                    <span>Corporate Office: 123 Donut Lane, Suite 100</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-amber-700 hover:text-amber-800">
                    <span className="sr-only">Facebook</span>
                    <span className="text-2xl">📘</span>
                  </a>
                  <a href="#" className="text-amber-700 hover:text-amber-800">
                    <span className="sr-only">Instagram</span>
                    <span className="text-2xl">📷</span>
                  </a>
                  <a href="#" className="text-amber-700 hover:text-amber-800">
                    <span className="sr-only">Twitter</span>
                    <span className="text-2xl">🐦</span>
                  </a>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Newsletter Signup
                  </h4>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500 flex-grow"
                    />
                    <button className="bg-amber-600 text-white px-4 py-2 rounded-r-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
