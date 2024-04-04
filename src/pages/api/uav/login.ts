import type { NextApiRequest, NextApiResponse } from 'next'
import UavController from '@/server/controllers/uav.controller';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return UavController.login(req, res);
}