export default function CategoryDropdown({ value, onChange, className = "" }) {
  const categories = ["Work", "Personal", "Ideas", "Other"];

  return (
    <select
      className={`w-full border px-3 py-2 rounded appearance-none bg-white bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='gray' d='M5.25 7L10 12l4.75-5H5.25z'/%3E%3C/svg%3E")] bg-no-repeat bg-right pr-8 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select Category</option>
      {categories.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
