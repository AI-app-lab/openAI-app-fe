import React, { Dispatch, SetStateAction, WheelEvent, createContext, useEffect, useRef, useState } from "react";
import styles from "../index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ChatBubble from "./ChatBubble";
import { ChatApiState, ShownMessage, clearAudioMsg, getRecentConversations, pushAudioMsg, shiftMsgQueue } from "../../../store/chatApiSlice";
import { nanoid } from "nanoid";
import { encode, decode, toUint8Array } from "js-base64";
import { getFormattedDate } from "../../../utils/date";
import { useToken } from "../../../hooks/useToken";
import { err, info, warn } from "../../../utils/alert";
import { ttsReq } from "../../../api/reqDto";

type Props = {
  messageList: Array<ShownMessage>;
  audioBlobList: Array<string>;
  conId: number;
  audioShouldPlay: HTMLAudioElement;
  urlPlaying: string;
  setUrlPlaying: Dispatch<SetStateAction<string>>;
};

type AudioInfoContextType = [string, () => void, (url: string, message: string) => void];
let ws: WebSocket;
let audio = new Uint8Array([]);
let count = 0;
const _audio = new Audio();
let audioQ: any = [];
export const AudioInfoContext = createContext<AudioInfoContextType>(["", () => {}, () => {}]);
const ChatWindow = ({ urlPlaying, setUrlPlaying, audioShouldPlay, audioBlobList, messageList, conId }: Props) => {
  const dispatch: Function = useDispatch();
  useEffect(() => {
    dispatch(getRecentConversations());
  }, []);
  const token = useToken();
  const { conversations, activeConversationId, currChatType, audioMsg, msgQueue } = useSelector((state: ChatApiState) => state.chatApi);
  const messagesEndRef = useRef<any>(null);
  const [isAutoEnd, setIsAutoEnd] = useState(true);
  const [showAll, setShowAll] = useState(true);

  const [isRequesting, setIsRequesting] = useState(false);
  const [audioQueue, setAudioQueue] = useState([]); // [url1,url2,url3
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlay = (url: string, message: string) => {
    if (isRequesting) {
      info("正在请求中，稍等片刻");
      return;
    }
    audioShouldPlay.src = url;

    audioShouldPlay.play();

    audioShouldPlay.onerror = (e) => {
      requestForExpiredResource(message, url);
    };
    audioShouldPlay.onpause = () => {
      setUrlPlaying("");
    };
    setUrlPlaying(url);
  };

  const handlePause = () => {
    if (ws && ws.readyState !== ws.CLOSED) {
      ws.close(4403, "abort");
    }
    audioShouldPlay.pause();
    setUrlPlaying("");
  };
  const requestForExpiredResource = (msg: string, originalUrl: string = "") => {
    count++;
    console.log("[requesting for expired resource]", count);

    setIsRequesting(true);
    ws = new WebSocket(`ws://43.139.143.5:7979/ttsapi/v2/tts?token=${token}`);
    ws.onopen = async () => {
      //wait for the connection to be established
      setIsRequesting(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      console.log("connected");

      ws.send(JSON.stringify(ttsReq(msg, 60, 70)));
    };
    ws.onmessage = async (e) => {
      let audioChunk;
      if (e.data === "连接成功") {
        return;
      }
      audioChunk = JSON.parse(e.data);
      try {
        audio = new Uint8Array([...audio, ...toUint8Array(audioChunk.data.audio)]);
      } catch (e) {}

      if (audioChunk.data.status === 2) {
        ws.close();
      }
    };
    ws.onclose = (e) => {
      if (e.code === 4403) {
        setIsRequesting(false);
        warn("请求被中断");
        return;
      }
      dispatch(shiftMsgQueue());
      const blob = new Blob([audio], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);

      audioShouldPlay.src = url;
      // audioShouldPlay.play();
      audioQ = [...audioQ, url];
      setAudioQueue(audioQ);
      audioShouldPlay.onerror = (e) => {
        err("播放失败");
        setIsRequesting(false);
        setUrlPlaying("");
      };
      audioShouldPlay.onpause = () => {
        setUrlPlaying("");
      };
      setUrlPlaying(url);

      dispatch(pushAudioMsg({ newUrl: url, originalUrl: originalUrl }));
      dispatch(clearAudioMsg());
      console.log("closed");
      audio = new Uint8Array([]);
      setIsRequesting(false);
    };
    ws.onerror = (e) => {
      setIsRequesting(false);
      setUrlPlaying("");
      console.log(e);
    };
  };
  _audio.onpause = () => {
    audioQ.shift();
    setIsPlaying(false);
  };
  _audio.onplay = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying || audioQ.length <= 0) {
      return;
    }

    const nextAudio = audioQ[0];
    _audio.src = nextAudio;

    _audio.play();

    setIsPlaying(true);
  }, [isPlaying, audioQueue]);
  useEffect(() => {
    if (msgQueue.length > 0 && !isRequesting) {
      const temp = msgQueue[0];

      requestForExpiredResource(temp as string);
    }
  }, [msgQueue, isRequesting]);

  useEffect(() => {
    handlePause();
  }, [conId]);
  useEffect(() => {
    return handlePause;
  }, []);
  // useEffect(() => {
  //   if (!audioMsg) {
  //     return;
  //   } else {
  //     requestForExpiredResource(audioMsg);
  //     index_1++;
  //   }
  // }, [audioMsg]);

  useEffect(() => {
    const scroll = messagesEndRef.current.scrollHeight - messagesEndRef.current.clientHeight;
    isAutoEnd && messagesEndRef.current.scrollTo(0, scroll);
  });
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    const { deltaY } = e;
    messagesEndRef.current.scrollTop + 700 > messagesEndRef.current.scrollHeight && setIsAutoEnd(true);
    deltaY < 0 && setIsAutoEnd(false);
  };
  const ShowAllBtn = () => {
    return (
      <div className={styles.btnShowAll} onClick={() => setShowAll(!showAll)}>
        Show All
      </div>
    );
  };
  return (
    <AudioInfoContext.Provider value={[urlPlaying, handlePause, handlePlay]}>
      <div onWheel={(e) => handleWheel(e)} ref={messagesEndRef} className={styles.chatWindow}>
        {currChatType === "oral" ? (
          <>
            <ShowAllBtn />
          </>
        ) : (
          <ChatBubble audioURL={""} time={getFormattedDate()} showAll={true} type="system" message="Hey, there! How can I assist you today?" />
        )}

        {messageList && messageList.map(({ time, role, content }: ShownMessage, index: number) => <ChatBubble audioURL={role === "system" ? audioBlobList[Math.floor(index / 2)] : ""} showAll={showAll} time={time} key={nanoid()} type={role} message={content} />)}
      </div>
    </AudioInfoContext.Provider>
  );
};

export default ChatWindow;
