import React, { useMemo, useRef } from "react";
import styles from "../index.module.scss";
import { useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import RemarkGfm from "remark-gfm";
import RemarkMath from "remark-math";
import RehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import Button from "../../../components/Button/Button";
import { enqueueSnackbar } from "notistack";

type Props = {
  type: "system" | "user" | "err";
  message: string;
  time: string;
};

const ChatBubble = ({ time, type, message }: Props) => {
  const codeRef = useRef<any>({});
  const style = useMemo(() => ({ system: styles.bubbleContainerBot, user: styles.bubbleContainerUser, err: styles.bubbleContainerBot }), []);

  const handleCopy = async (e: any, isInline: boolean = false) => {
    try {
      const text = isInline ? e.target.innerText : e.target.parentElement.nextElementSibling.innerText;

      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard:", text);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };
  const md = (
    <ReactMarkdown
      className={styles.reactMarkdown}
      remarkPlugins={[RemarkMath, RemarkGfm]}
      rehypePlugins={[RehypeKatex]}
      components={{
        pre: ({ node, className, children, ...props }) => <pre className={styles.rmdP}>{children}</pre>,
        img: ({ node, src }) => (
          <a className={styles.imgUrl} href={src}>
            {src}
          </a>
        ),
        table: ({ node, ...props }) => <table className={styles.rmdTable} {...props} />,
        p: ({ node, ...props }) => <p className={styles.rmdP} {...props} />,
        div: ({ node, ...props }) => <p className={styles.rmdP} {...props} />,
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const a = className;
          return !inline ? (
            <>
              <div className={styles.markDownHeader}>
                <Button onClick={(e: any) => handleCopy(e)} className={styles.btn}>
                  复制
                </Button>
              </div>
              <div ref={codeRef}>
                <SyntaxHighlighter
                  {...props}
                  codeTagProps={{
                    style: {
                      fontFamily: "inherit",
                    },
                  }}
                  className={styles.syntaxHighlighter}
                  children={String(children).replace(/\n$/, "")}
                  style={darcula}
                  language={match ? match[1] : "js"}
                  PreTag="div"
                />
              </div>
            </>
          ) : (
            <code {...props} className={styles.inlineCode} onClick={(e: any) => handleCopy(e, true)}>
              {children}
            </code>
          );
        },
      }}>
      {message}
    </ReactMarkdown>
  );
  const chatMsgs = {
    user: message,
    err: md,
    system: md,
  };

  return (
    <>
      {type === "user" ? (
        <div className={style[type]}>
          <div className={styles.chatBubble}>{message ? chatMsgs[type] : <Loading size={8} />}</div>
        </div>
      ) : (
        <div className={style[type]}>
          <div className={styles.chatBubble}>{message ? chatMsgs[type] : <Loading size={8} />}</div>
          <div className={styles.time}>{time}</div>
        </div>
      )}
    </>
  );
};

export default ChatBubble;
