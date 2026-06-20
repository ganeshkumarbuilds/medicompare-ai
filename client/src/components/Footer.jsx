function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-2xl font-bold text-blue-400">
              MediCompare AI
            </h3>

            <p className="text-gray-400 mt-4">
              Compare medicines, discover alternatives,
              and save money with AI-powered insights.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Quick Links
            </h4>

            <ul className="space-y-2 text-gray-400">
              <li>Home</li>
              <li>Compare</li>
              <li>Dashboard</li>
              <li>Login</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Contact
            </h4>

            <p className="text-gray-400">
              support@medicompareai.com
            </p>

            <p className="text-gray-400 mt-2">
              Hyderabad, India
            </p>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          © 2026 MediCompare AI. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;