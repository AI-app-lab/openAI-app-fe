import { encode } from "js-base64";
import { TTSRequestDto } from "./reqDto.d";

export const ttsReq = (msg: string, pitch: number = 60, speed: number = 60): TTSRequestDto => {
  return {
    common: {
      app_id: "6c215e31",
    },
    business: {
      aue: "lame",
      tte: "UTF8",
      ent: "intp65",
      vcn: "x3_john",
      pitch: pitch,
      speed: 60,
      sfl: speed,
    },
    data: {
      text: encode(msg),
      status: 2,
    },
  };
};
