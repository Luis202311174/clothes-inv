import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [clothes, setClothes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const loadData = async (term = "", cat = "") => {
    const res = await fetch(`/api/clothes?search=${term}&category=${cat}`);
    setClothes(await res.json());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Delete this item?")) {
      await fetch(`/api/clothes/${id}`, { method: "DELETE" });
      loadData(search, category);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">👕 Clothes Inventory</h1>

      <div className="mb-4 flex items-center gap-2">
        {/* Search */}
        <input
          className="border p-2"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            const val = e.target.value;
            setSearch(val);
            loadData(val, category);
          }}
        />

        {/* Category Filter */}
        <select
          className="border p-2"
          value={category}
          onChange={(e) => {
            const cat = e.target.value;
            setCategory(cat);
            loadData(search, cat);
          }}
        >
          <option value="">All Categories</option>
          <option value="casual">Casual</option>
          <option value="sports">Sports</option>
          <option value="foot">Foot</option>
          <option value="accessories">Accessories</option>
        </select>

        {/* Add Button */}
        <Link href="/add" className="bg-blue-500 text-white px-3 py-2 rounded">
          + Add
        </Link>
      </div>

      <table className="mt-4 border-collapse w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Qty</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {clothes.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-2">{c.id}</td>
              <td className="p-2">{c.name}</td>
              <td className="p-2 capitalize">{c.category}</td>
              <td className="p-2">{c.price}</td>
              <td className="p-2">{c.quantity}</td>
              <td className="p-2">
                <Link href={`/add?id=${c.id}`} className="text-blue-500">
                  Edit
                </Link>{" "}
                |{" "}
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {clothes.length === 0 && (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
