import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Add() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    name: "",
    category: "",
    size: "",
    color: "",
    price: "",
    quantity: "",
  });

  // Fetch existing data when editing
  useEffect(() => {
    if (id) {
      fetch(`/api/clothes/${id}`)
        .then((res) => res.json())
        .then((data) => {
          // normalize numbers to strings so inputs show them correctly
          setForm({
            name: data.name ?? "",
            category: data.category ?? "",
            size: data.size ?? "",
            color: data.color ?? "",
            price: data.price != null ? String(data.price) : "",
            quantity: data.quantity != null ? String(data.quantity) : "",
          });
        })
        .catch((err) => console.error("Error loading item:", err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Required-check (use String(...) so numbers are handled)
    for (const [key, value] of Object.entries(form)) {
      if (String(value).trim() === "") {
        alert(`Please fill in the ${key} field.`);
        return;
      }
    }

    // 2) Numeric validation
    const priceNum = Number(form.price);
    const qtyNum = Number(form.quantity);

    if (Number.isNaN(priceNum) || priceNum < 0) {
      alert("Price must be a non-negative number.");
      return;
    }

    if (!Number.isInteger(qtyNum) || qtyNum < 0) {
      alert("Quantity must be a non-negative integer.");
      return;
    }

    // prepare payload with proper numeric types
    const payload = {
      name: form.name,
      category: form.category,
      size: form.size,
      color: form.color,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/clothes/${id}` : "/api/clothes";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    router.push("/");
  };

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">{id ? "Edit Clothes" : "Add Clothes"}</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          placeholder="name"
          className="border p-2 w-full bg-white text-black rounded"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          required
        />

        <input
          placeholder="size"
          className="border p-2 w-full bg-white text-black rounded"
          value={form.size}
          onChange={(e) => setField("size", e.target.value)}
          required
        />

        <input
          placeholder="color"
          className="border p-2 w-full bg-white text-black rounded"
          value={form.color}
          onChange={(e) => setField("color", e.target.value)}
          required
        />

        <input
          placeholder="price"
          type="number"
          step="0.01"
          min="0"
          className="border p-2 w-full bg-white text-black rounded"
          value={form.price}
          onChange={(e) => setField("price", e.target.value)}
          required
        />

        <input
          placeholder="quantity"
          type="number"
          step="1"
          min="0"
          className="border p-2 w-full bg-white text-black rounded"
          value={form.quantity}
          onChange={(e) => setField("quantity", e.target.value)}
          required
        />

        {/* Category Dropdown */}
        <select
          className="border p-2 w-full bg-white text-black rounded"
          value={form.category}
          onChange={(e) => setField("category", e.target.value)}
          required
        >
          <option value="">Select category</option>
          <option value="casual">Casual</option>
          <option value="sports">Sports</option>
          <option value="foot">Foot</option>
          <option value="accessories">Accessories</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {id ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
}
