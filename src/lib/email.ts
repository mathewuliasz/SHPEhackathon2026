import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
});

export async function sendAppointmentConfirmation(params: {
  toEmail: string;
  patientName: string;
  doctorName: string;
  specialtyName: string;
  date: string;
  time: string;
  zoomLink: string | null;
}) {
  const { toEmail, patientName, doctorName, specialtyName, date, time, zoomLink } = params;

  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const formattedTime = `${hour12}:${String(m).padStart(2, "0")} ${period}`;

  const zoomSection = zoomLink
    ? `
      <tr>
        <td style="padding: 16px 24px; background: #eff6ff; border-radius: 8px;">
          <p style="margin: 0 0 8px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Video Call</p>
          <a href="${zoomLink}" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Join Zoom Meeting</a>
          <p style="margin: 8px 0 0; font-size: 12px; color: #6b7280; word-break: break-all;">${zoomLink}</p>
        </td>
      </tr>`
    : "";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: #1a1a2e; padding: 24px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 22px;">Medi<span style="color: #5B8BD4;">Track</span></h1>
      </div>

      <div style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #dcfce7; display: inline-flex; align-items: center; justify-content: center; font-size: 28px;">&#10003;</div>
          <h2 style="margin: 12px 0 4px; color: #111827; font-size: 22px;">Appointment Confirmed!</h2>
          <p style="margin: 0; color: #6b7280;">Hi ${patientName}, your appointment has been scheduled.</p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 16px 24px; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Specialty</p>
              <p style="margin: 0; font-weight: 600; color: #111827;">${specialtyName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 24px; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Doctor</p>
              <p style="margin: 0; font-weight: 600; color: #111827;">${doctorName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 24px; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</p>
              <p style="margin: 0; font-weight: 600; color: #111827;">${formattedDate}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 24px;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Time</p>
              <p style="margin: 0; font-weight: 600; color: #111827;">${formattedTime} (ET)</p>
            </td>
          </tr>
        </table>

        ${zoomSection}

        <p style="margin: 24px 0 0; font-size: 13px; color: #9ca3af; text-align: center;">
          If you need to reschedule or cancel, please contact us through the MediTrack dashboard.
        </p>
      </div>

      <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">MediTrack - Your Health, Our Priority</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"MediTrack" <${process.env.GOOGLE_EMAIL}>`,
    to: toEmail,
    subject: `Appointment Confirmed: ${specialtyName} with ${doctorName}`,
    html,
  });
}
