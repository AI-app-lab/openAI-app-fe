import React, { Dispatch, SetStateAction, WheelEvent, createContext, useEffect, useRef, useState } from "react";
import styles from "../index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ChatBubble from "./ChatBubble";
import { ChatApiState, ShownMessage, abortGenerating, clearAudioMsg, clearAudioPlaying, clearMsgQueue, ctrl, getRecentConversations, shiftMsgQueue, startAudioPlaying, updateAudioUrl } from "../../../store/chatApiSlice";
import { nanoid } from "nanoid";
import { toUint8Array } from "js-base64";
import { getFormattedDate } from "../../../utils/date";
import { useToken } from "../../../hooks/useToken";
import { err, info, warn } from "../../../utils/alert";
import { ttsReq } from "../../../api/reqDto";
import { useActiveBotId, useCurrBotAudioURL, useCurrCon, useCurrConId } from "../../../hooks/useCon";
import Button from "../../../components/Button/Button";
import { BsFillSquareFill } from "react-icons/bs";
import IconButton from "../../../components/IconButon/IconButton";

type Props = {
  messageList: Array<ShownMessage>;
  handleAudioStop: (_audio: HTMLAudioElement) => void;
  conId: number;
  currAudioSliceShouldPlay: HTMLAudioElement;
  urlPlaying: string;
  setUrlPlaying: Dispatch<SetStateAction<string>>;
};

