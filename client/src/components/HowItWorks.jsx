import { Upload, Brain, BadgeIndianRupee } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      icon: <Upload size={40} />,
      title: "Upload Prescription",
      description:
        "Upload your prescription or enter medicine details manually.",
    },
    {
      icon: <Brain size={40} />,
      title: "AI Analysis",
      description:
        "Claude AI analyzes medicines and finds equivalent alternatives.",
    },
    {
      icon: <BadgeIndianRupee size={40} />,
      title: "Compare & Save",
      description:
        "View cheaper alternatives, compare prices, and save money.",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            How It Works
          </h2>

          <p className="text-lg text-gray-600 mt-4">
            Compare medicines in just a few clicks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                {step.icon}
              </div>

              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <h3 className="text-xl font-bold mb-3">
                {step.title}
              </h3>

              <p className="text-gray-600">
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