import React from "react";
import { HashLoader as _HashLoader } from "react-spinners";

type Props = {
  transparent?: boolean;
};

const HashLoader = ({ transparent = false }: Props) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: transparent ? "transparent" : "black",
        zIndex: 8888,
      }}>
      <_HashLoader color="#468efd" />
    </div>
  );
};

export default HashLoader;
