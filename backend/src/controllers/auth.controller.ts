import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { generateToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { RegisterDto } from "../dtos/register.dto";
import { LoginDto } from "../dtos/login.dto";

const userRepo = new UserRepository();

export default  {
  register: async (req: Request, res: Response ) => {
    const parsed = RegisterDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: "error", message: "Invalid data", errors: parsed.error });
    };
    const data = parsed.data;
    // Check duplicate email
    const exists = await userRepo.findByEmail(data.email);
    if (exists) {
      throw new AppError("Email already registered", 409);
    }

    // Hash password
    const hashed = await bcrypt.hash(data.password, 10);

    // Create the user
    const createdUsers = await userRepo.create({
      ...data,
      password: hashed
    });

    const createdUser = Array.isArray(createdUsers) ? createdUsers[0] : createdUsers;
    // Remove sensitive fields
    const user = {
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email
    };

    // Generate JWT
    const token = generateToken(createdUser._id.toString());

    return res.status(200).json({
      status: "success",
      message: "User registered successfully",
      data: { user, token }
    });
  },

  login: async (req: Request, res: Response ) =>{
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: "error", message: "Invalid data", errors: parsed.error });
    };
    const { email, password } = parsed.data;
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    // Clean response user
    const cleanUser = {
      _id: user._id,
      name: user.name,
      email: user.email
    };

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { user: cleanUser, token }
    });
  }
}
