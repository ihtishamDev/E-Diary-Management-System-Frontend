import { useState } from "react";
import { useRouter } from "next/router";



const forgetPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const onFinish = async () => {
        setLoading(true);
        setMsg("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE}/auth/forgetpassword`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            if (res.ok) {
                const j = await res.json();
                setMsg(j.message || "Reset link sent to your email");
                // Optionally redirect back to login after a delay:
                setTimeout(() => router.push("/registerEmail"), 1200);
            } else {
                const j = await res.json().catch(() => ({}));
                setMsg(j.detail || "Something went wrong.");
            }
        } catch (err) {
            setMsg("Unable to connect to server.");
        }
        setLoading(false);
    };

    return (
        <div className="bg-[url('/images/dashboard/dashboard_back.png')] bg-no-repeat bg-cover min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-center text-2xl font-bold mb-2">
                    Forgot password?
                </h1>
                <p className="text-center text-gray-600 text-sm mb-6">
                    No worries! Just enter your email and we’ll send you a reset link.
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onFinish();
                    }}
                    className="space-y-4"
                >
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border-b p-2 outline-none text-sm"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {msg && <p className="text-center text-sm mt-3">{msg}</p>}

                <div className="mt-6 text-center">
                    <a
                        href="/forgot-email"
                        className="text-sm text-gray-500 hover:underline"
                    >
                        Forgot email address?
                    </a>
                </div>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => router.push("/")}
                        className="text-sm text-gray-500 hover:underline"

                    >
                        Login
                    </button>
                </div>

            </div>
        </div>
    );
};

export default forgetPassword;
