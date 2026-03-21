import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUID: String,
  email: String,
  name: String
});

export default mongoose.model("User", userSchema);
