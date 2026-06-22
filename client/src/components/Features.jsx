import {
  Building2,
  MapPin,
  Brain,
  Star,
  Calendar,
  Scale,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: <Building2 size={40} />,
      title: "Hospital Comparison",
      description:
        "Compare hospitals based on ratings, reviews, services and pricing.",
    },
    {
      icon: <MapPin size={40} />,
      title: "Nearby Hospitals",
      description:
        "Find hospitals near your current location with distance calculation.",
    },
    {
      icon: <Brain size={40} />,
      title: "AI Healthcare Advisor",
      description:
        "Get AI-powered recommendations for treatments, hospitals and services.",
    },
    {
      icon: <Star size={40} />,
      title: "Reviews & Ratings",
      description:
        "Read verified patient reviews and discover top-rated hospitals.",
    },
    {
      icon: <Calendar size={40} />,
      title: "Appointment Booking",
      description:
        "Book appointments instantly with hospitals and healthcare providers.",
    },
    {
      icon: <Scale size={40} />,
      title: "Smart Service Comparison",
      description:
        "Compare MRI scans, CT scans, blood tests and hundreds of healthcare services.",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-gray-900">
            Why Choose MediCompare AI?
          </h2>

          <p className="text-gray-600 mt-4 text-lg max-w-3xl mx-auto">
            Everything you need to discover,
            compare and book the best healthcare
            services with AI-powered insights.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >

              <div className="text-blue-600 mb-5">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;