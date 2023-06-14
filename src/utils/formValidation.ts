export const isEmail = (email: string) => {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  return reg.test(email);
};
export const isEmpty = (values: Array<string>) => {
  return values.some((value) => value === "");
};
export const isPhoneNumber = (phoneNumber: string) => {
  const reg = /^1[3456789]\d{9}$/;
  return reg.test(phoneNumber);
};
