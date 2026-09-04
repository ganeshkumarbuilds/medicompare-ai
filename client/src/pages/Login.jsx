import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const initialMode =
        location.pathname === "/admin/login"
            ? "ADMIN"
            : "USER";

    const [loginType, setLoginType] = useState(initialMode);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    function clearOldSessions() {

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

        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRefreshToken");
        localStorage.removeItem("adminRefreshToken");
    }

    function handleLoginTypeChange(type) {

        setLoginType(type);

        setMessage("");
        setMessageType("");

        setPassword("");

        /*
         * Keep the URL consistent with the selected
         * authentication type.
         */
        if (type === "ADMIN") {
            navigate("/admin/login", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    }

    async function handleSubmit(event) {

        event.preventDefault();

        setMessage("");
        setMessageType("");

        if (!email.trim()) {
            setMessage("Please enter your email id.");
            setMessageType("error");
            return;
        }

        if (!password) {
            setMessage("Please enter your password.");
            setMessageType("error");
            return;
        }

        try {

            setLoading(true);

            /*
             * USER and ADMIN use completely separate
             * backend authentication endpoints.
             */
            const loginEndpoint =
                loginType === "ADMIN"
                    ? `${API_URL}/api/auth/login`
                    : `${API_URL}/api/user/auth/login`;

            const response = await fetch(
                loginEndpoint,
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
                    "Invalid email or password."
                );
            }

            const token =
                data.token ||
                data.accessToken ||
                data.access_token;

            if (!token) {
                throw new Error(
                    "Login succeeded but no authentication token was returned."
                );
            }

            /*
             * Always remove any previous session first.
             *
             * This prevents a USER from accidentally
             * inheriting an ADMIN session and vice versa.
             */
            clearOldSessions();

            /*
             * ==========================================
             * ADMIN LOGIN
             * ==========================================
             */
            if (loginType === "ADMIN") {

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

                if (data.name) {
                    localStorage.setItem(
                        "name",
                        data.name
                    );
                }

                localStorage.setItem(
                    "adminToken",
                    token
                );

                localStorage.setItem(
                    "adminRole",
                    "ADMIN"
                );

                localStorage.setItem(
                    "adminEmail",
                    data.email || email.trim()
                );

                if (data.name) {
                    localStorage.setItem(
                        "adminName",
                        data.name
                    );
                }

                if (
                    data.refreshToken ||
                    data.refresh_token
                ) {
                    localStorage.setItem(
                        "adminRefreshToken",
                        data.refreshToken ||
                        data.refresh_token
                    );
                }

                /*
                 * Admin goes to admin dashboard.
                 */
                navigate(
                    "/admin",
                    {
                        replace: true
                    }
                );

                return;
            }

            /*
             * ==========================================
             * USER LOGIN
             * ==========================================
             */

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "role",
                "USER"
            );

            localStorage.setItem(
                "email",
                data.email || email.trim()
            );

            if (data.name) {
                localStorage.setItem(
                    "name",
                    data.name
                );
            }

            localStorage.setItem(
                "userToken",
                token
            );

            localStorage.setItem(
                "userRole",
                "USER"
            );

            localStorage.setItem(
                "userEmail",
                data.email || email.trim()
            );

            if (data.name) {
                localStorage.setItem(
                    "userName",
                    data.name
                );
            }

            if (
                data.refreshToken ||
                data.refresh_token
            ) {
                localStorage.setItem(
                    "userRefreshToken",
                    data.refreshToken ||
                    data.refresh_token
                );
            }

            /*
             * User goes to user application.
             */
            navigate(
                "/hospitals",
                {
                    replace: true
                }
            );

        } catch (error) {

            console.error(
                `${loginType} login failed:`,
                error
            );

            setMessage(
                error.message ||
                "Unable to login. Please try again."
            );

            setMessageType("error");

        } finally {

            setLoading(false);
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
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
                    padding: "56px 42px 42px"
                }}
            >

                <h1
                    style={{
                        margin: 0,
                        textAlign: "center",
                        fontSize: "38px",
                        lineHeight: "1.2",
                        fontWeight: 500,
                        color: "#080808"
                    }}
                >
                    Login
                </h1>

                <p
                    style={{
                        margin: "14px 0 0",
                        textAlign: "center",
                        fontSize: "17px",
                        color: "#61708a"
                    }}
                >
                    Please sign in to continue
                </p>

                {/* ======================================
                    USER / ADMIN SELECTOR
                ======================================= */}

                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        height: "50px",
                        marginTop: "30px",
                        padding: "4px",
                        boxSizing: "border-box",
                        borderRadius: "27px",
                        background: "#f1f3f7"
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            handleLoginTypeChange("USER")
                        }
                        style={{
                            flex: 1,
                            border: "none",
                            borderRadius: "23px",
                            background:
                                loginType === "USER"
                                    ? "#5b5bf6"
                                    : "transparent",
                            color:
                                loginType === "USER"
                                    ? "#ffffff"
                                    : "#61708a",
                            fontSize: "15px",
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                    >
                        User
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleLoginTypeChange("ADMIN")
                        }
                        style={{
                            flex: 1,
                            border: "none",
                            borderRadius: "23px",
                            background:
                                loginType === "ADMIN"
                                    ? "#5b5bf6"
                                    : "transparent",
                            color:
                                loginType === "ADMIN"
                                    ? "#ffffff"
                                    : "#61708a",
                            fontSize: "15px",
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                    >
                        Admin
                    </button>

                </div>

                <div
                    style={{
                        marginTop: "12px",
                        textAlign: "center",
                        fontSize: "13px",
                        color: "#7b8798"
                    }}
                >
                    Signing in as{" "}
                    <strong
                        style={{
                            color: "#5151f5"
                        }}
                    >
                        {loginType === "ADMIN"
                            ? "Administrator"
                            : "User"}
                    </strong>
                </div>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        marginTop: "30px"
                    }}
                >

                    {/* ======================================
                        EMAIL
                    ======================================= */}

                    <div
                        style={{
                            position: "relative"
                        }}
                    >

                        <span
                            style={{
                                position: "absolute",
                                left: "27px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#687387"
                            }}
                        >
                            ✉
                        </span>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setMessage("");
                            }}
                            placeholder="Email id"
                            autoComplete="email"
                            style={{
                                width: "100%",
                                height: "62px",
                                boxSizing: "border-box",
                                border: "1px solid #d5dbe4",
                                borderRadius: "31px",
                                padding: "0 24px 0 60px",
                                fontSize: "16px",
                                color: "#344054",
                                outline: "none"
                            }}
                        />

                    </div>

                    {/* ======================================
                        PASSWORD
                    ======================================= */}

                    <div
                        style={{
                            position: "relative",
                            marginTop: "20px"
                        }}
                    >

                        <span
                            style={{
                                position: "absolute",
                                left: "27px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#687387"
                            }}
                        >
                            🔒
                        </span>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setMessage("");
                            }}
                            placeholder="Password"
                            autoComplete="current-password"
                            style={{
                                width: "100%",
                                height: "62px",
                                boxSizing: "border-box",
                                border: "1px solid #d5dbe4",
                                borderRadius: "31px",
                                padding: "0 24px 0 60px",
                                fontSize: "16px",
                                color: "#344054",
                                outline: "none"
                            }}
                        />

                    </div>

                    {/* ======================================
                        MESSAGE
                    ======================================= */}

                    {message && (
                        <div
                            style={{
                                marginTop: "16px",
                                padding: "10px 14px",
                                borderRadius: "10px",
                                fontSize: "13px",
                                background:
                                    messageType === "error"
                                        ? "#fef2f2"
                                        : "#eff6ff",
                                border:
                                    messageType === "error"
                                        ? "1px solid #fecaca"
                                        : "1px solid #bfdbfe",
                                color:
                                    messageType === "error"
                                        ? "#dc2626"
                                        : "#2563eb"
                            }}
                        >
                            {message}
                        </div>
                    )}

                    {/* ======================================
                        FORGOT PASSWORD
                    ======================================= */}

                    <button
                        type="button"
                        onClick={() => {
                            setMessage(
                                "Password recovery is not available yet."
                            );
                            setMessageType("info");
                        }}
                        style={{
                            display: "block",
                            marginTop: "24px",
                            padding: 0,
                            border: "none",
                            background: "transparent",
                            color: "#5151f5",
                            fontSize: "16px",
                            cursor: "pointer"
                        }}
                    >
                        Forgot password?
                    </button>

                    {/* ======================================
                        LOGIN BUTTON
                    ======================================= */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "57px",
                            marginTop: "12px",
                            border: "none",
                            borderRadius: "29px",
                            background: "#5b5bf6",
                            color: "#ffffff",
                            fontSize: "20px",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            opacity: loading ? 0.65 : 1
                        }}
                    >
                        {loading
                            ? "Logging in..."
                            : loginType === "ADMIN"
                                ? "Login as Admin"
                                : "Login"}
                    </button>

                    {/* ======================================
                        REGISTER
                    ======================================= */}

                    {loginType === "USER" && (
                        <p
                            style={{
                                margin: "18px 0 0",
                                textAlign: "center",
                                fontSize: "17px",
                                color: "#61708a"
                            }}
                        >
                            Don’t have an account?{" "}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/register")
                                }
                                style={{
                                    padding: 0,
                                    border: "none",
                                    background: "transparent",
                                    color: "#5151f5",
                                    fontSize: "17px",
                                    cursor: "pointer"
                                }}
                            >
                                Sign up
                            </button>
                        </p>
                    )}

                </form>

            </div>

        </div>
    );
}

export default Login;