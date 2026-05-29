// app/[slug]/error.tsx
// FIX: Replaced inline styles with CSS module classes
"use client";

import styles from "./page.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className={styles.wrapper}>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset} className={styles.backBtn}>
        Retry
      </button>
    </div>
  );
}
