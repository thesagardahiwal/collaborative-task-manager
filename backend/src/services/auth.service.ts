import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { generateToken } from "../utils/jwt";

const userRepo = new UserRepository();

export class AuthService {
    async register(data: any) {
        const hashed = await bcrypt.hash(data.password, 10);

        // Create user
        const users = await userRepo.create({
            ...data,
            password: hashed
        });
        const user = Array.isArray(users) ? users[0] : users;

        // Generate JWT
        const token = generateToken(user._id.toString());

        return { user, token };
  }

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = generateToken(user._id as unknown as string);

    return { user, token };
  }
}
