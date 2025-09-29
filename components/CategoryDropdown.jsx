"use client";
import { useState, useEffect } from "react";
import Select from "react-select";

const CategoryDropdown = ({ value, onChange, className = "" }) => {
  const [categories, setCategories] = useState([]);
  const [custom, setCustom] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"}/entries/getCategory`,
          { credentials: "include" }
        );
        const data = await res.json();
        const catSet = new Set(data.map((e) => e.category).filter(Boolean));
        setCategories([...catSet]);
        console.log("setCategoriessetCategoriessetCategories", setCategories);
        
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    load();
  }, []);

  const options = [
    ...categories.map((c) => ({ value: c, label: c })),
    { value: "custom", label: "Custom" },
  ];

  return (
    <div className={`w-full ${className}`}>
      <Select
        classNamePrefix="react-select"
        placeholder="Select or search category"
        options={options}
        value={
          categories.includes(value)
            ? { value, label: value }
            : value
            ? { value: "custom", label: "Custom" }
            : null
        }
        onChange={(opt) => {
          if (opt.value === "custom") {
            onChange(custom);
          } else {
            onChange(opt.value);
          }
        }}
        isSearchable
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "0.375rem",
            padding: "2px 4px",
          }),
        }}
      />

      {/* custom input when user picks "Custom" */}
      {(!categories.includes(value) && value) && (
        <input
          type="text"
          placeholder="Enter custom category"
          className="mt-2 w-full border px-3 py-2 rounded"
          value={custom || value}
          onChange={(e) => {
            setCustom(e.target.value);
            onChange(e.target.value);
          }}
        />
      )}
    </div>
  );
};

export default CategoryDropdown;
