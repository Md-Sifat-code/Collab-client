import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
  iat: number;
  exp: number;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user: JwtPayload | null = null;

  if (token) {
    try {
      user = jwt.decode(token) as JwtPayload;
    } catch {
      user = null;
    }
  }

  if (!user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f0f2f5",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem 3rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "1rem", color: "#333" }}>Unauthorized</h2>
          <p>
            Please{" "}
            <a
              href="/login"
              style={{ color: "#0070f3", textDecoration: "underline" }}
            >
              log in
            </a>{" "}
            to access your dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
      }}
    >
      <section
        style={{
          background: "white",
          padding: "2rem 3rem",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgb(0 0 0 / 0.1)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <img
            src={user.avatar}
            alt={`${user.fullName} avatar`}
            width={96}
            height={96}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.8rem",
                color: "#222",
                fontWeight: "700",
              }}
            >
              Welcome, {user.fullName}
            </h1>
            <p
              style={{
                margin: 0,
                color: "#666",
                fontSize: "1rem",
                marginTop: "0.25rem",
              }}
            >
              {user.email}
            </p>
          </div>
        </div>

        <hr style={{ marginBottom: "1.5rem", borderColor: "#e0e0e0" }} />

        <section>
          <h2 style={{ color: "#333", marginBottom: "1rem" }}>
            Your Dashboard
          </h2>
          <p style={{ color: "#555", lineHeight: 1.6 }}>
            This is your personalized dashboard where you can access your
            profile information and manage your account.
          </p>
          {/* You can add more dashboard widgets, stats, or navigation here */}
        </section>
      </section>
    </main>
  );
}
