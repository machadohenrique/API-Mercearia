const express = require("express");
const auth = require("../auth");
const {Product} = require("../models");

const router = express.Router();


router.post("/products", auth, async (req, res) => {
  const { name, price, stockQty } = req.body;
  if (!name || !price) return res.status(400).json({ message: "Faltou campo." });

  const product = await Product.create({
    name,
    price,
    stockQty: stockQty || 0
  });

  res.status(201).json(product);
});

router.get("/products", auth, async (req, res) => {
  const products = await Product.findAll({ order: [["name", "ASC"]] });
  res.json(products);
});

module.exports = router