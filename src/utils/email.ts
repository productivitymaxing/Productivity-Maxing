import { Resend } from 'resend';

export const sendWelcomeEmail = async (userEmail: string, apiKey: string) => {
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Productivity Maxing <notifications@productivitymaxing.com>',
      to: [userEmail],
      subject: 'Portal Access Granted',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #1d4ed8;">Welcome to the Console</h2>
          <p>Your institutional audit is ready to begin. Log in to your dashboard to continue.</p>
          <div style="margin: 30px 0;">
            <a href="https://productivitymaxing.com/dashboard" style="background-color: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Access Dashboard</a>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
};

export async function sendVerificationEmail(email: string, name: string, url: string, apiKey: string) {
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Productivity Maxing <notifications@productivitymaxing.com>',
      to: [email],
      subject: 'Verify your email - Productivity Maxing',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #1d4ed8;">Welcome to Productivity Maxing, ${name}!</h2>
          <p>Click the button below to verify your email address and access your business intelligence dashboard.</p>
          <div style="margin: 30px 0;">
            <a href="${url}" style="background-color: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${url}</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px;">This link will expire in 15 minutes. If you did not request this email, you can safely ignore it.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error };
  }
}