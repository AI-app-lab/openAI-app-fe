import React, { CSSProperties } from "react";
import styles from "./index.module.scss";
type Props = {
  size?: number;
};

const Loading = ({ size = 10 }: Props) => {
  return (
    <div
      style={{
        height: 1.5 * size,
      }}
      className={styles.loading}>
      {[1, 2, 3].map((item) => (
        <div key={item} style={{ height: size, width: size, margin: `0 ${size / 2}px` }} className={styles.loadingItem} />
      ))}
    </div>
  );
};

export default Loading;
