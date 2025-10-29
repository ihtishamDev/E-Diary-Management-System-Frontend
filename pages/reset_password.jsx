import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Resetnew_password() {
    const router = useRouter();
    const { token } = router.query;

    const [new_password, setnew_password] = useState("");
    const [confirm_password, setconfirm_password] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!token) return;
    }, [token]);

    const handleReset = async (e) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        if (new_password !== confirm_password) {
            setMsg("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE}/auth/resetpassword?token=${token}`,
                {
                    method: "POST",
                    //   credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token,
                        new_password,
                        confirm_password
                    }),
                }
            );

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                setMsg(data.message || "Password reset successful!");
                setTimeout(() => router.push("/"), 2000);
            } else {
                // safely handle array/object errors
                const detail = Array.isArray(data.detail)
                    ? data.detail[0]?.msg
                    : typeof data.detail === "object"
                        ? JSON.stringify(data.detail)
                        : data.detail;

                setMsg(detail || data.message || "Invalid or expired token");
            }
        } catch (err) {
            setMsg("Server not responding. Try again later.");
        }

        setLoading(false);
    };

    return (
        <div className="bg-[url('/images/dashboard/dashboard_back.png')] bg-no-repeat bg-cover min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-center text-2xl font-bold mb-2">
                    Reset your password
                </h1>
                <p className="text-center text-gray-600 text-sm mb-6">
                    Enter your new password below.
                </p>

                <form onSubmit={handleReset} className="space-y-4">
                    {/* New password */}
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New password"
                            value={new_password}
                            onChange={(e) => setnew_password(e.target.value)}
                            required
                            className="w-full border-b p-2 outline-none text-sm"
                        />
                        <span
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2 top-2 cursor-pointer text-gray-500 text-sm select-none"
                        >
                            {showNewPassword ? "🙈 Hide" : "👁 Show"}
                        </span>
                    </div>

                    {/* Confirm password */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm password"
                            value={confirm_password}
                            onChange={(e) => setconfirm_password(e.target.value)}
                            required
                            className="w-full border-b p-2 outline-none text-sm"
                        />
                        <span
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-2 top-2 cursor-pointer text-gray-500 text-sm select-none"
                        >
                            {showConfirm ? "🙈 Hide" : "👁 Show"}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                {msg && <p className="text-center text-sm mt-3">{msg}</p>}

                <div className="mt-4 text-center">
                    <button
                        onClick={() => router.push("/")}
                        className="text-sm text-gray-500 hover:underline"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
