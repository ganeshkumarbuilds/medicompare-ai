import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function AIChat() {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    try {
      if (!question.trim()) {
        alert("Enter a question");
        return;
      }

      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/ai/ask",
        {
          prompt: question,
        }
      );

      setReply(data.reply);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      alert("AI request failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">

      <div className="bg-white shadow-xl rounded-xl p-8">

        <h1 className="text-4xl font-bold mb-8">
          🤖 AI Health Assistant
        </h1>

        <textarea
          rows="5"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Ask anything about healthcare..."
          className="w-full border rounded-lg p-4"
        />

        <button
          onClick={askAI}
          className="bg-blue-600 text-white px-6 cursor-pointer py-3 rounded-lg mt-4"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {reply && (
          <div className="mt-8 bg-blue-50 border rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              AI Response
            </h2>

            <div className="prose max-w-none">
  <ReactMarkdown>
    {reply}
  </ReactMarkdown>
</div>

          </div>
        )}

      </div>

    </div>
  );
}

export default AIChat;