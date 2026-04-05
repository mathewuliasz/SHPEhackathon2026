import { GoogleGenerativeAI } from "@google/generative-ai";

const SUMMARIZATION_PROMPT = `You are a medical note summarizer for a healthcare telehealth platform.
You are given a transcript of a doctor-patient video consultation.

Summarize the meeting into the following sections:

MEETING SUMMARY
- 2-3 sentence overview of the consultation

KEY DISCUSSION POINTS
- Bulleted list of main topics discussed

SYMPTOMS & CONCERNS REPORTED
- Patient-reported symptoms and concerns

ASSESSMENT & RECOMMENDATIONS
- Any assessments, diagnoses discussed, or recommendations made by the doctor

ACTION ITEMS & FOLLOW-UP
- Next steps, medications discussed, tests ordered, follow-up appointments

Important: Do not fabricate medical information not present in the transcript.
If a section has no relevant content, write "Not discussed in this session."
Keep the summary concise and factual.`;

export async function summarizeMeetingTranscript(
  transcript: string,
  meetingTopic: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "[Meeting notes could not be generated — AI service is not configured.]";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(
      `${SUMMARIZATION_PROMPT}\n\nMeeting Topic: ${meetingTopic}\n\nTranscript:\n${transcript}`
    );

    const summary = result.response.text();

    return `--- Meeting Notes (AI-Generated) ---\n${meetingTopic}\n\n${summary}`;
  } catch (err) {
    console.error("Meeting summarization failed:", err);
    return "[Meeting recording was processed but the AI summary could not be generated. Please contact support if you need the meeting notes.]";
  }
}
