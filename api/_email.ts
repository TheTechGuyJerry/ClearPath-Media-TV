import { Resend } from 'resend';

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set on the server.');
  }
  return new Resend(apiKey);
}

export async function sendFirstSubscriptionEmail(email: string, continuationUrl: string) {
  const resend = getResendClient();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Complete Your ClearPath Media Subscription</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 40px 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 36px 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .logo { font-size: 22px; font-weight: 800; color: #001e40; letter-spacing: -0.5px; margin-bottom: 24px; text-transform: uppercase; }
        h1 { font-size: 20px; color: #001e40; margin-top: 0; margin-bottom: 16px; font-weight: 700; }
        p { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
        .btn-container { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background-color: #001e40; color: #ffffff !important; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,30,64,0.2); }
        .btn:hover { background-color: #00142b; }
        .notice-box { background-color: #f1f5f9; border-left: 4px solid #001e40; padding: 14px 18px; border-radius: 4px; margin-top: 28px; }
        .notice-box p { font-size: 13px; margin: 0; color: #475569; }
        .footer-note { margin-top: 28px; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">CLEARPATH MEDIA</div>
        <h1>Complete Your ClearPath Media Subscription</h1>
        <p>Thank you for subscribing to ClearPath Media.</p>
        <p>Please click the button below to continue and complete your subscription.</p>
        
        <div class="btn-container">
          <a href="${continuationUrl}" class="btn" target="_blank">Continue Subscription</a>
        </div>

        <div class="notice-box">
          <p><strong>Note:</strong> If this message arrived in your Spam or Junk folder, please mark it as &lsquo;Not Spam&rsquo; and move it to your Inbox so that future ClearPath Media communications reach you successfully.</p>
        </div>

        <div class="footer-note">
          <p>If you did not request this subscription, you can safely ignore this email.</p>
          <p>&copy; ClearPath Media. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `Thank you for subscribing to ClearPath Media.

Please click the link below to continue and complete your subscription:
${continuationUrl}

If this message arrived in your Spam or Junk folder, please mark it as 'Not Spam' and move it to your Inbox so that future ClearPath Media communications reach you successfully.

If you did not request this subscription, you can safely ignore this email.`;

  return await resend.emails.send({
    from: 'ClearPath Media <no-reply@clearpathmedia.ng>',
    to: [email],
    subject: 'Complete Your ClearPath Media Subscription',
    html: htmlContent,
    text: textContent,
  });
}

export async function sendConfirmationEmail(email: string, subscriberName: string) {
  const resend = getResendClient();
  const displayName = subscriberName && subscriberName.trim() ? subscriberName.trim() : 'Subscriber';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your ClearPath Media Subscription Is Confirmed</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 40px 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 36px 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .logo { font-size: 22px; font-weight: 800; color: #001e40; letter-spacing: -0.5px; margin-bottom: 24px; text-transform: uppercase; }
        h1 { font-size: 20px; color: #001e40; margin-top: 0; margin-bottom: 16px; font-weight: 700; }
        p { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 16px; }
        .signature { margin-top: 32px; border-top: 1px solid #e2e8f0; pt-20px; padding-top: 20px; font-weight: 600; color: #001e40; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">CLEARPATH MEDIA</div>
        <h1>Your ClearPath Media Subscription Is Confirmed</h1>
        <p>Dear ${displayName},</p>
        <p>Your subscription to ClearPath Media has been successfully completed.</p>
        <p>You will now receive communications and updates from ClearPath Media.</p>
        <p>Thank you for subscribing.</p>
        <div class="signature">ClearPath Media</div>
      </div>
    </body>
    </html>
  `;

  const textContent = `Dear ${displayName},

Your subscription to ClearPath Media has been successfully completed.

You will now receive communications and updates from ClearPath Media.

Thank you for subscribing.

ClearPath Media`;

  return await resend.emails.send({
    from: 'ClearPath Media <no-reply@clearpathmedia.ng>',
    to: [email],
    subject: 'Your ClearPath Media Subscription Is Confirmed',
    html: htmlContent,
    text: textContent,
  });
}
