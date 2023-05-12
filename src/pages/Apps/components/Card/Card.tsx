import React from "react";
import styles from "../../index.module.scss";

type Props = {
  title: string;
  content: string;
  media: JSX.Element;
  bg: string;
  className?: string;
};

const Card = ({ bg, title, content, media }: Props) => {
  return (
    <div className={`${styles.cardContainer} ${styles.className}`}>
      <div
        style={{
          backgroundColor: bg,
        }}
        className={styles.media}>
        {media}
      </div>
      <div className={styles.rightPart}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
};

export default Card;
