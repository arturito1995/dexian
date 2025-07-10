import styles from "./styles.module.scss";

export const Loader = () => (
  <div className={styles["loader-wrapper"]}>
    <div className={styles.loader} />
  </div>
);
