import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search, category } = req.query;

    let sql = "SELECT * FROM clothes WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND (name LIKE ? OR color LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }

    const data = await query(sql, params);
    res.json(data);
  }

  if (req.method === "POST") {
    const { name, category, size, color, price, quantity } = req.body;
    await query(
      "INSERT INTO clothes (name, category, size, color, price, quantity) VALUES (?, ?, ?, ?, ?, ?)",
      [name, category, size, color, price, quantity]
    );
    res.status(201).json({ message: "Added successfully" });
  }
}
