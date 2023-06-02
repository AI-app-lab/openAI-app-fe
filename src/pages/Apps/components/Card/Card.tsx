import React from "react";
import styles from "../../index.module.scss";

type Props = {
  title: string;
  content: string;
  media: JSX.Element;
  bg: string;
  className?: string;
  mediaStyle?: React.CSSProperties;

  cardTitleStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
};

const Card = ({ mediaStyle, cardTitleStyle, contentStyle, bg, title, content, media }: Props) => {
  return (
    <div className={`${styles.cardContainer} ${styles.className}`}>
      <div
        style={{
          backgroundColor: bg,
          ...mediaStyle,
        }}
        className={styles.media}>
        {media}
      </div>
      <div className={styles.rightPart}>
        <div style={cardTitleStyle} className={styles.cardTitle}>
          {title}
        </div>
        <div style={contentStyle} className={styles.content}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default Card;
