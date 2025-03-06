import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Tillåt frontend på denna URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Uppkoppling databas
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "banksajt",
  port: 8889,
});

interface User {
  id: number;
  username: string;
  password: string;
}

interface Account {
  id: number;
  user_id: number;
  amount: number;
}

// Helper function
async function query<T>(sql: string, params: any[]): Promise<T[]> {
  const [result] = await pool.execute(sql, params);
  return result as T[];
}

// Route - Skapa användare och bankkonto
app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  const newId = Date.now();

  try {
    // Skapa användare
    await query<User>("INSERT INTO users (id, username, password) VALUES (?, ?, ?)", [newId, username, password]);

    // Skapa konto
    await query<Account>("INSERT INTO accounts (user_id, amount) VALUES (?, ?)", [newId, 0]);

    res.status(201).json("User and bank account created");
  } catch (error) {
    res.status(500).json("Error creating user and bank account");
  }
});

// Route - Logga in
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await query<User>("SELECT * FROM users WHERE username = ?", [username]);
    const user = users[0];

    if (user && user.password === password) {
      const token = `fake-token-${Date.now()}`;

      res.status(200).json({
        message: `Login successful for user: ${username}`,
        newSession: {
          token: token,
        },
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } else {
      res.status(401).json("Invalid username or password");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route - Hämta saldo
app.get("/account/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const accounts = await query<Account>("SELECT * FROM accounts WHERE user_id = ?", [userId]);
    const account = accounts[0];

    if (account) {
      res.status(200).json({ amount: account.amount });
    } else {
      res.status(404).json("Account not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route - Lägg in pengar
app.post("/account/:userId/transaction", async (req, res) => {
  const { userId, amount } = req.body;

  try {
    if (amount > 0) {
      await query<Account>("UPDATE accounts SET amount = amount + ? WHERE user_id = ?", [amount, userId]);
      res.status(200).json({ message: `Saldo uppdaterat med ${amount} kronor` });
    } else {
      res.status(400).json({ error: "Du måste lägga in mer än 0 kronor" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Kör app
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
