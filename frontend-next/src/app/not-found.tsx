import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#E4D6A9", padding: "2rem", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center", maxWidth: "500px" }}>
        <h2 style={{ fontSize: "4rem", color: "#622B14", fontFamily: "var(--font-display)", lineHeight: 1 }}>404</h2>
        <p style={{ color: "#978F66", marginBottom: "1.5rem", fontSize: "1rem" }}>This page could not be found.</p>
        <Link href="/" style={{ display: "inline-block", padding: "0.75rem 2rem", background: "#622B14", color: "#E4D6A9", borderRadius: "0.375rem", fontWeight: "bold", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
