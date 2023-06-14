import React from "react";
import styles from "./index.module.scss";
type Props = {
  children?: React.ReactNode;
  open: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
};

const Modal = ({ onClose, children, open, setIsOpen = () => {} }: Props) => {
  const { wrapper, modal } = styles;
  if (!open) return <></>;
  return (
    <div
      onClick={() => {
        onClose && onClose();
        setIsOpen(false);
      }}
      className={wrapper}>
      <div
        className={modal}
        onClick={(e) => {
          e.stopPropagation();
        }}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
