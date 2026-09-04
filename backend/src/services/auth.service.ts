import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';

export class AuthService {
  async register(data: any) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw { statusCode: 400, message: 'Email already in use' };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await userRepository.create({
      email: data.email,
      name: data.name,
      passwordHash,
    });

    const token = this.generateToken(user.id);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  }

  async login(data: any) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const token = this.generateToken(user.id);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  }

  private generateToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });
  }
}

export const authService = new AuthService();
