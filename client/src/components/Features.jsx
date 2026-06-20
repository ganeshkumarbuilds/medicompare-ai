import {
  Pill,
  IndianRupee,
  Brain,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: <Pill size={40} />,
      title: "Medicine Comparison",
      description:
        "Compare branded medicines with generic alternatives instantly.",
    },
    {
      icon: <IndianRupee size={40} />,
      title: "Save Money",
      description:
        "Find lower-cost medicines and reduce healthcare expenses.",
    },
    {
      icon: <Brain size={40} />,
      title: "AI Recommendations",
      description:
        "Claude AI analyzes prescriptions and suggests alternatives.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Why Choose MediCompare AI?
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            Smart healthcare decisions powered by AI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >
              <div className="text-blue-600 mb-4">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600">
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