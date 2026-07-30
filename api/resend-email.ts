import { db, collection, query, where, getDocs, updateDoc, doc, limit } from './_db.js';
import { sendFirstSubscriptionEmail } from './_email.js';
import { resolveAppOrigin } from './_origin.js';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { email, token } = req.body || {};
  const emailLower = (email || '').toString().toLowerCase().trim();
  const cleanToken = (token || '').toString().trim();

  if (!emailLower && !cleanToken) {
    return res.status(400).json({ success: false, error: 'Email or continuation token is required.' });
  }

  try {
    const colRef = collection(db, 'newsletterSubscribers');
    let q;
    if (cleanToken) {
      q = query(colRef, where('continuationToken', '==', cleanToken), limit(1));
    } else {
      q = query(colRef, where('email', '==', emailLower), limit(1));
    }

    const snap = await getDocs(q);

    if (snap.empty) {
      return res.status(404).json({ success: false, error: 'Subscription record not found.' });
    }

    const docSnap = snap.docs[0];
    const docId = docSnap.id;
    const docData = docSnap.data() as Record<string, any>;

    if (docData.status === 'active') {
      return res.status(400).json({ success: false, error: 'This subscription is already completed.' });
    }

    // Cooldown check: 60 seconds
    const lastSentStr = docData.lastResentAt || docData.firstEmailSentAt;
    if (lastSentStr) {
      const lastSentMs = new Date(lastSentStr).getTime();
      const elapsedSec = (Date.now() - lastSentMs) / 1000;
      if (elapsedSec < 60) {
        const remainingSec = Math.ceil(60 - elapsedSec);
        return res.status(429).json({
          success: false,
          error: `Please wait ${remainingSec} seconds before requesting another email.`,
          remainingSeconds: remainingSec,
        });
      }
    }

    const currentToken = docData.continuationToken || cleanToken;
    const targetEmail = docData.email || emailLower;

    let targetOrigin = docData.sourceOrigin;
    if (!targetOrigin) {
      const originRes = resolveAppOrigin(req);
      targetOrigin = originRes.origin || 'https://clearpathmedia.ng';
    }

    const continuationUrl = `${targetOrigin}/subscribe?token=${currentToken}`;

    const emailRes = await sendFirstSubscriptionEmail(targetEmail, continuationUrl);
    const resendId = emailRes.data?.id || null;

    const nowIso = new Date().toISOString();
    await updateDoc(doc(db, 'newsletterSubscribers', docId), {
      deliveryStatus: 'sent',
      lastResentAt: nowIso,
      resendMessageId: resendId,
      deliveryError: null,
      updatedAt: nowIso,
    });

    return res.status(200).json({
      success: true,
      message: 'A new continuation email has been sent to your inbox.',
      resendId,
    });
  } catch (err: any) {
    console.error('Resend email error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to resend email. Please try again.',
    });
  }
}
