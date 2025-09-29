import { useRouter } from "next/router";

const SideBar = () => {
  const router = useRouter();

  return (
    <aside className="w-64 bg-white  relative z-10">
      <div className="px-6 py-4 text-xl font-bold border-b">e-Diary MS</div>

      <nav className="p-4 space-y-2">
        <button
          onClick={() => router.push("/dashboard")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 font-medium"
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/categories")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          Categories
        </button>

        <button
          onClick={() => router.push("/notes")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          Notes
        </button>

        <div className="pt-4 border-t text-sm text-gray-500">
          PROFILE SETTINGS
        </div>

        <button
          onClick={() => router.push("/changePassword")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          Change Password
        </button>

        <button
          onClick={() => router.push("/myProfile")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          My Profile
        </button>

        <button
          onClick={() => router.push("/")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default SideBar;
