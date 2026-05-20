interface TimerProps {
  remainingMs: number;
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export default function Timer({ remainingMs }: TimerProps) {
  const safe = Math.max(0, remainingMs);
  const totalSec = Math.ceil(safe / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  const warning = safe <= 60_000;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-bold tabular-nums ${
        warning
          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
          : "border-black bg-white text-black dark:border-white dark:bg-black dark:text-white"
      }`}
      aria-live="polite"
    >
      <span aria-hidden="true">⏱</span>
      <span>
        {pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  );
}
