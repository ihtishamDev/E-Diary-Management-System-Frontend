import { useState, useEffect } from "react";
import CategoryDropdown from "./CategoryDropdown";


export default function AddNoteModal({ open, onClose, onSubmit, entry, categories = [] }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (entry) {
      setTitle(entry.title || "");
      setCategory(entry.category || "");
      setContent(entry.content || "");
    } else {
      setTitle("");
      setCategory("");
      setContent("");
    }
  }, [entry]);

  if (!open) return null;

  function handleSave(e) {
    e.preventDefault();
    onSubmit({ title, category, content });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {entry ? "Edit Note" : "Add Note"}
        </h2>

        <form onSubmit={handleSave}>
          <input
            className="w-full border px-3 py-2 mb-4 rounded"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* ✅ Dropdown for only active categories */}
          {/* <select
            className="w-full border px-3 py-2 mb-4 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select> */}
          <CategoryDropdown 
  value={category} 
  onChange={setCategory} 
/>

          <textarea
            className="w-full border px-3 py-2 mb-4 rounded"
            rows={4}
            placeholder="Write your note content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              {entry ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
