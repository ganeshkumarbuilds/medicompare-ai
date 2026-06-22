import axios from "axios";
import Service from "../models/Service.js";
import { calculateDistance } from "../utils/distance.js";
import Review from "../models/Review.js";


export const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    const hospitals =
      await Hospital.find();

    const services =
      await Service.find()
        .populate("hospitalId");

    const hospitalData = hospitals
      .map(
        (h) => `
Hospital: ${h.name}
City: ${h.city}
Rating: ${h.rating}
`
      )
      .join("\n");

    const serviceData = services
      .slice(0, 200)
      .map(
        (s) => `
Hospital: ${s.hospitalId?.name}
Service: ${s.serviceName}
Price: ₹${s.price}
Category: ${s.category}
`
      )
      .join("\n");

    const aiPrompt = `
You are MediCompare AI.

Database Hospitals:

${hospitalData}

Database Services:

${serviceData}

User Question:

${prompt}

Answer using database information whenever possible.

If user asks:
- best hospital
- cheapest service
- MRI
- CT Scan
- Blood Test
- hospital comparison

Use database data first.

Give concise helpful answers.
`;

    const response =
      await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model:
            "deepseek/deepseek-chat-v3-0324",

          messages: [
            {
              role: "user",
              content: aiPrompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type":
              "application/json",
          },
        }
      );

    res.json({
      reply:
        response.data.choices[0]
          .message.content,
    });
  } catch (error) {
    console.log(
      error.response?.data || error
    );

    res.status(500).json({
      message: "AI request failed",
    });
  }
};


export const recommendHospital = async (
  req,
  res
) => {
  try {
    const {
      treatment,
      budget,
      latitude,
      longitude,
    } = req.body;

    const services = await Service.find()
      .populate("hospitalId");

    const matchingServices =
      services.filter((service) =>
        service.serviceName
          .toLowerCase()
          .includes(
            treatment.toLowerCase()
          )
      );

    if (
      matchingServices.length === 0
    ) {
      return res.status(404).json({
        message:
          "No matching services found",
      });
    }

    const hospitalData =
      matchingServices
        .map((service) => {
          const distance =
            calculateDistance(
              Number(latitude),
              Number(longitude),
              service.hospitalId.latitude,
              service.hospitalId.longitude
            );

          return `
          Hospital ID: ${service.hospitalId._id}
Hospital Name: ${service.hospitalId.name}
Address: ${service.hospitalId.address}
City: ${service.hospitalId.city}
State: ${service.hospitalId.state}
Rating: ${service.hospitalId.rating}
Distance: ${distance.toFixed(2)} km

Service: ${service.serviceName}
Price: ₹${service.price}
Duration: ${service.duration} minutes
`;
        })
        .join("\n");

    const prompt = `
You are an AI Hospital Advisor.

Available Hospitals:

${hospitalData}

User Treatment:
${treatment}

User Budget:
₹${budget}

Choose the BEST hospital.

Consider:
1. Distance
2. Rating
3. Price

Return ONLY JSON.

{
"hospitalId":"",
  "hospitalName":"",
  "address":"",
  "distance":"",
  "rating":"",
  "price":"",
  "reason":""
}

No markdown.
No explanations.
No triple backticks.
Only JSON.
`;

    const response =
      await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model:
            "deepseek/deepseek-chat-v3-0324",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type":
              "application/json",
          },
        }
      );

    let aiResponse =
      response.data.choices[0]
        .message.content;

    aiResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const recommendation =
      JSON.parse(aiResponse);

    res.status(200).json({
      recommendation,
    });
  } catch (error) {
    console.log(
      error.response?.data || error
    );

    res.status(500).json({
      message:
        "Hospital recommendation failed",
    });
  }
};

export const summarizeReviews = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    console.log("Hospital ID:", hospitalId);

    const reviews = await Review.find({
      hospitalId,
    });

    console.log(
      "Reviews Found:",
      reviews.length
    );

    if (reviews.length === 0) {
      return res.status(404).json({
        message: "No reviews available",
      });
    }

    const reviewText = reviews
      .map(
        (review) => `
Rating: ${review.rating}
Comment: ${review.comment}
`
      )
      .join("\n");

    const prompt = `
You are a healthcare review analyst.

Analyze these hospital reviews:

${reviewText}

Return ONLY this format:

Strengths:
- point 1
- point 2

Weaknesses:
- point 1

Overall Sentiment:
Positive / Neutral / Negative

Keep it short and professional.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      summary:
        response.data.choices[0].message.content,
    });

  } catch (error) {
    console.log(
      error.response?.data || error
    );

    res.status(500).json({
      message:
        "Failed to summarize reviews",
    });
  }
};

export const compareHospitalsAI = async (req, res) => {
  try {
    const {
      hospital1Id,
      hospital2Id,
    } = req.body;

    const hospital1 =
      await Hospital.findById(hospital1Id);

    const hospital2 =
      await Hospital.findById(hospital2Id);

    if (!hospital1 || !hospital2) {
      return res.status(404).json({
        message: "Hospital not found",
      });
    }

    const services =
      await Service.find().populate(
        "hospitalId"
      );

    const h1Services = services.filter(
      (s) =>
        s.hospitalId._id.toString() ===
        hospital1Id
    );

    const h2Services = services.filter(
      (s) =>
        s.hospitalId._id.toString() ===
        hospital2Id
    );

    const prompt = `
Compare these hospitals.

Hospital 1:
Name: ${hospital1.name}
Rating: ${hospital1.rating}
Services:
${h1Services
  .map(
    (s) =>
      `${s.serviceName} - ₹${s.price}`
  )
  .join("\n")}

Hospital 2:
Name: ${hospital2.name}
Rating: ${hospital2.rating}
Services:
${h2Services
  .map(
    (s) =>
      `${s.serviceName} - ₹${s.price}`
  )
  .join("\n")}

Tell:
1. Strengths of each
2. Weaknesses of each
3. Which hospital is better overall
4. Final recommendation

Keep response short.
`;

    const response =
      await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model:
            "deepseek/deepseek-chat-v3-0324",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type":
              "application/json",
          },
        }
      );

    res.json({
      comparison:
        response.data.choices[0].message
          .content,
    });
  } catch (error) {
    console.log(
      error.response?.data || error
    );

    res.status(500).json({
      message: "Comparison failed",
    });
  }
};