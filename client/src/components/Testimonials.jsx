import { Star } from "lucide-react";

function Testimonials() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Software Engineer",
      review:
        "MediCompare AI helped me find cheaper medicine alternatives and save money every month.",
    },
    {
      name: "Priya Reddy",
      role: "Healthcare Professional",
      review:
        "The AI recommendations are accurate and make medicine comparison much easier.",
    },
    {
      name: "Amit Kumar",
      role: "Student",
      review:
        "Simple, fast, and extremely useful. I saved nearly ₹500 on my prescriptions.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            What Our Users Say
          </h2>

          <p className="text-lg text-gray-600 mt-4">
            Trusted by users across India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-2xl border hover:shadow-xl transition"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-6">
                "{item.review}"
              </p>

              <div>
                <h4 className="font-bold text-gray-900">
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