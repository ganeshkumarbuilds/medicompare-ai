import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}

          <div>

            <h3 className="text-3xl font-bold text-blue-400">
              🏥 MediCompare AI
            </h3>

            <p className="text-gray-400 mt-4 leading-relaxed">
              Compare hospitals, healthcare
              services, ratings and reviews.
              Get AI-powered recommendations
              and book appointments instantly.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h4 className="font-bold text-lg mb-5">
              Quick Links
            </h4>

            <ul className="space-y-3 text-gray-400">

              <li>
                <Link
                  to="/"
                  className="hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/hospitals"
                  className="hover:text-white"
                >
                  Hospitals
                </Link>
              </li>

              <li>
                <Link
                  to="/compare"
                  className="hover:text-white"
                >
                  Compare
                </Link>
              </li>

              <li>
                <Link
                  to="/ai-chat"
                  className="hover:text-white"
                >
                  AI Chat
                </Link>
              </li>

            </ul>

          </div>

          {/* Services */}

          <div>

            <h4 className="font-bold text-lg mb-5">
              Services
            </h4>

            <ul className="space-y-3 text-gray-400">

              <li>MRI Scan</li>

              <li>CT Scan</li>

              <li>Blood Test</li>

              <li>Health Checkups</li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h4 className="font-bold text-lg mb-5">
              Contact
            </h4>

            <div className="space-y-4 text-gray-400">

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>
                  support@medicompareai.com
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>
                  +91 98765 43210
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <span>
                  Hyderabad, Telangana
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">

          <p className="text-gray-500">
            © 2026 MediCompare AI.
            All rights reserved.
          </p>

          <p className="text-gray-500 mt-4 md:mt-0">
            Built with ❤️ using MERN + AI
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;