import React, { useRef, useContext } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import RemarkGfm from "remark-gfm";
import RemarkMath from "remark-math";
import RehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "../index.module.scss";
import Button from "../../../components/Button/Button";
import { ChatBubbleContext } from "./ChatBubble";
const WRONG_IDENTIFIER = "[出错了]";
const TOO_LONG_IDENTIFIER = "[你的信息太长了]";
const MarkDown = () => {
  const codeRef = useRef<any>({});
  const [message] = useContext(ChatBubbleContext);

  let msg: string = "";
  const handleCopy = async (e: any, isInline: boolean = false) => {
    try {
      const text = isInline ? e.target.innerText : e.target.parentElement.nextElementSibling.innerText;

      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard:", text);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };
  const isError = () => {
    if (message.endsWith(WRONG_IDENTIFIER)) {
      return true;
    } else if (message.endsWith(TOO_LONG_IDENTIFIER)) {
      return true;
    } else {
      return false;
    }
  };
  const resultMsg = () => {
    if (message.endsWith(WRONG_IDENTIFIER)) {
      msg = message.replace(WRONG_IDENTIFIER, "");
      return msg;
    } else if (message.endsWith(TOO_LONG_IDENTIFIER)) {
      msg = message.replace(TOO_LONG_IDENTIFIER, "");
      return msg;
    } else {
      msg = message;
      return msg;
    }
  };
  return (
    <ReactMarkdown
      className={`${styles.reactMarkdown} ${resultMsg() && isError() && styles.err}`}
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
      {resultMsg()}
    </ReactMarkdown>
  );
};

export default MarkDown;
