// app/[slug]/loading.tsx
// FIX: Replaced inline style with CSS module class
import styles from "./page.module.css";

export default function Loading() {
  return <div className={styles.wrapper}>Loading post...</div>;
}
