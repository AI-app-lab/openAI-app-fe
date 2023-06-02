import React, { useState } from "react";
import styles from "../index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AiTranslateState, Language, setLanguage } from "../../../store/aiTranslateApiSlice";
import { locations } from "../../../localization";
import { useLanguage } from "../../../hooks/useConfig";

type Props = {};

const TransHeader = ({}: Props) => {
  const location = useLanguage();
  const dispatch = useDispatch();
  return (
    <div className={styles.headerContainer}>
      <div>自动检测</div>
      <select onChange={(e) => dispatch(setLanguage(e.target.value as Language))} className={styles.selector}>
        {locations[location].languages.map((item) => {
          return (
            <option key={item} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default TransHeader;
