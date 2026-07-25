"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#E4D6A9", padding: "2rem", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center", maxWidth: "500px" }}>
        <h2 style={{ fontSize: "1.5rem", color: "#622B14", marginBottom: "1rem" }}>Something went wrong</h2>
        <p style={{ color: "#978F66", marginBottom: "1.5rem", fontSize: "0.875rem" }}>{error.message}</p>
        <button onClick={() => reset()} style={{ padding: "0.75rem 2rem", background: "#622B14", color: "#E4D6A9", border: "none", borderRadius: "0.375rem", cursor: "pointer", fontWeight: "bold", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Try again
        </button>
      </div>
    </div>
  );
}
