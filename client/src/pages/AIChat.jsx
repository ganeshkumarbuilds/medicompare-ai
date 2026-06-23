import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function AIChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const askAI = async () => {
    try {
      if (!question.trim()) {
        return;
      }

      const userMessage = {
        role: "user",
        content: question,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      const currentQuestion = question;
      setQuestion("");
      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/ask`,
        {
          prompt: currentQuestion,
        }
      );

      const aiMessage = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      alert("AI request failed");
    }
  };

  const quickQuestions = [
    "Best MRI hospital in Hyderabad",
    "Cheapest CT Scan",
    "Top rated hospital",
    "Best blood test hospital",
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-5xl mx-auto py-10 px-6">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Header */}

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">

            <h1 className="text-4xl font-bold">
              🤖 MediCompare AI Assistant
            </h1>

            <p className="mt-2 text-blue-100">
              Ask about hospitals, services,
              reviews, ratings and healthcare.
            </p>

          </div>

          {/* Quick Questions */}

          <div className="p-4 border-b flex flex-wrap gap-3">

            {quickQuestions.map(
              (item, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setQuestion(item)
                  }
                  className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100"
                >
                  {item}
                </button>
              )
            )}

          </div>

          {/* Chat Area */}

          <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">

            {messages.length === 0 && (

              <div className="text-center mt-20">

                <div className="text-7xl mb-4">
                  🤖
                </div>

                <h2 className="text-2xl font-bold">
                  Welcome to MediCompare AI
                </h2>

                <p className="text-gray-500 mt-2">
                  Ask anything about hospitals,
                  services, pricing and healthcare.
                </p>

              </div>

            )}

            {messages.map(
              (message, index) => (
                <div
                  key={index}
                  className={`mb-5 flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-3xl px-5 py-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white shadow"
                    }`}
                  >

                    {message.role ===
                    "assistant" ? (
                      <div className="prose max-w-none">
                        <ReactMarkdown>
                          {
                            message.content
                          }
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>
                        {message.content}
                      </p>
                    )}

                  </div>

                </div>
              )
            )}

            {loading && (

              <div className="flex justify-start">

                <div className="bg-white shadow px-5 py-4 rounded-2xl">

                  <p>
                    🤖 Thinking...
                  </p>

                </div>

              </div>

            )}

            <div
              ref={messagesEndRef}
            />

          </div>

          {/* Input */}

          <div className="border-t p-4">

            <div className="flex gap-3">

              <textarea
                rows="2"
                value={question}
                onChange={(e) =>
                  setQuestion(
                    e.target.value
                  )
                }
                placeholder="Ask MediCompare AI..."
                className="flex-1 border rounded-xl p-4 resize-none"
              />

              <button
                onClick={askAI}
                disabled={loading}
                className="bg-blue-600 text-white px-8 rounded-xl hover:bg-blue-700"
              >
                Send
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIChat;