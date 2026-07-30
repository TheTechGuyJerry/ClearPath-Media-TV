import crypto from 'crypto';
import { db, collection, query, where, getDocs, addDoc, updateDoc, doc, limit } from './_db';
import { sendFirstSubscriptionEmail } from './_email';

export default async function handler(req: any, res: any) {
  // CORS & Header handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body || {};
    const emailLower = (email || '').toString().toLowerCase().trim();

    // Email validation
    if (!emailLower || !emailLower.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    // Check if already actively subscribed
    const colRef = collection(db, 'newsletterSubscribers');
    const qActive = query(colRef, where('email', '==', emailLower), where('status', '==', 'active'), limit(1));
    const activeSnap = await getDocs(qActive);

    if (!activeSnap.empty) {
      return res.status(200).json({
        success: true,
        status: 'already_subscribed',
        message: 'This email address is already actively subscribed to ClearPath Media.',
      });
    }

    // Generate secure continuation token & 24hr expiration
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const nowIso = new Date().toISOString();

    // Check existing pending record to update or create new
    const qPending = query(colRef, where('email', '==', emailLower), limit(1));
    const pendingSnap = await getDocs(qPending);

    let docId: string;
    if (!pendingSnap.empty) {
      docId = pendingSnap.docs[0].id;
      await updateDoc(doc(db, 'newsletterSubscribers', docId), {
        status: 'pending',
        continuationToken: token,
        continuationExpiresAt: expiresAt,
        deliveryStatus: 'pending',
        updatedAt: nowIso,
      });
    } else {
      const newDoc = await addDoc(colRef, {
        email: emailLower,
        status: 'pending',
        continuationToken: token,
        continuationExpiresAt: expiresAt,
        deliveryStatus: 'pending',
        source: 'clearpath_subscribe_flow',
        privacyConsent: true,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
      docId = newDoc.id;
    }

    // Build base URL for continuation link
    const host = req.headers?.host || req.headers?.['x-forwarded-host'] || 'localhost:3000';
    const protocol = req.headers?.['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
    const appUrl = process.env.APP_URL ? process.env.APP_URL.replace(/\/$/, '') : `${protocol}://${host}`;
    const continuationUrl = `${appUrl}/subscribe?token=${token}`;

    // Send first email via Resend
    let resendId: string | null = null;
    try {
      const emailRes = await sendFirstSubscriptionEmail(emailLower, continuationUrl);
      resendId = emailRes.data?.id || null;
      
      // Update delivery status in Firestore
      await updateDoc(doc(db, 'newsletterSubscribers', docId), {
        deliveryStatus: 'sent',
        firstEmailSentAt: new Date().toISOString(),
        resendMessageId: resendId,
        deliveryError: null,
        updatedAt: new Date().toISOString(),
      });
    } catch (emailErr: any) {
      console.error('Error sending first email via Resend:', emailErr);
      await updateDoc(doc(db, 'newsletterSubscribers', docId), {
        deliveryStatus: 'failed',
        deliveryError: emailErr.message || 'Resend API error',
        updatedAt: new Date().toISOString(),
      });
      return res.status(500).json({
        success: false,
        error: `Failed to send subscription email: ${emailErr.message || 'Resend delivery failed'}`,
      });
    }

    return res.status(200).json({
      success: true,
      status: 'email_sent',
      message: 'We have sent you an email to continue your subscription.',
      token,
      email: emailLower,
    });
  } catch (err: any) {
    console.error('Subscribe endpoint error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error processing subscription.',
    });
  }
}
