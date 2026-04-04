const ZOOM_TOKEN_URL = "https://zoom.us/oauth/token";
const ZOOM_API_BASE = "https://api.zoom.us/v2";

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getZoomAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at - 60_000) {
    return cachedToken.access_token;
  }

  const accountId = process.env.ZOOM_ACCOUNT_ID!;
  const clientId = process.env.ZOOM_CLIENT_ID!;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET!;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(
    `${ZOOM_TOKEN_URL}?grant_type=account_credentials&account_id=${accountId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Zoom token request failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.access_token;
}

export async function createZoomMeeting(params: {
  topic: string;
  startTime: string;
  durationMinutes: number;
}): Promise<{ join_url: string; meeting_id: number }> {
  const token = await getZoomAccessToken();

  const response = await fetch(`${ZOOM_API_BASE}/users/me/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: params.topic,
      type: 2,
      start_time: params.startTime,
      duration: params.durationMinutes,
      timezone: "America/New_York",
      settings: {
        join_before_host: true,
        waiting_room: true,
        meeting_authentication: false,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Zoom meeting creation failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return {
    join_url: data.join_url,
    meeting_id: data.id,
  };
}
