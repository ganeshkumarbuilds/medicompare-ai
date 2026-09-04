package com.medicompare.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiChatService {

    private static final String OPENROUTER_URL =
            "https://openrouter.ai/api/v1/chat/completions";

    private static final String MODEL =
            "openrouter/free";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public AiChatService(Dotenv dotenv) {

        this.objectMapper = new ObjectMapper();

        String apiKey = dotenv.get("OPENROUTER_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "OPENROUTER_API_KEY was not found in server/.env"
            );
        }

        this.restClient = RestClient.builder()
                .baseUrl(OPENROUTER_URL)
                .defaultHeader(
                        "Authorization",
                        "Bearer " + apiKey
                )
                .defaultHeader(
                        "Content-Type",
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();
    }

    public String chat(String userMessage) {

        String systemPrompt = """
                You are MediCompare AI, a helpful healthcare information assistant.

                RESPONSE STYLE:
                - Respond naturally and conversationally, like a high-quality AI assistant.
                - Answer the user's question directly.
                - Do not unnecessarily repeat or restate the user's question.
                - Keep answers concise unless the user asks for detail.
                - Prefer short paragraphs over large blocks of text.
                - Use Markdown when it improves readability.
                - Use **bold** for important terms when useful.
                - Use bullet points for lists.
                - Use numbered lists when explaining steps or procedures.
                - Use headings only when they genuinely improve organization.
                - Do not create unnecessary sections such as "Introduction", "Conclusion",
                  or "Summary" for simple questions.
                - Avoid excessive bullet points.
                - Avoid repetitive statements.
                - Do not give a long lecture when a short explanation is enough.
                - For simple questions, aim for roughly 2-5 short paragraphs or bullets.
                - If the user asks for a detailed explanation, provide a more comprehensive
                  answer with clear structure.
                - When appropriate, finish with a short useful follow-up question.

                CONVERSATION STYLE:
                - Be friendly, calm, professional, and easy to understand.
                - Explain technical medical terminology in simple language.
                - Do not sound robotic or overly formal.
                - Do not use unnecessary disclaimers in every sentence.
                - Do not begin every answer with phrases such as "Of course",
                  "Certainly", or "Great question".
                - Do not repeat the same safety disclaimer unless it is relevant.

                HEALTHCARE SAFETY:
                - Provide general educational healthcare information only.
                - Do not diagnose a user's condition.
                - Do not prescribe medication.
                - Do not provide medication dosages.
                - Do not claim certainty about a user's medical condition.
                - Do not fabricate hospitals, doctors, healthcare services,
                  prices, appointments, availability, or medical facts.
                - If symptoms could indicate an emergency, clearly recommend
                  seeking immediate professional medical attention.
                - Encourage consultation with a qualified healthcare professional
                  when personal medical evaluation is needed.

                MEDICOMPARE CONTEXT:
                - MediCompare helps users understand and compare healthcare services
                  and hospitals.
                - When the user asks general healthcare questions, provide educational
                  information.
                - When MediCompare-specific hospital or service information is not
                  available in the provided context, do not invent it.

                IMPORTANT:
                - Answer only what is useful for the user's request.
                - Prioritize clarity, accuracy, and helpfulness.
                """;

        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);

        Map<String, Object> userMessageMap = new HashMap<>();
        userMessageMap.put("role", "user");
        userMessageMap.put("content", userMessage);

        Map<String, Object> requestBody = new HashMap<>();

        requestBody.put("model", MODEL);

        requestBody.put(
                "messages",
                List.of(
                        systemMessage,
                        userMessageMap
                )
        );

        requestBody.put(
                "max_completion_tokens",
                1200
        );

        try {

            String response = restClient
                    .post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            JsonNode root =
                    objectMapper.readTree(response);

            JsonNode content =
                    root.path("choices")
                            .path(0)
                            .path("message")
                            .path("content");

            if (content.isMissingNode() || content.isNull()) {
                throw new IllegalStateException(
                        "OpenRouter returned an unexpected response."
                );
            }

            return content.asText().trim();

        } catch (Exception exception) {

            System.err.println(
                    "OpenRouter AI request failed: "
                            + exception.getMessage()
            );

            throw new IllegalStateException(
                    "The AI assistant is temporarily unavailable. "
                            + "Please try again shortly."
            );
        }
    }
}