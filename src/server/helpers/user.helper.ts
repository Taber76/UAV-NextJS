import * as bcrypt from 'bcrypt';
//import jwt from 'jsonwebtoken';

//const JWT_SECRET = "secreto"
//const JWT_EXPIRES_IN = "1d"

export function checkPassword(password: string, hashPassword: string): boolean {
  return bcrypt.compareSync(password, hashPassword);
}

/*
export function createJWT(id: string, role: string): string {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function checkJWT(token: string): any {
  const payload = jwt.verify(token, JWT_SECRET);
  return payload;
}
*/