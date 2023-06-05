import React, { useState } from "react";
import styles from "./index.module.scss";
import Button from "../../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { AiDrawApiRequestDto, AiDrawState, getPictures } from "../../store/aiDrawApiSlice";
import Loading from "../../components/Loading/Loading";
import { FaPaintBrush } from "react-icons/fa";

type Props = {};

const Draw = (props: Props) => {
  const { n, size, images, isLoading } = useSelector((state: AiDrawState) => state.aiDraw);
  const dispatch: Function = useDispatch();
  const [prompt, setPrompt] = useState<string>("");
  const handleGenerate = () => {
    const requestDto: AiDrawApiRequestDto = {
      prompt: prompt,
      n: n,
      size: size,
    };
    dispatch(getPictures(requestDto));
  };
  const Img = () => {
    if (!images.length)
      return (
        <h1
          style={{
            fontSize: "5rem",
            color: "#808080",
            marginTop: "5rem",
          }}>
          <FaPaintBrush />
        </h1>
      );
    return <img className={styles.image} src={images[0]} alt={prompt} />;
  };
  return (
    <div className={styles.container}>
      <div className={styles.promptContainer}>
        <textarea onChange={(e) => setPrompt(e.target.value)} className={styles.input} placeholder="输入指令,例如：画一只猫" />
        <Button allow={!isLoading} onClick={handleGenerate} className={`${styles.generateBtn} ${isLoading ? styles.btnDisabled : ""}`} w={200} h={30}>
          生成
        </Button>
      </div>
      <div className={styles.imageContainer}>{isLoading ? <Loading size={10} /> : <Img />}</div>
    </div>
  );
};

export default Draw;