type AudioInfoContextType = [string, (url: string) => void, (message: string, index: number) => void, HTMLAudioElement, boolean, boolean, (msg: string, stream?: boolean, id?: number) => void, HTMLAudioElement, Dispatch<SetStateAction<string[]>>, boolean];
let ws: WebSocket;
let audio = new Uint8Array([]);
let count = 0;
const _audio = new Audio();
let audioQ: any = [];
let wholeAudioUrl = "";
let preAudioSlice: any = [];
let isAutoEnd = true;
export const AudioInfoContext = createContext<AudioInfoContextType>(["", () => {}, () => {}, new Audio(), false, false, () => {}, _audio, () => {}, false]);
const ChatWindow = ({ handleAudioStop, urlPlaying, setUrlPlaying, currAudioSliceShouldPlay, messageList, conId }: Props) => {
  const dispatch: Function = useDispatch();
  useEffect(() => {
    dispatch(getRecentConversations());
  }, []);
  const token = useToken();
  const { currChatType, msgQueue, loading } = useSelector((state: ChatApiState) => state.chatApi);
  const messagesEndRef = useRef<any>(null);
  const [showAll, setShowAll] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [audioQueue, setAudioQueue] = useState<Array<string>>([]); // [url1,url2,url3
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinishWhole, setIsFinishWhole] = useState(false);
  const activeAudioBotId = useActiveBotId();

  useEffect(() => {
    ws && ws.close(3403, "abort");
  }, [activeAudioBotId]);
  const handlePlay = (message: string, id: number) => {
    if (isRequesting) {
      info("正在请求中，稍等片刻");
      return;
    }
    const url = useCurrBotAudioURL(id);
    url && (currAudioSliceShouldPlay.src = url);

    currAudioSliceShouldPlay.play();

    currAudioSliceShouldPlay.onerror = (e) => {
      audioSliceTTSRequest(message);
    };
    currAudioSliceShouldPlay.onpause = () => {
      setUrlPlaying("");
    };
    url && setUrlPlaying(url);
  };

  const handlePause = (url: string) => {
    if (ws && ws.readyState !== ws.CLOSED) {
      ws.close(3403, "abort");
    }

    currAudioSliceShouldPlay.src === url && currAudioSliceShouldPlay.pause();
    setUrlPlaying("");
  };

  const audioSliceTTSRequest = (msg: string, stream: boolean = true, id: number = -1) => {
    if (currChatType === "text") return;

    if (msg === "[#OVER#]") {
      console.log("[finish playing whole audio]");
      setIsRequesting(false);
      preAudioSlice = [];
      audio = new Uint8Array([]);
      dispatch(clearMsgQueue());
      !stream && (audioQ = []);
      return;
    }
    setIsFinishWhole(false);
    count++;
    console.log("[requesting for expired resource]", count);

    setIsRequesting(true);
    ws = new WebSocket(`ws://43.139.143.5:7979/ttsapi/v2/tts?token=${token}`);
    ws.onopen = async () => {
      //wait for the connection to be established
      setIsRequesting(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      console.log("connected");
      ws.send(JSON.stringify(ttsReq(msg, 60, 80)));
    };
    ws.onmessage = async (e) => {
      let audioChunk;
      if (e.data === "连接成功") return;

      audioChunk = JSON.parse(e.data);
      try {
        audio = new Uint8Array([...audio, ...toUint8Array(audioChunk.data.audio)]);
      } catch (e) {}

      audioChunk.data.status === 2 && ws.close(3200, "ok");
    };
    ws.onclose = (e) => {
      if (e.code === 3403) {
        setIsRequesting(false);
        audioSliceTTSRequest("[#OVER#]");
        warn("请求被中断");
        return;
      }
      if (e.code === 4503) {
        setIsRequesting(false);
        audioSliceTTSRequest("[#OVER#]");
        err("服务暂不可用");
        return;
      }
      if (e.code === 4403) {
        setIsRequesting(false);
        audioSliceTTSRequest("[#OVER#]");
        err("服务已过期");
        return;
      }
      if (e.code === 4000) {
        setIsRequesting(false);
        audioSliceTTSRequest("[#OVER#]");
        err("未知错误");
        return;
      }
      console.log(e.code, e.reason);

      if (e) dispatch(shiftMsgQueue());
      let blob = new Blob([audio], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      blob = new Blob([...preAudioSlice, audio], { type: "audio/mpeg" });
      wholeAudioUrl = URL.createObjectURL(blob);

      dispatch(updateAudioUrl({ wholeAudioUrl, id: id }));
      preAudioSlice = [...preAudioSlice, audio];
      currAudioSliceShouldPlay.src = url;
      audioQ = [...audioQ, url];
      setAudioQueue(audioQ);
      //更新当前url

      currAudioSliceShouldPlay.onerror = (e) => {
        err("播放出错");
        setIsRequesting(false);
        setUrlPlaying("");
      };
      currAudioSliceShouldPlay.onpause = () => {
        setUrlPlaying("");
        !stream && setIsRequesting(false);
      };
      setUrlPlaying(url);

      //initialize data
      dispatch(clearAudioMsg());
      audio = new Uint8Array([]);

      stream && setIsRequesting(false);
      !stream && audioSliceTTSRequest("[#OVER#]", true, id);
    };
    ws.onerror = (e) => {
      setIsRequesting(false);
      setUrlPlaying("");
      console.log(e);
    };
  };

  _audio.onpause = () => {
    audioQ.shift();

    !audioQ.length && dispatch(clearAudioPlaying());

    setIsPlaying(false);
  };

  _audio.onplay = () => {
    setIsPlaying(true);
  };
  //play audio in audioQueue
  useEffect(() => {
    if (isPlaying || audioQ.length <= 0) {
      return;
    }
    const nextAudio = audioQ[0];
    _audio.src = nextAudio;
    _audio.play();

    setIsPlaying(true);
  }, [isPlaying, audioQueue]);
  //request audio in msgQueue
  useEffect(() => {
    if (msgQueue.length > 0 && !isRequesting) {
      const temp = msgQueue[0];

      audioSliceTTSRequest(temp);
    }
  }, [msgQueue, isRequesting]);
  //when conId changes, pause audio

  //pause audio when component unmount
  useEffect(() => {
    return handlePause(currAudioSliceShouldPlay.src);
  }, []);

  //destroy audio when component unmount and when conId changes
  useEffect(() => {
    handleAudioStop(_audio);
    setShowAll(true);
  }, [conId]);

  useEffect(() => {
    return () => {
      handleAudioStop(_audio);
      setShowAll(false);
    };
  }, []);

  useEffect(() => {
    const scroll = messagesEndRef.current.scrollHeight - messagesEndRef.current.clientHeight;
    isAutoEnd && messagesEndRef.current.scrollTo(0, scroll);
  });
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    const { deltaY } = e;

    messagesEndRef.current.scrollTop + 700 > messagesEndRef.current.scrollHeight && (isAutoEnd = true);
    deltaY < 0 && (isAutoEnd = false);
  };
  const ShowAllBtn = () => {
    return (
      <Button className={styles.btnShowAll} onClick={() => setShowAll(!showAll)}>
        {showAll ? "隐藏" : "显示"}
      </Button>
    );
  };

  return (
    <AudioInfoContext.Provider value={[urlPlaying, handlePause, handlePlay, currAudioSliceShouldPlay, isPlaying, isFinishWhole, audioSliceTTSRequest, _audio, setAudioQueue, showAll]}>
      <div className={styles.chatWindowContainer}>
        <div onWheel={(e) => handleWheel(e)} ref={messagesEndRef} className={styles.chatWindow}>
          {currChatType === "oral" ? <ShowAllBtn /> : <ChatBubble id={-1} time={getFormattedDate()} showAll={showAll} type="system" message="Hey, there! How can I assist you today?" />}

          {messageList && messageList.map(({ time, role, content, id }: ShownMessage) => <ChatBubble showAll={showAll} time={time} key={nanoid()} type={role} id={id} message={content} />)}

          {activeAudioBotId !== -1 && (
            <IconButton
              className={styles.audioStopBtn}
              onClick={() => {
                handleAudioStop(_audio);
              }}>
              <>
                <BsFillSquareFill />
                &nbsp;停止音频
              </>
            </IconButton>
          )}

          {loading === "loading" ? (
            <IconButton
              className={styles.audioStopBtn}
              onClick={() => {
                dispatch(abortGenerating());
              }}>
              <>
                <BsFillSquareFill />
                &nbsp;停止生成
              </>
            </IconButton>
          ) : (
            <></>
          )}
        </div>
      </div>
    </AudioInfoContext.Provider>
  );
};

export default ChatWindow;
