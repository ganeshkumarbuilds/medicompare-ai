import {
  Search,
  Scale,
  Brain,
  CalendarCheck,
} from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      icon: <Search size={40} />,
      title: "Search Hospitals",
      description:
        "Browse hospitals by city, ratings, reviews and healthcare services.",
    },
    {
      icon: <Scale size={40} />,
      title: "Compare Services",
      description:
        "Compare MRI scans, CT scans, blood tests and hundreds of healthcare services.",
    },
    {
      icon: <Brain size={40} />,
      title: "Get AI Recommendation",
      description:
        "Our AI analyzes ratings, reviews, prices and distance to recommend the best hospital.",
    },
    {
      icon: <CalendarCheck size={40} />,
      title: "Book Appointment",
      description:
        "Book healthcare services instantly and manage appointments online.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-gray-900">
            How It Works
          </h2>

          <p className="text-lg text-gray-600 mt-4">
            Find the right hospital in just a few simple steps.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-gray-50 p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >

              <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                {step.icon}
              </div>

              <h3 className="text-2xl font-bold mb-3">
                {step.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;