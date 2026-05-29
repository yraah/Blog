import styles from "./page.module.css";

export default function PostContent({ html }: { html: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}