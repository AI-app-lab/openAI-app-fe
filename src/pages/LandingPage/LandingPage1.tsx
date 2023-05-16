import React, { useEffect, useState } from "react";
import NavBarLanding from "./components/NavBarLanding";
import { useSelector } from "react-redux";
import { ConfigState } from "../../store/configSlice";
import transformpcmWorker from "./transformpcm.worker";
import workerbd from "./workerbd";

type Props = {};

const LandingPage = (props: Props) => {
  const recorderWorker = new workerbd(transformpcmWorker);

  const { theme } = useSelector((state: ConfigState) => state.config);

  let recorder: any = null;
  let audioContext: any = null;
  let buffer: any = [];

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
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        playAudioFn(stream);
      });
    }, 10);
  };

  const playAudioFn = (stream: any) => {
    audioContext = new AudioContext();
    let source = audioContext.createMediaStreamSource(stream);

    recorder = audioContext.createScriptProcessor(0, 1, 1);

    const dest = audioContext.createMediaStreamDestination();

    source.connect(recorder);
    recorder.connect(dest);

    recorder.onaudioprocess = (e: any) => {
      sendData(e.inputBuffer.getChannelData(0));
    };
    const ws = new WebSocket("ws://localhost:8080/websocket/ss");
    ws.onopen = () => {
      ws.send(new Int8Array(buffer.splice(0, 1280)));
      const handlerInterval = setInterval(() => {
        if (buffer.length === 0) {
          clearInterval(handlerInterval);

          return false;
        }
        const audioData = buffer.splice(0, 1280);
        if (audioData.length > 0) {
          ws.send(new Int8Array(audioData));
        }
      }, 40);
    };
  };
  const stopFn = () => {
    recorder.disconnect();
  };
  return (
    <div className={theme}>
      <NavBarLanding />
      <div>
        <button onClick={startFn}>start</button>
      </div>
    </div>
  );
};

export default LandingPage;
