import { useExam } from "../context/useExam";

interface ThemeToggleProps {
  disabled?: boolean;
}

export default function ThemeToggle({ disabled }: ThemeToggleProps) {
  const { theme, toggleTheme } = useExam();
  const label = theme === "light" ? "Тёмная тема" : "Светлая тема";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-3 py-2 text-xs font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-white dark:bg-black dark:text-white"
    >
      <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
      <span>{theme === "light" ? "Тёмная" : "Светлая"}</span>
    </button>
  );
}
