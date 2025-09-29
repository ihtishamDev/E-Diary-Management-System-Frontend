import { useState, useEffect } from "react";

export default function EntryModal({ open, onClose, onSubmit, entry, categories = [] }) {
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
  }, [entry, open]);

  if (!open) return null;

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    onSubmit({ title, category, content });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {entry ? "Edit Note" : "Add Note"}
        </h2>

        {/* Title */}
        <input
          type="text"
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {/* Category Dropdown */}
        <select
          className="w-full border px-3 py-2 mb-4 rounded"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Content */}
        <textarea
          className="w-full border px-3 py-2 mb-4 rounded"
          rows={4}
          placeholder="Write your note content..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
