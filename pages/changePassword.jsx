import { useState } from "react";
import SideBar from "../components/SideBar";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: match check
    if (newPassword !== confirmPassword) {
      alert("New password and Confirm password do not match");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"}/auth/changepassword`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await res.json();
      console.log("Change password:", data);

      if (res.ok) {
        alert("Password changed successfully ✅");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.detail || "Failed to change password ❌");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen bg-[url('/images/dashboard/dashboard_back.png')] bg-no-repeat bg-cover">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex-1  flex items-center justify-center p-6">
        <div className="bg-white bg-opacity-90 shadow-lg rounded-lg  w-full p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Change Password</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
