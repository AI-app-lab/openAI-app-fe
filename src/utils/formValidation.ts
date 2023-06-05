export const isEmail = (email: string) => {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  return reg.test(email);
};
export const isEmpty = (values: Array<string>) => {
  return values.some((value) => value === "");
};
