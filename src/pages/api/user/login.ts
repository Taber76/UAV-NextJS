import type { NextApiRequest, NextApiResponse } from 'next'
import UserController from '@/server/controllers/user.controller';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return UserController.login(req, res);
}