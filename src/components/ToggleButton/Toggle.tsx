import React from "react";
import styles from "./index.module.scss";
import Button from "../Button/Button";
type Props = {
  children?: Array<string>;
  value?: string;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  className?: string;
  btnClassName?: string;
};

const Toggle = ({ className, children, btnClassName, value, setValue }: Props) => {
  const { selected, btn, toggleContainer } = styles;
  return (
    <div className={`${toggleContainer} ${className}`}>
      {children?.map((name, index) => (
        <Button className={`${btnClassName} ${btn} ${name === value ? selected : ""}`} key={name} onClick={() => setValue(name)}>
          {name}
        </Button>
      ))}
    </div>
  );
};

export default Toggle;
