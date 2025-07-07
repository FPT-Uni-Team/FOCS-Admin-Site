import styles from "./ContentInner.module.scss";

interface ContentInnerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}
const ContentInner: React.FC<ContentInnerProps> = ({ children, style }) => {
  return (
    <div className={styles.contentInner} style={style}>
      {children}
    </div>
  );
};

export default ContentInner;
