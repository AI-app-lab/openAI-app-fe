import React, { useEffect, useState } from "react";
import NavBarLanding from "./components/NavBarLanding";
import { useSelector } from "react-redux";
import { ConfigState } from "../../store/configSlice";
import transformpcmWorker from "./transformpcm.worker";
import WorkerBuilder from "./WorkerBuilder";

type Props = {};
let ws: any = null;
let recorder: any = null;
let audioContext: any = null;
const LandingPage = (props: Props) => {
  const recorderWorker = new WorkerBuilder(transformpcmWorker);
  const [volume, setVolume] = useState<number>(0);
  const { theme } = useSelector((state: ConfigState) => state.config);
  const [msg, setMsg] = useState("");

  let buffer: any = [];

  let analyserNode: any;
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
    setTimeout(() => {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
        startRecord(stream);
      });
    }, 10);
  };

  const startRecord = (stream: any) => {
    audioContext = new AudioContext();
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
      //0-255 映射到0-10
      setVolume(Math.round((volume / 255) * 10));

      sendData(e.inputBuffer.getChannelData(0));
    };

    ws = new WebSocket("ws://localhost:8080/websocket/ss");
    ws.onopen = async () => {
      ws.send(new Int8Array(buffer.splice(0, 1280)));
      //wait 1 second to start the interval
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let prev = audioContext.currentTime;
      const handlerInterval = setInterval(() => {
        //get current time
        console.log(audioContext.currentTime - prev);
        prev = audioContext.currentTime;

        //if buffer is empty for 1s, stop the interval
        if (buffer.length === 0) {
          console.log("发送完毕");

          clearInterval(handlerInterval);

          return false;
        }
        const audioData = buffer.splice(0, 1280);
        if (audioData.length > 0 && ws.readyState === WebSocket.OPEN) {
          ws.send(new Int8Array(audioData));
        }
      }, 30);
      //get current time
    };
    ws.onmessage = (e: any) => {
      setMsg(e.data);
    };
  };
  const stopFn = () => {
    ws.close();
    recorder.disconnect();
    audioContext.close();
    buffer = [];
    setVolume(0);
  };
  return (
    <div className={theme}>
      <NavBarLanding />
      <div>
        <button onClick={startFn}>start</button>
        <button onClick={stopFn}>stop</button>

        <div
          style={{
            border: "1px solid black",
            width: "500px",
            height: "100px",
          }}>
          {msg}
        </div>
        <div>
          {
            //返回volumn个*号
            Array.from({ length: volume }, (v, i) => "*").join("")
          }
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
