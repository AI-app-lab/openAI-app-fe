import React from "react";
import styles from "./index.module.scss";

type Props = {
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
};

const AlertBubble = (props: Props) => {
  return (
    <div className={styles.alertBubbleContainer}>
      <div>AlertBubble</div>
    </div>
  );
};

export default AlertBubble;
