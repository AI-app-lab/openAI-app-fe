import React, { useEffect, useState } from "react";
import NavBarLanding from "./components/NavBarLanding";
import { useSelector } from "react-redux";
import { ConfigState } from "../../store/configSlice";
import styles from "./index.module.scss";
import Button from "../../components/Button/Button";
import Link from "../../components/Link/Link";
import { Outlet } from "react-router-dom";

export const Main = () => {
  const Span = ({ children }: { children: string }) => (
    <span
      style={{
        color: "#f1a746",
      }}>
      {children}
    </span>
  );

  return (
    <>
      <div className={styles.title}>为什么选我们？</div>
      <div className={styles.subTitle}>一站式人工智能解决方案</div>
      <div className={styles.content}>
        <p>
          我们的核心技术
          <Span>AI口语陪练</Span>
          功能。该功能基于最先进的语音识别技术和自然语言处理算法，设计目的是为您提供一个高效、准确、并富有趣味性的语言学习体验。借助AI口语练习，您可以通过与AI进行口语对话，获取个性化的语言学习计划、实时的口语纠错与反馈，以及模拟多样化的话题和场景。此项技术的目标在于帮助您快速提升语言技能和自信心，并能在真实场景中流利地交流和表达。
        </p>
        <p>
          此外，我们还提供
          <Span>AI助手</Span>、<Span>AI翻译工具</Span>
          以及
          <Span>AI绘图工具</Span>
          ，以支持您的其他需求。AI助手可以进行智能文本对话和知识查询， AI翻译工具支持多语种互译以帮助您克服语言障碍，而AI绘图工具则能自动创作美丽的艺术品和插图，激发您的创新潜能。
        </p>
      </div>

      <Button className={styles.goBtn}>
        <Link to="/sign-up">免费注册</Link>
      </Button>
    </>
  );
};

const LandingPage = () => {
  const { theme } = useSelector((state: ConfigState) => state.config);

  return (
    <div className={`${styles.landingLayout}`}>
      <NavBarLanding />
      <div className={styles.body}>
        <Outlet />
      </div>
    </div>
  );
};

export default LandingPage;
