import { db, collection, query, where, getDocs, limit } from './_db';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = (req.body?.token || req.query?.token || '').toString().trim();

  if (!token) {
    return res.status(400).json({ success: false, error: 'Continuation token is required.' });
  }

  try {
    const colRef = collection(db, 'newsletterSubscribers');
    const q = query(colRef, where('continuationToken', '==', token), limit(1));
    const snap = await getDocs(q);

    if (snap.empty) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or unrecognized continuation link.',
      });
    }

    const docData = snap.docs[0].data() as Record<string, any>;

    // Check if already completed
    if (docData.status === 'active') {
      return res.status(400).json({
        success: false,
        error: 'This subscription link has already been completed.',
        alreadyCompleted: true,
      });
    }

    // Check expiration (24 hour rule)
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

    return res.status(200).json({
      success: true,
      email: docData.email,
      token: docData.continuationToken,
      status: docData.status,
    });
  } catch (err: any) {
    console.error('Continue subscription endpoint error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error resolving continuation token.',
    });
  }
}
