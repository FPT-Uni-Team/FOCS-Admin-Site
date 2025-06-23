import styles from "./ContentInner.module.scss";

interface ContentInnerProps {
  children: React.ReactNode;
}
const ContentInner: React.FC<ContentInnerProps> = ({ children }) => {
  return <div className={styles.contentInner}>{children}</div>;
};

export default ContentInner;
