
import admin from "./firebaseAdmin.js";
import User from "./user.model.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    let user = await User.findOne({ firebaseUID: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseUID: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.email?.split("@")[0],
      });
    }

    req.firebaseUser = decoded;
    req.user = {
      id: user._id.toString(),
      _id: user._id,
      uid: decoded.uid,
      email: user.email,
      name: user.name,
    };
    next();
  } catch (error) {
    console.error("Auth token verification failed:", error);
    return res.status(401).json({ msg: "Invalid token" });
  }
};
