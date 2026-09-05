import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function clearUserSession() {

        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        localStorage.removeItem("userToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("adminRole");
    }

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Please enter the admin email address.");
            return;
        }

        if (!password) {
            setError("Please enter the admin password.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        password
                    })
                }
            );

            const data =
                await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    data.detail ||
                    "Invalid administrator credentials."
                );
            }

            const token =
                data.token ||
                data.accessToken ||
                data.access_token;

            if (!token) {
                throw new Error(
                    "Admin login succeeded but no token was returned."
                );
            }

            /*
             * Remove any USER session.
             */
            clearUserSession();

            /*
             * Create ADMIN session.
             *
             * Existing admin pages currently use the generic
             * "token", so we intentionally keep that key for
             * admin sessions.
             */
            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "role",
                "ADMIN"
            );

            localStorage.setItem(
                "email",
                data.email || email.trim()
            );

            localStorage.setItem(
                "name",
                data.name || "Admin"
            );

            localStorage.setItem(
                "adminToken",
                token
            );

            localStorage.setItem(
                "adminEmail",
                data.email || email.trim()
            );

            localStorage.setItem(
                "adminName",
                data.name || "Admin"
            );

            localStorage.setItem(
                "adminRole",
                "ADMIN"
            );

            navigate(
                "/admin",
                {
                    replace: true
                }
            );

        } catch (error) {

            console.error(
                "Admin login failed:",
                error
            );

            setError(
                error.message ||
                "Unable to login."
            );

        } finally {

            setLoading(false);
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8fafc",
                padding: "30px 20px",
                boxSizing: "border-box",
                fontFamily: "Arial, Helvetica, sans-serif"
            }}
        >

            <div
                style={{
                    width: "500px",
                    minHeight: "558px",
                    boxSizing: "border-box",
                    background: "#ffffff",
                    border: "1px solid #dfe3ea",
                    borderRadius: "20px",
                    padding: "48px 42px 42px"
                }}
            >

                <div
                    style={{
                        textAlign: "center"
                    }}
                >

                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            margin: "0 auto 18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "16px",
                            background: "#5b5bf6",
                            color: "#ffffff",
                            fontSize: "27px",
                            fontWeight: 600
                        }}
                    >
                        M
                    </div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: "34px",
                            fontWeight: 500,
                            color: "#080808"
                        }}
                    >
                        MediCompare
                    </h1>

                    <p
                        style={{
                            margin: "7px 0 0",
                            fontSize: "16px",
                            color: "#61708a"
                        }}
                    >
                        Admin Portal
                    </p>

                </div>

                <div
                    style={{
                        marginTop: "40px"
                    }}
                >

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "25px",
                            fontWeight: 500,
                            color: "#111111"
                        }}
                    >
                        Welcome back
                    </h2>

                    <p
                        style={{
                            margin: "8px 0 0",
                            fontSize: "16px",
                            color: "#707784"
                        }}
                    >
                        Sign in to manage hospitals, services and pricing.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        marginTop: "30px"
                    }}
                >

                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#333333"
                        }}
                    >
                        Email address
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setError("");
                        }}
                        placeholder="admin@example.com"
                        autoComplete="username"
                        style={{
                            width: "100%",
                            height: "58px",
                            boxSizing: "border-box",
                            border: "1px solid #d5dbe4",
                            borderRadius: "16px",
                            padding: "0 18px",
                            fontSize: "16px",
                            outline: "none"
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            marginTop: "20px",
                            marginBottom: "8px",
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#333333"
                        }}
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                            setError("");
                        }}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        style={{
                            width: "100%",
                            height: "58px",
                            boxSizing: "border-box",
                            border: "1px solid #d5dbe4",
                            borderRadius: "16px",
                            padding: "0 18px",
                            fontSize: "16px",
                            outline: "none"
                        }}
                    />

                    {error && (
                        <div
                            style={{
                                marginTop: "15px",
                                padding: "11px 14px",
                                borderRadius: "10px",
                                background: "#fef2f2",
                                border: "1px solid #fecaca",
                                color: "#dc2626",
                                fontSize: "13px"
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "58px",
                            marginTop: "22px",
                            border: "none",
                            borderRadius: "29px",
                            background: "#5b5bf6",
                            color: "#ffffff",
                            fontSize: "19px",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            opacity: loading ? 0.65 : 1
                        }}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        style={{
                            display: "block",
                            margin: "18px auto 0",
                            padding: 0,
                            border: "none",
                            background: "transparent",
                            color: "#5151f5",
                            fontSize: "15px",
                            cursor: "pointer"
                        }}
                    >
                        ← User Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AdminLogin;