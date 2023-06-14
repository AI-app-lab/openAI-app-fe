import { info } from "./alert";

export const sha256 = (string: string) => {
  const utf8 = new TextEncoder().encode(string);
  return crypto.subtle.digest("SHA-256", utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, "0")).join("");

    return hashHex;
  });
};

export const encodedPhoneNum = (phoneNum: string = "") => {
  //hide the middle 4 digits of the phone number
  return phoneNum.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
};
