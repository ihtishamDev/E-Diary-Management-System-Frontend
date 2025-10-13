"use client";
import Image from "next/image";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileCard() {
  const [user, setUser] = useState({});
  const [err, setErr] = useState("");
  const router = useRouter();

  async function load() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/getuser`,
        { credentials: "include" }
      );
      if (res.status === 401) return router.push("/");
      const data = await res.json();
      console.log("Fetched User:", data);
      setUser(data[0]);
    } catch (e) {
      setErr(String(e));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateprofile(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const base = process.env.NEXT_PUBLIC_API_BASE;

      const payload = {
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        gender: user.gender,
      };

      const res = await fetch(`${base}/auth/updateuser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update data: ${res.status} - ${text}`);
      }

      const updated = await res.json();
      setUser(updated);
      alert(" Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert(" Error updating profile");
    }
  }


  return (
    <div>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col bg-[url('/images/dashboard/dashboard_back.png')] bg-no-repeat bg-cover p-6">
          {/* Page Heading */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
            Profile
          </h1>

          {/* Profile Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <Image
                  src="/images/dashboard/profileimage.jpg"
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Upload New
                </button>
                <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                  Delete Avatar
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={updateprofile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={user?.name || ""}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={user?.phone_number || ""}
                  onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={user?.gender === "male"}
                      onChange={(e) => setUser({ ...user, gender: e.target.value })}
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={user?.gender === "female"}
                      onChange={(e) => setUser({ ...user, gender: e.target.value })}
                    />
                    Female
                  </label>
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Residential Address</label>
                <input
                  type="text"
                  value={user?.address || ""}
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
