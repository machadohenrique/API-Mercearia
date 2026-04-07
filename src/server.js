/*
npm install express sequelize pg pg-hstore jsonwebtoken bcrypt dotenv
npm install -D nodemon 
(-D) --save-dev
Instala como dependência de desenvolvimento.


| Biblioteca       | Função no projeto                         |
| ---------------- | ----------------------------------------- |
| **express**      | Criação da API (rotas HTTP)               |
| **sequelize**    | ORM para conectar Node ao PostgreSQL      |
| **pg**           | Driver do PostgreSQL                      |
| **pg-hstore**    | Suporte interno usado pelo Sequelize      |
| **jsonwebtoken** | Geração e validação do JWT (Bearer token) |
| **bcrypt**       | Criptografia de senha                     |
| **dotenv**       | Carrega variáveis do `.env`               |

{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}

*/
require("dotenv").config();
const express = require("express");

const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes")
const productRoutes = require("./routes/productRoutes")
const clientRoutes = require("./routes/clientRoutes")
const saleRoutes = require("./routes/saleRoutes")

const app = express();
app.use(express.json());

app.use(authRoutes)
app.use(clientRoutes)
app.use(productRoutes)
app.use(saleRoutes)

app.get("/health", (req, res) => res.json({ ok: true }));

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(process.env.PORT, () => console.log("Rodando na porta " + process.env.PORT));
})();