import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import stylesChat from "../../Chat/index.module.scss";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import IconButton from "../../../components/IconButon/IconButton";
import WorkerBuilder from "../WorkerBuilder";
import transformpcmWorker from "../transformpcm.worker";
import { ChatApiState } from "../../../store/chatApiSlice";
import { useSelector } from "react-redux";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import { FaMicrophoneSlash } from "react-icons/fa";
import { useToken } from "../../../hooks/useToken";
import { err } from "../../../utils/alert";
import { useActiveBotId } from "../../../hooks/useCon";

import { ClipLoader, ScaleLoader } from "react-spinners";
import { useTheme } from "../../../hooks/useConfig";
import { themes } from "../../../styles/global";

type Props = {
  msg: string;
  setMsg: Function;
  textAreaRef: any;
  handleClick: any;
  handlePause: () => void;
  beforeRecordingFn: () => void;
  isPlaying: boolean;
};
let ws: WebSocket;
let recorder: any = null;
let audioContext: any = null;
let _isRecording = false;
let mediaRecorder: any = null;
let count = 0;
const MicrophoneBtn = ({ isPlaying, isRecording, startFn, stopFn, volume }: { isPlaying: boolean; isRecording: boolean; startFn: () => void; stopFn: () => void; volume: number }) => {
  const { loading } = useSelector((state: ChatApiState) => state.chatApi);

  return isRecording ? (
    <IconButton className={`${stylesChat.sendBtn}`} onClick={stopFn}>
      <FaMicrophoneSlash className={`${styles.icon} ${styles["step" + volume]} ${styles.off}`} />
    </IconButton>
  ) : (
    <IconButton allow={!isPlaying && loading !== "loading"} className={`${stylesChat.sendBtn}`} onClick={startFn}>
      <BiMicrophone className={`${styles.icon}`} />
    </IconButton>
  );
};
const OralInputRange = ({ isPlaying, beforeRecordingFn, handlePause, handleClick, msg, setMsg }: Props) => {
  const recorderWorker = new WorkerBuilder(transformpcmWorker);
  const [volume, setVolume] = useState<number>(1);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const { loading } = useSelector((state: ChatApiState) => state.chatApi);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const theme = useTheme();
  const token = useToken();
  const textareaRef = useRef<any>(null);
  let buffer: any = [];
  let analyserNode: any;
  const handleSend = (e: any) => {
    handleClick();
    setMsg("");
    stopFn();
    textareaRef.current.style.height = "36px";
  };
  recorderWorker.onmessage = function (e) {
    buffer.push(...e.data.buffer);
  };
  const sendData = (buffer: any) => {
    recorderWorker.postMessage({
      command: "transform",
      buffer: buffer,
    });
  };
  const startFn = () => {
    setIsLoading(true);
    beforeRecordingFn();
    count = 0;
    handlePause();
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
      startRecord(stream);
    });
  };

  const startRecord = (stream: any) => {
    ws = new WebSocket(`wss://kitzone.cn:7878/asr/v2?token=${token}`);

    ws.onopen = async (e: any) => {
      audioContext = new AudioContext();
      mediaRecorder = new MediaRecorder(stream);

      let source = audioContext.createMediaStreamSource(stream);
      recorder = audioContext.createScriptProcessor(0, 1, 1);
      analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      analyserNode.smoothingTimeConstant = 0.8;
      const dest = audioContext.createMediaStreamDestination();
      dest.channelCount = 1;
      source.connect(analyserNode);
      analyserNode.connect(recorder);
      source.connect(recorder);
      recorder.connect(dest);
      const data = new Uint8Array(analyserNode.frequencyBinCount);

      recorder.onaudioprocess = (e: any) => {
        //log the volume
        analyserNode.getByteFrequencyData(data);
        const volume = data.reduce((a, b) => Math.max(a, b));
        //0-255 映射到0-100
        setVolume(Math.round((volume / 255) * 10));

        _isRecording && sendData(e.inputBuffer.getChannelData(0));
      };

      const handlerInterval = setInterval(() => {
        if (buffer.length === 0) {
          if (count < 1) {
            //do nothing
          } else {
            console.log("发送完毕");
            buffer = [];
            ws.close();
            recorder.disconnect();
            audioContext.close();
            clearInterval(handlerInterval);
            count = 0;
            return false;
          }
          count++;
        }
        const audioData = buffer.splice(0, 1280);

        if (audioData.length > 0 && ws.readyState === WebSocket.OPEN) {
          ws.send(new Int8Array(audioData));
        }
      }, 30);
      mediaRecorder.start();
      _isRecording = true;
      setIsLoading(false);
      setIsRecording(true);
    };
    ws.onmessage = (e: any) => {
      if (e.data.includes("请勿分享")) {
        ws.close();
        return;
      }
      try {
        const msg = JSON.parse(e.data).result.voice_text_str;
        setMsg(msg);
      } catch (err) {
        console.log(err);
      }
    };
    ws.onclose = (e: any) => {
      if (e.code === 4403) {
        err("服务过期/未购买");
      }
      if (e.code === 4400) {
        err("操作频繁");
      }

      _isRecording = false;
      setIsRecording(false);
      setIsLoading(false);
      console.log(e);
    };
  };
  const stopFn = () => {
    console.log("stop");
    if (_isRecording === false) {
      console.log("Not recording");
      return;
    }
    setIsRecording(false);
    _isRecording = false;
    setVolume(0);
    mediaRecorder.stop();
  };
  return (
    <>
      <textarea
        ref={textareaRef}
        onInput={(e) => {
          e.currentTarget.style.height = "36px";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          if (!e.shiftKey && e.key == "Enter") {
            e.preventDefault();
            handleSend(e);
          }
        }}
        value={msg}
        onChange={(e) => {
          setMsg(e.target.value);
        }}
        className={stylesChat.inputRange}
      />
      <div className={stylesChat.buttonWrapperOral}>
        <IconButton onClick={handleSend} className={`${stylesChat.sendBtnOral} ${loading === "loading" || isPlaying ? stylesChat.btnLoading : ""} ${stylesChat.oralSendBtn}`}>
          <SendSharpIcon />
        </IconButton>
      </div>
      <div className={stylesChat.buttonWrapper}>
        {isLoading ? (
          <ClipLoader
            cssOverride={{
              width: 35,
              height: 35,
            }}
            color={themes[theme].primary}
          />
        ) : (
          <MicrophoneBtn isPlaying={isPlaying} isRecording={isRecording} startFn={startFn} stopFn={stopFn} volume={volume} />
        )}
      </div>
    </>
  );
};

export default OralInputRange;
