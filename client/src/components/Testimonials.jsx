import { Star } from "lucide-react";

function Testimonials() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Software Engineer",
      review:
        "MediCompare AI helped me compare hospitals and find the best MRI service near my location. The booking process was very smooth.",
    },
    {
      name: "Priya Reddy",
      role: "Healthcare Professional",
      review:
        "The AI recommendations and hospital comparison features are impressive. Patients can make better healthcare decisions easily.",
    },
    {
      name: "Amit Kumar",
      role: "Student",
      review:
        "I compared multiple hospitals, checked reviews, and booked an appointment within minutes. Very useful platform.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-gray-900">
            What Our Users Say
          </h2>

          <p className="text-lg text-gray-600 mt-4">
            Trusted by patients and healthcare seekers across India.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >

              <div className="flex mb-4">

                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                "{item.review}"
              </p>

              <div>

                <h4 className="font-bold text-lg text-gray-900">
                  {item.name}
                </h4>

                <p className="text-sm text-gray-500">
                  {item.role}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;