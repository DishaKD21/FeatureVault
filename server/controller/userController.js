import User from "../model/userModel.js";

export const firebaseLogin = async (req, res) => {
  const { uid, email, name } = req.user;

  let user = await User.findOne({ firebaseUID: uid });

  if (!user) {
    user = await User.create({
      firebaseUID: uid,
      email,
      name
    });
  }

  res.json(user);
};