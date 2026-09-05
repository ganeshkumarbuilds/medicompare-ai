import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");

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
             * IMPORTANT:
             * Clear any previous admin/user session first, then
             * store the new session from registration so the
             * user is auto-logged in.
             */
            clearAuthentication();

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            if (data.name) {
                localStorage.setItem("name", data.name);
            }

            if (data.email) {
                localStorage.setItem("email", data.email);
            }

            if (data.role) {
                localStorage.setItem("role", data.role);
            }

            setMessage(
                "Account created successfully. Redirecting..."
            );

            setMessageType("success");

            setForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            setTimeout(() => {
                navigate("/hospitals", {
                    replace: true
                });
            }, 1000);

        } catch (error) {
            console.error("Registration failed:", error);

            setMessage(
                error.message ||
                "Unable to create your account. Please try again."
            );

            setMessageType("error");

        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        height: "58px",
        boxSizing: "border-box",
        border: "1px solid #d5dbe4",
        borderRadius: "16px",
        background: "#ffffff",
        padding: "0 18px",
        fontSize: "16px",
        color: "#344054",
        outline: "none"
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8fafc",
                padding: "30px 20px",
                fontFamily: "Arial, Helvetica, sans-serif"
            }}
        >
            <div
                style={{
                    width: "500px",
                    boxSizing: "border-box",
                    background: "#ffffff",
                    border: "1px solid #dfe3ea",
                    borderRadius: "20px",
                    padding: "42px 42px 38px"
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        textAlign: "center",
                        fontSize: "32px",
                        lineHeight: "40px",
                        fontWeight: 500,
                        letterSpacing: "-0.5px",
                        color: "#080808"
                    }}
                >
                    Create your account
                </h1>

                <p
                    style={{
                        margin: "10px 0 0",
                        textAlign: "center",
                        fontSize: "16px",
                        lineHeight: "23px",
                        color: "#61708a"
                    }}
                >
                    Join MediCompare to compare hospitals, services and healthcare prices.
                </p>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        marginTop: "32px"
                    }}
                >
                    <div>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "15px",
                                lineHeight: "20px",
                                fontWeight: 600,
                                color: "#111827"
                            }}
                        >
                            Full name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginTop: "17px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "15px",
                                lineHeight: "20px",
                                fontWeight: 600,
                                color: "#111827"
                            }}
                        >
                            Email address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginTop: "17px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "15px",
                                lineHeight: "20px",
                                fontWeight: 600,
                                color: "#111827"
                            }}
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            style={inputStyle}
                        />

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "12px",
                                lineHeight: "18px",
                                color: "#8792a2"
                            }}
                        >
                            8+ characters, including uppercase, lowercase and a number.
                        </p>
                    </div>

                    <div style={{ marginTop: "17px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "15px",
                                lineHeight: "20px",
                                fontWeight: 600,
                                color: "#111827"
                            }}
                        >
                            Confirm password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Enter your password again"
                            autoComplete="new-password"
                            style={inputStyle}
                        />
                    </div>

                    {message && (
                        <div
                            style={{
                                marginTop: "14px",
                                padding: "10px 14px",
                                borderRadius: "10px",
                                fontSize: "13px",
                                lineHeight: "18px",
                                background:
                                    messageType === "success"
                                        ? "#f0fdf4"
                                        : "#fef2f2",
                                border:
                                    messageType === "success"
                                        ? "1px solid #bbf7d0"
                                        : "1px solid #fecaca",
                                color:
                                    messageType === "success"
                                        ? "#15803d"
                                        : "#dc2626"
                            }}
                        >
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "57px",
                            marginTop: "20px",
                            border: "none",
                            borderRadius: "29px",
                            background: "#5b5bf6",
                            color: "#ffffff",
                            fontSize: "19px",
                            fontWeight: 400,
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            opacity: loading ? 0.65 : 1
                        }}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                    <p
                        style={{
                            margin: "17px 0 0",
                            textAlign: "center",
                            fontSize: "16px",
                            lineHeight: "23px",
                            color: "#61708a"
                        }}
                    >
                        Already have an account?{" "}

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            style={{
                                padding: 0,
                                border: "none",
                                background: "transparent",
                                color: "#5151f5",
                                fontSize: "16px",
                                cursor: "pointer"
                            }}
                        >
                            Login
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;