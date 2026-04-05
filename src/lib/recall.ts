const RECALL_API_BASE = "https://us-west-2.recall.ai/api/v1";

function getApiKey(): string {
  const key = process.env.RECALL_API_KEY;
  if (!key) throw new Error("RECALL_API_KEY is not set");
  return key;
}

export async function createRecallBot(
  meetingUrl: string,
  botName: string
): Promise<{ id: string }> {
  const response = await fetch(`${RECALL_API_BASE}/bot/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      meeting_url: meetingUrl,
      bot_name: botName,
      recording_config: {
        transcript: {
          provider: {
            meeting_captions: {},
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Recall bot creation failed (${response.status}): ${errorBody}`
    );
  }

  const data = await response.json();
  return { id: data.id };
}

export async function getRecallTranscript(botId: string): Promise<string> {
  const headers = { Authorization: `Token ${getApiKey()}` };

  // Fetch bot details to get the transcript download URL from recordings
  const botResponse = await fetch(`${RECALL_API_BASE}/bot/${botId}/`, {
    headers,
  });

  if (!botResponse.ok) {
    throw new Error(`Failed to fetch bot details (${botResponse.status})`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bot: any = await botResponse.json();
  const recordings = bot.recordings || [];

  if (recordings.length === 0) {
    return "";
  }

  // Check for transcript in media_shortcuts
  const transcript = recordings[0]?.media_shortcuts?.transcript;

  if (transcript?.data?.download_url) {
    const dlResponse = await fetch(transcript.data.download_url);
    if (dlResponse.ok) {
      const data = await dlResponse.json();
      // Recall transcript format: array of { speaker, words: [{ text }] }
      if (Array.isArray(data)) {
        return data
          .map((segment: { speaker?: string; words?: Array<{ text: string }> }) => {
            const speaker = segment.speaker || "Unknown Speaker";
            const text = (segment.words || []).map((w) => w.text).join(" ");
            return `${speaker}: ${text}`;
          })
          .join("\n");
      }
      // If it's a string or other format, return as-is
      return typeof data === "string" ? data : JSON.stringify(data);
    }
  }

  // Fallback: try the speaker_timeline from participant_events
  const participantEvents = recordings[0]?.media_shortcuts?.participant_events;
  if (participantEvents?.data?.speaker_timeline_download_url) {
    const tlResponse = await fetch(
      participantEvents.data.speaker_timeline_download_url
    );
    if (tlResponse.ok) {
      const timeline = await tlResponse.json();
      if (Array.isArray(timeline)) {
        return timeline
          .map((entry: { name?: string; text?: string }) =>
            `${entry.name || "Speaker"}: ${entry.text || ""}`
          )
          .join("\n");
      }
    }
  }

  return "";
}
