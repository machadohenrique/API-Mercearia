const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User} = require("../models")

const router = express.Router()


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Faltou campo." });

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(409).json({ message: "E-mail já existe." });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  return res.status(201).json({ id: user.id, email: user.email });
});

// login -> token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Login inválido." });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Login inválido." });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({ token });
});

module.exports = router;