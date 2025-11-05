import React from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = React.useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "dark"
  );

  React.useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      style={{
        border: 0,
        background: "none",
        cursor: "pointer",
        color: "#fff",
        fontSize: 24,
        marginLeft: 24,
      }}
      title="Alternar tema"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;
