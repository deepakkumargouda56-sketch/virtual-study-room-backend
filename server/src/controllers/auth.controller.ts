import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail, getUserById, } from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
  return res.status(400).json({
    message: "All fields are required",
  });
}

 const existingUser = await findUserByEmail(email);

if (existingUser) {
  return res.status(409).json({
    message: "Email already exists",
  });
}

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
 // Find user by email
    const user = await findUserByEmail(email);
    console.log("LOGIN EMAIL:", email);
    console.log("USER FOUND:", !!user);
    console.log("PASSWORD HASH EXISTS:", !!user?.password);
    console.log("HASH LENGTH:", user?.password?.length);

    // User not found
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isPasswordValid);

if (!isPasswordValid) {
  return res.status(401).json({
    message: "Invalid email or password",
  });
}

 const { password: _, ...userData } = user;

 const token = generateToken(user.id, user.name, user.email);

return res.status(200).json({
  message: "Login successful",
  token,
  user: userData,
});

    res.status(200).json({
      message: "User found successfully",
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    // Logged-in user ID from JWT
    const userId = (req as any).user.id;

    // Fetch user from database
    const user = await getUserById(userId);

    // User not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
