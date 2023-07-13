import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../index.module.scss";

import { ConfigState } from "../../../store/configSlice";
import { locations } from "../../../localization";
import Button from "../../../components/Button/Button";
import { UserLoginPostDto, UserState, clearStatus, login, saveUserInfo, setAuthLoading } from "../../../store/userSlice";

import { isEmpty, isPhoneNumber } from "../../../utils/formValidation";
import { useLocation, useNavigate } from "react-router-dom";

import { err } from "../../../utils/alert";
import Input from "../../../components/Input/Input";
import AuthModal from "../../../components/AuthModal/AuthModal";
import HashLoader from "../../../components/HashLoader/HashLoader";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type Props = {};

const Login = (props: Props) => {
  const dispatch: any = useDispatch();
  const _location = useLocation();
  const { location } = useSelector((state: ConfigState) => state.config);
  const { status, userInfo } = useSelector((state: UserState) => state.user);
  const [userLoginPostDto, setUserLoginPostDto] = useState<UserLoginPostDto>({ reCapToken: "", phoneNumber: "", password: "" });
  const { executeRecaptcha } = useGoogleReCaptcha();
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }
    const token = await executeRecaptcha("Login");

    setUserLoginPostDto((prev: UserLoginPostDto) => ({ ...prev, reCapToken: token }));
  }, [executeRecaptcha]);

  const navigate = useNavigate();

  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);
  useEffect(() => {
    const action = _location.state?.action;
    if (action === "RESET_PWD") {
      dispatch(clearStatus());
    }
  }, []);
  useEffect(() => {
    //if user is logged in, redirect to /apps
    console.log(userInfo);

    if (userInfo) {
      navigate("/apps", { replace: true, state: { action: "LOGIN" } });
      return;
    }
    //if not logged in, check if there is a userInfo in localStorage
    const _userInfo = localStorage.getItem("userInfo");
    //if there is, save it to redux store
    _userInfo && dispatch(saveUserInfo(JSON.parse(_userInfo)));
  }, [userInfo]);

  const handleSubmit = async () => {
    const { phoneNumber, password } = userLoginPostDto;
    if (isEmpty([phoneNumber, password])) {
      err("手机号或密码不能为空!");
    } else if (!isPhoneNumber(phoneNumber)) {
      err("手机号格式不正确!");
    } else {
      dispatch(setAuthLoading("loading"));
      console.log(userLoginPostDto);

      dispatch(login(userLoginPostDto));
    }
  };

  return status.status === "loading" ? (
    <HashLoader />
  ) : (
    <AuthModal>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}>
        <div className={styles.suTitle}>登录</div>
        <Input value={userLoginPostDto.phoneNumber} autoComplete="tel" onChange={(e) => setUserLoginPostDto((prev: UserLoginPostDto) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="请输入手机号" type="tel" />
        <Input className={styles.pwd} value={userLoginPostDto.password} autoComplete="curr-password" onChange={(e) => setUserLoginPostDto((prev: UserLoginPostDto) => ({ ...prev, password: e.target.value }))} placeholder="请输入密码" type="password" />
      </form>

      <Button type="submit" onClick={handleSubmit} className={styles.btn} w={70} h={50}>
        {locations[location].lgConfirm}
      </Button>
      <div className={styles.noAccAndResetPwd}>
        <span onClick={() => navigate("/sign-up")}>没有账号？</span>
        <span onClick={() => navigate("/reset-password")}> 忘记密码</span>
      </div>
    </AuthModal>
  );
};

export default Login;
