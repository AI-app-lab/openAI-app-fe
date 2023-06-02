import React, { useState, useEffect } from "react";
import TransHeader from "./components/TransHeader";
import styles from "./index.module.scss";
import TransTextArea from "./components/TransTextArea";
import IconButton from "../../components/IconButon/IconButton";

import { AiOutlineArrowRight } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { AiTranslateApiRequestDto, AiTranslateState, Language, getTranslatedResult, setText } from "../../store/aiTranslateApiSlice";

type Props = {};

const Translator = (props: Props) => {
  const [input, setInput] = useState<string>("");

  const dispatch: Function = useDispatch();
  const { language, result } = useSelector((state: AiTranslateState) => state.aiTranslate);

  const handleTranslate = () => {
    console.log("handleTranslate", input, language);
    const requestDto: AiTranslateApiRequestDto = {
      text: input,
      language: language,
    };
    dispatch(getTranslatedResult(requestDto));
  };
  useEffect(() => {
    return () => {
      dispatch(setText(""));
    };
  });
  return (
    <div className={styles.container}>
      <TransHeader />

      <div className={styles.body}>
        <IconButton onClick={handleTranslate} className={styles.translateBtn}>
          <AiOutlineArrowRight />
        </IconButton>
        <TransTextArea type={"user"} value={input} onChange={(e) => setInput(e.target.value)} />
        <TransTextArea type={"system"} value={result} />
      </div>
      <div className={styles.footer}></div>
    </div>
  );
};

export default Translator;
