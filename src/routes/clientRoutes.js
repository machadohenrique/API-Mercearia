const express = require("express");
const auth = require("../auth");
const {Client} = require("../models")

const router = express.Router()

router.post("/clients", auth, async (req, res) => {
  const { name, phone, creditLimit } = req.body;
  if (!name) return res.status(400).json({ message: "Nome é obrigatório." });

  const client = await Client.create({
    name,
    phone: phone || null,
    creditLimit: creditLimit || 0
  });

  res.status(201).json(client);
});

router.get("/clients", auth, async (req, res) => {
  const clients = await Client.findAll({ order: [["name", "ASC"]] });
  res.json(clients);
});

// pagar fiado (RF004) DEPOIS
/*
router.post("/clients/:id/pay", auth, async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ message: "Informe amount." });

  const client = await Client.findByPk(req.params.id);
  if (!client) return res.status(404).json({ message: "Cliente não existe." });

  const newDebt = Number(client.debtBalance) - Number(amount);
  client.debtBalance = newDebt < 0 ? 0 : newDebt;
  await client.save();

  res.json({ message: "Pagamento registrado.", debtBalance: client.debtBalance });
});
*/

router.post("/clients/:id/pay", auth, async (req, res) => {
  const { amount } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: "Informe um amount válido." });
  }

  const client = await Client.findByPk(req.params.id);

  if (!client) {
    return res.status(404).json({ message: "Cliente não existe." });
  }

  if (Number(client.debtBalance) <= 0) {
    return res.status(400).json({ message: "Cliente não possui dívida." });
  }

  const newDebt = Number(client.debtBalance) - Number(amount);
  client.debtBalance = newDebt < 0 ? 0 : newDebt;

  await client.save();

  res.json({
    message: "Pagamento registrado.",
    debtBalance: client.debtBalance
  });
});
module.exports = router