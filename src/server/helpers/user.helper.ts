import * as bcrypt from 'bcryptjs';
//import jwt from 'jsonwebtoken';

//const JWT_SECRET = "secreto"
//const JWT_EXPIRES_IN = "30m"

export function checkPassword(password: string, hashPassword: string): boolean {
  return bcrypt.compareSync(password, hashPassword);
}

export function createJWT(id: string, role: string): any {
  return { id, role }
  //return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function checkJWT(token: any): any {
  try {
    //const payload = jwt.verify(token, JWT_SECRET);
    return { ...token };
  } catch (error) {
    console.error('Error al verificar el token JWT:', error);
    throw new Error('Token JWT inválido');
  }
}

