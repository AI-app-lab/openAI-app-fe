import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "../Apps/components/Card/Card";
import { nanoid } from "nanoid";
import { cards } from "../Apps/Apps";
import styles from "./index.module.scss";
import { FaCrown } from "react-icons/fa";
import { useLocation } from "react-router-dom";
type Props = {};

const Product = (props: Props) => {
  return (
    <>
      <div className={styles.title}>我们的产品</div>
      <div className={styles.service}>
        <Grid container rowSpacing={5}>
          {cards.map(({ title, content, media, bg }) => (
            <Grid key={nanoid()} xs={12} sm={6}>
              <div className={`${styles.item}  ${title === "口语" ? styles.itemRecommended : ""}`}>
                <Card
                  mediaStyle={{
                    color: "white",
                  }}
                  contentStyle={{
                    color: "white",
                  }}
                  cardTitleStyle={{
                    color: "white",
                  }}
                  className={`${styles.card}`}
                  bg={bg}
                  title={title}
                  content={content}
                  media={media}
                />
                {title === "口语" ? (
                  <div className={styles.recommended}>
                    <FaCrown />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
};

export default Product;
