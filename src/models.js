const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// 1) Usuário (login)
const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false }
});

// 2) Produto (RF001)
const Product = sequelize.define("Product", {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  stockQty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
});

// 3) Cliente (RF002/RF004)
const Client = sequelize.define("Client", {
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  creditLimit: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
  debtBalance: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 }
});

// 4) Venda (RF003)
const Sale = sequelize.define("Sale", {
  paymentType: { type: DataTypes.STRING, allowNull: false }, // CASH | CARD | CREDIT
  total: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 }
});
/*
// 4) Venda (RF003/RF004)
const Sale = sequelize.define("Sale", {
  paymentType: {
    type: DataTypes.ENUM("CASH", "CARD", "CREDIT"),
    allowNull: false
  },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 }
});
 */
// 5) Item da venda
const SaleItem = sequelize.define("SaleItem", {
  qty: { type: DataTypes.INTEGER, allowNull: false },
  unitPrice: { type: DataTypes.DECIMAL(10,2), allowNull: false }
});


// User 1:N Sale
User.hasMany(Sale, { foreignKey: { allowNull: false }, onDelete: "RESTRICT" });
Sale.belongsTo(User);

// Client 1:N Sale (opcional: pode ser null quando CASH/CARD)
Client.hasMany(Sale, { onDelete: "RESTRICT" });
Sale.belongsTo(Client);

// Sale 1:N SaleItem
Sale.hasMany(SaleItem, { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
SaleItem.belongsTo(Sale);

// Product 1:N SaleItem
Product.hasMany(SaleItem, { foreignKey: { allowNull: false }, onDelete: "RESTRICT" });
SaleItem.belongsTo(Product);

module.exports = { sequelize, User, Product, Client, Sale, SaleItem };