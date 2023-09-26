import jwt from 'jsonwebtoken';

function generateAccessToken(id: string, email: string) {
  return jwt.sign({ id, email }, process.env.JWT_KEY!, {
    expiresIn: 3 * 24 * 60 * 60,
  });
}

function validateAccessToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_KEY!);
  } catch (error) {
    return null;
  }
}

export const jwtHelper = {
  generateAccessToken,
  validateAccessToken,
};
