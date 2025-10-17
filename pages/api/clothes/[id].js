import { query } from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const data = await query("SELECT * FROM clothes WHERE id = ?", [id]);
    res.json(data[0]);
  }

  if (req.method === "PUT") {
    const { name, category, size, color, price, quantity } = req.body;
    await query(
      "UPDATE clothes SET name=?, category=?, size=?, color=?, price=?, quantity=? WHERE id=?",
      [name, category, size, color, price, quantity, id]
    );
    res.json({ message: "Updated successfully" });
  }

  if (req.method === "DELETE") {
    await query("DELETE FROM clothes WHERE id=?", [id]);
    res.json({ message: "Deleted successfully" });
  }
}
