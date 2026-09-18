import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL as API_URL } from "../config";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    /*
     * Wake the backend the moment this page opens (cold free-tier
     * servers need ~30-60s to boot). By the time the user has filled
     * the form, the server is usually already awake.
     */
    useEffect(() => {
        fetch(`${API_URL}/api/hello`, {
            signal: AbortSignal.timeout(10000),
        }).catch(() => {
            // Silent: a sleeping backend wakes on this request anyway.
        });
    }, []);

    const clearAuthentication = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("refreshToken");

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("adminRole");

        localStorage.removeItem("userToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userRefreshToken");
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setMessage("");
        setMessageType("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setMessageType("");

        const name = form.name.trim();
        const email = form.email.trim();

        if (!name) {
            setMessage("Please enter your full name.");
            setMessageType("error");
            return;
        }

        if (!email) {
            setMessage("Please enter your email address.");
            setMessageType("error");
            return;
        }

        if (form.password.length < 8) {
            setMessage("Password must contain at least 8 characters.");
            setMessageType("error");
            return;
        }

        if (!/[A-Z]/.test(form.password)) {
            setMessage(
                "Password must contain at least one uppercase letter."
            );
            setMessageType("error");
            return;
        }

        if (!/[a-z]/.test(form.password)) {
            setMessage(
                "Password must contain at least one lowercase letter."
            );
            setMessageType("error");
            return;
        }

        if (!/[0-9]/.test(form.password)) {
            setMessage(
                "Password must contain at least one number."
            );
            setMessageType("error");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setMessage("Passwords do not match.");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/user/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Fail fast instead of hanging on a sleeping server.
                    signal: AbortSignal.timeout(15000),
                    body: JSON.stringify({
                        name,
                        email,
                        password: form.password
                    })
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    data.detail ||
                    "Unable to create your account."
                );
            }

            /*
             * Clear any previous session first, then store the new
             * session from registration so the user is auto-logged in.
             */
            clearAuthentication();

            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userToken", data.token);
            }

            if (data.name) {
                localStorage.setItem("name", data.name);
                localStorage.setItem("userName", data.name);
            }

            if (data.email) {
                localStorage.setItem("email", data.email);
                localStorage.setItem("userEmail", data.email);
            }

            if (data.role) {
                localStorage.setItem("role", data.role);
                localStorage.setItem("userRole", data.role);
            }

            navigate("/hospitals", {
                replace: true
            });

        } catch (error) {
            console.error("Registration failed:", error);

            const isTimeout =
                error?.name === "TimeoutError" ||
                error?.name === "AbortError";

            setMessage(
                isTimeout
                    ? "The server is waking up (cold start). Please press Create account again in a few seconds."
                    : error.message ||
                        "Unable to create your account. Please try again."
            );

            setMessageType("error");

        } finally {
            setLoading(false);
        }
    };

    const inputClassName =
        "h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

    const labelClassName =
        "mb-1 block text-[13px] font-semibold text-ink-900";

    return (
        <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-6">

            <div className="w-full max-w-[420px] rounded-2xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="flex items-center gap-2.5">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white">
                        M
                    </div>

                    <div>

                        <div className="text-sm font-bold tracking-tight text-ink-900">
                            MediCompare
                        </div>

                        <div className="text-[11px] text-ink-400">
                            Healthcare comparison
                        </div>

                    </div>

                </div>

                <h1 className="mt-4 text-xl font-bold tracking-tight text-ink-900">
                    Create your account
                </h1>

                <p className="mt-0.5 text-[13px] text-ink-500">
                    Compare hospitals, services and prices
                </p>

                <form onSubmit={handleSubmit} className="mt-4">

                    <div>

                        <label
                            htmlFor="register-name"
                            className={labelClassName}
                        >
                            Full name
                        </label>

                        <input
                            id="register-name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            className={inputClassName}
                        />

                    </div>

                    <div className="mt-3">

                        <label
                            htmlFor="register-email"
                            className={labelClassName}
                        >
                            Email address
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            className={inputClassName}
                        />

                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">

                        <div>

                            <label
                                htmlFor="register-password"
                                className={labelClassName}
                            >
                                Password
                            </label>

                            <input
                                id="register-password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Strong password"
                                autoComplete="new-password"
                                className={inputClassName}
                            />

                        </div>

                        <div>

                            <label
                                htmlFor="register-confirm"
                                className={labelClassName}
                            >
                                Confirm password
                            </label>

                            <input
                                id="register-confirm"
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repeat password"
                                autoComplete="new-password"
                                className={inputClassName}
                            />

                        </div>

                    </div>

                    <p className="mt-1.5 text-[11px] leading-4 text-ink-400">
                        8+ characters, including uppercase, lowercase and a number.
                    </p>

                    {message && (
                        <div
                            className={
                                messageType === "success"
                                    ? "mt-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-[13px] text-green-700"
                                    : "mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700"
                            }
                        >
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 h-10 w-full rounded-xl bg-brand-500 text-sm font-bold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Creating account..."
                            : "Create account"}
                    </button>

                    <p className="mt-3 text-center text-[13px] text-ink-500">
                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-semibold text-brand-600 transition hover:text-brand-700"
                        >
                            Sign in
                        </Link>
                    </p>

                </form>

            </div>

        </div>
    );
}

export default Register;
