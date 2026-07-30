import { db, collection, query, where, getDocs, updateDoc, doc, limit } from './_db';
import { sendConfirmationEmail } from './_email';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { token, firstName, surname, lastName, occupation, stateOfOrigin } = req.body || {};
  const cleanToken = (token || '').toString().trim();
  const fName = (firstName || '').toString().trim();
  const sName = (surname || lastName || '').toString().trim();
  const occ = (occupation || '').toString().trim();
  const state = (stateOfOrigin || '').toString().trim();

  if (!cleanToken) {
    return res.status(400).json({ success: false, error: 'Continuation token is required.' });
  }

  if (!fName || !sName) {
    return res.status(400).json({ success: false, error: 'First name and surname are required.' });
  }

  if (!occ || occ === 'Not Specified') {
    return res.status(400).json({ success: false, error: 'Occupation is required.' });
  }

  if (!state || state === 'Not Specified') {
    return res.status(400).json({ success: false, error: 'State of residence is required.' });
  }

  try {
    const colRef = collection(db, 'newsletterSubscribers');
    const q = query(colRef, where('continuationToken', '==', cleanToken), limit(1));
    const snap = await getDocs(q);

    if (snap.empty) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or expired continuation link.',
      });
    }

    const docSnap = snap.docs[0];
    const docId = docSnap.id;
    const docData = docSnap.data() as Record<string, any>;

    if (docData.status === 'active') {
      return res.status(400).json({
        success: false,
        error: 'This subscription has already been completed.',
        alreadyCompleted: true,
      });
    }

    if (docData.continuationExpiresAt) {
      const expiresTime = new Date(docData.continuationExpiresAt).getTime();
      if (isNaN(expiresTime) || expiresTime < Date.now()) {
        return res.status(400).json({
          success: false,
          error: 'This continuation link has expired (24-hour limit). Please start subscription again.',
          expired: true,
        });
      }
    }

    const fullName = `${fName} ${sName}`.trim() || 'Subscriber';
    const nowIso = new Date().toISOString();

    // Update subscriber record to active & clear continuationToken
    await updateDoc(doc(db, 'newsletterSubscribers', docId), {
      firstName: fName,
      lastName: sName,
      fullName: fullName,
      occupation: occ || 'Not Specified',
      stateOfOrigin: state || 'Not Specified',
      status: 'active',
      continuationToken: null,
      continuationExpiresAt: null,
      completedAt: nowIso,
      updatedAt: nowIso,
    });

    // Send final confirmation email via Resend
    let confirmationResendId: string | null = null;
    try {
      const emailRes = await sendConfirmationEmail(docData.email, fullName);
      confirmationResendId = emailRes.data?.id || null;

      await updateDoc(doc(db, 'newsletterSubscribers', docId), {
        confirmationEmailSentAt: new Date().toISOString(),
        confirmationResendId,
        confirmationDeliveryStatus: 'sent',
      });
    } catch (emailErr: any) {
      console.error('Error sending confirmation email via Resend:', emailErr);
      await updateDoc(doc(db, 'newsletterSubscribers', docId), {
        confirmationDeliveryStatus: 'failed',
        confirmationDeliveryError: emailErr.message || 'Resend API error',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Your subscription has been completed successfully. A confirmation email has been sent to you.',
      email: docData.email,
      fullName,
    });
  } catch (err: any) {
    console.error('Complete subscription endpoint error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error completing subscription.',
    });
  }
}
