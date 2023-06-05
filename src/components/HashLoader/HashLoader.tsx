import React from "react";
import { HashLoader as _HashLoader } from "react-spinners";

type Props = {};

const HashLoader = (props: Props) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}>
      <_HashLoader color="#468efd" />
    </div>
  );
};

export default HashLoader;
