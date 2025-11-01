import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db } from "../../config/db.ts";
import { coaches, players, referees, users } from "../../drizzle/schema.ts";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * 🧩 Phase 1 Registration — for all users (admin, coach, referee, player)
 */
export const registerPhase1 = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  if (role === "admin") {
    throw new Error("Admin cannot register via this route");
  }

  // Check for duplicate email
  const existingUser = await db.select().from(users).where(eq(users.email, email));
  if (existingUser.length > 0) {
    throw new Error("Email already registered");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into 'users' table with default status = pending
  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
      status: "pending", // <-- new field to track approval
    })
    .returning({ id: users.id, role: users.role, status: users.status });

  return {
    message: "Registration successful. Awaiting admin approval",
    userId: newUser.id,
    role: newUser.role,
    status: newUser.status,
  };
};

/**
 * 🧩 Phase 2 Registration — only for coach, referee, player
 */
export const registerPhase2 = async (role: string, data: any) => {
  if (role === "admin") {
    throw new Error("Admin does not require Phase 2 registration");
  }

  if (role === "coach") {
    await db.insert(coaches).values(data);
    return { message: "Coach profile created successfully" };
  }

  if (role === "referee") {
    await db.insert(referees).values(data);
    return { message: "Referee profile created successfully" };
  }

  if (role === "player") {
    await db.insert(players).values(data);
    return { message: "Player profile created successfully" };
  }

  throw new Error("Invalid role for phase 2 registration");
};

/**
 * 🧩 Login with bcrypt and JWT
 */
export const loginUser = async (email: string, password: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) throw new Error("User not found");
  if (!user.password) throw new Error("Password not set for this user");

  // Check account approval
  if (user.status !== "approved") {
    throw new Error("Account not approved. Please wait for admin approval");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // 🧠 Step 1: Check if Phase 2 is completed
  let phase2Completed = false;

  if (user.role === "coach") {
    const [coachProfile] = await db.select().from(coaches).where(eq(coaches.user_id, user.id));
    phase2Completed = !!coachProfile;
  } else if (user.role === "referee") {
    const [refereeProfile] = await db.select().from(referees).where(eq(referees.user_id, user.id));
    phase2Completed = !!refereeProfile;
  } else if (user.role === "player") {
    const [playerProfile] = await db.select().from(players).where(eq(players.user_id, user.id));
    phase2Completed = !!playerProfile;
  }

  // 🧠 Step 2: Generate a token for the session (even if Phase 2 incomplete)
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 🧠 Step 3: If Phase 2 not complete, tell frontend where to redirect
  if (!phase2Completed) {
    let redirectTo = "/";
    switch (user.role) {
      case "coach":
        redirectTo = "/register/coach-details";
        break;
      case "referee":
        redirectTo = "/register/referee-details";
        break;
      case "player":
        redirectTo = "/register/player-details";
        break;
    }

    return {
      message: "Please complete your Phase 2 registration",
      redirectTo,
      token, // ✅ Added here
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        phase2_completed: false,
      },
    };
  }

  // 🧠 Step 4: Successful login
  return {
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      phase2_completed: true,
    },
  };
};
