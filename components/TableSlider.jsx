"use client";
import { useState } from "react";

export default function TableSlider({ entries, entriesPerSlide = 5, onEdit, onDelete }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = Math.ceil(entries.length / entriesPerSlide);
  const startIndex = currentSlide * entriesPerSlide;
  const endIndex = startIndex + entriesPerSlide;
  const visibleEntries = entries.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg shadow mt-4">
      <table className="w-full text-left text-sm min-w-[800px] border-separate border-spacing-0l">
        <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-xl">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Note Title</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Content</th>
            <th className="px-4 py-2">Creation Date</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleEntries.map((e, i) => (
            <tr key={e.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{startIndex + i + 1}</td>
              <td className="px-4 py-2">{e.title}</td>
              <td className="px-4 py-2">{e.category || "-"}</td>
              <td className="px-4 py-2">{e.content || "-"}</td>
              <td className="px-4 py-2">
                {new Date(e.created_at).toLocaleString("en-PK", {
                  timeZone: "Asia/Karachi",
                })}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onEdit(e)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  View
                </button>
                <button
                  onClick={() => onDelete(e.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                No entries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {entries.length > entriesPerSlide && (
        <div className="flex justify-between items-center p-4">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Slide {currentSlide + 1} of {totalSlides}
          </span>
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
            disabled={currentSlide === totalSlides - 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
