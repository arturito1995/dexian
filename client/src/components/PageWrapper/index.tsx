import styles from "./styles.module.scss";
export const PageWrapper = ({ children }: React.PropsWithChildren) => (
  <div className={styles["page-wrapper"]}>{children}</div>
);
