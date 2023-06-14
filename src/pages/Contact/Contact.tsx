import React from "react";
import styles from "./index.module.scss";

type Props = {};

const Contact = (props: Props) => {
  const { container } = styles;
  return (
    <div className={container}>
      <h1>给我们建议/与我们合作</h1>
      <h2>请联系我们的邮箱：hang716716@gmail.com</h2>
    </div>
  );
};

export default Contact;
