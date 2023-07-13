import React, { useState, useEffect, useCallback } from "react";
import styles from "./index.module.scss";
import Toggle from "../../components/ToggleButton/Toggle";
import Button from "../../components/Button/Button";
import { success } from "../../utils/alert";
import { IoDiamondSharp } from "react-icons/io5";
import Modal from "../../components/Modal/Modal";
import wxpaytut from "../../assets/wxpaytut.png";
import { RiWechatPayFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { OrderPostDto, WechatPayState, clearQRCode, createOrder } from "../../store/wechatPaySlice";
import { useToken } from "../../hooks/useToken";
import { UserState, checkOrder, clearStatus, saveUserInfo } from "../../store/userSlice";
import { lsSet } from "../../utils/localstorage";

type PlanType = {
  productCode: string;
  price: number;
};

type VipType = {
  week?: PlanType;
  month?: PlanType;
  quarter?: PlanType;
  year?: PlanType;
};

type PlanName = "ChatAI助理" | "AI口语陪练" | "AI绘图翻译";

type VipDict = Record<PlanName, VipType>;
let ws: WebSocket;

const Shop = () => {
  const { status, userInfo } = useSelector((state: UserState) => state.user);
  useEffect(() => {
    status.sCode === 200 && setIsPaid(true);
  }, [status]);
  const vip: VipDict = {
    ChatAI助理: {
      week: { productCode: "CHAT_TEXT_W", price: 29.9 },
      month: { productCode: "CHAT_TEXT_M", price: 49.9 },
      quarter: { productCode: "CHAT_TEXT_Q", price: 89.9 },
      year: { productCode: "CHAT_TEXT_Y", price: 249.9 },
    },
    AI口语陪练: {
      week: { productCode: "CHAT_VOICE_W", price: 39.9 },
      month: { productCode: "CHAT_VOICE_M", price: 69.9 },
      quarter: { productCode: "CHAT_VOICE_Q", price: 119.9 },
      year: { productCode: "CHAT_VOICE_Y", price: 369.9 },
    },
    AI绘图翻译: {
      month: { productCode: "CHAT_VOICE_M", price: 39.9 },
    },
  };
  const planDurationDict: Record<string, string> = {
    week: "一周会员",
    month: "月度会员",
    quarter: "季度会员",
    year: "年度会员",
  };
  const planDayPrice = (price: number, duration: string) => {
    let _price = 0;
    if (duration === "week") _price = price / 7;
    if (duration === "month") _price = price / 30;
    if (duration === "quarter") _price = price / 90;
    if (duration === "year") _price = price / 365;
    return (Math.floor(_price * 10) / 10).toFixed(1);
  };
  const { container, title, header, body, cardContainer, price, itemName, toggle, buyBtn, priceDay, recommended, headerText, diamondIcon, toggleBtn, modal, modalHeader, modalPrice, payMethodGroup, wx, payMethod, btnGroup, finishBtn, cancelBtn, QRCodeContainer, QRCodeImg, toturial, wxPayIcon, tip, QRCodeGroup } = styles;
  const [plan, setPlan] = useState<PlanName>("ChatAI助理");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { urlQRcode } = useSelector((state: WechatPayState) => state.wechatPay);

  const [wsTimeOut, setWsTimeOut] = useState<boolean>(false); //also QRCode expired
  const [planInfo, setPlanInfo] = useState<{
    planName: PlanName;
    planDuration: string;
    planPrice: number;
    productCode: string;
  }>({ planName: "ChatAI助理", planDuration: planDurationDict["year"], planPrice: 249.9, productCode: "CHAT_TEXT_Y" });
  const recommendedDuration = "year";
  const dispatch: Function = useDispatch();
  const [isPaid, setIsPaid] = useState<boolean>(false); //TODO: listen isPaid
  const token = useToken();
  const listenIsPaid = () => {
    ws = new WebSocket(`wss://kitzone.cn:9443/user/wxPay/wss?token=${token}`);
    ws.onopen = () => {
      console.log("ws open");

      setWsTimeOut(false);
    };
    ws.onmessage = (e) => {
      const _userInfo = JSON.parse(e.data);
      const __userInfo = { ..._userInfo, ...userInfo };
      lsSet("userInfo", __userInfo);
      dispatch(saveUserInfo(__userInfo));

      setIsPaid(true);
      success("支付成功");

      ws && ws.close();
      setIsModalOpen(false);
    };
    ws.onclose = (e) => {
      console.log("ws close");
      if (e.code === 1000) {
        setWsTimeOut(true);
        return;
      }
      if (e.code === 3200) {
        return;
      }
      if (e.code === 4403) {
        return;
      }
    };
  };
  useEffect(() => {
    urlQRcode.url && listenIsPaid();
  }, [urlQRcode.url]);
  //QRCode expired and create new order
  useEffect(() => {
    if (wsTimeOut) {
      wsTimeOut && dispatch(createOrder({ product: planInfo.productCode }));
    }
  }, [wsTimeOut]);

  useEffect(() => {
    isModalOpen === false && dispatch(clearQRCode());
    isModalOpen === false && setIsPaid(false);
  }, [isModalOpen]);
  const QRCodeDict = {
    fulfilled: (
      <div className={QRCodeImg}>
        <img src={urlQRcode.url} alt="" />
      </div>
    ),
    rejected: <div className={QRCodeImg}>二维码生成失败</div>,
    pending: <div className={QRCodeImg}>正在生成二维码，请稍等...</div>,
  };
  const PlanBody = ({ planName }: { planName: PlanName }) => {
    return (
      <div className={body}>
        {isModalOpen ? (
          <Modal
            onClose={() => {
              ws && ws.close(3200, "client close");
              setIsPaid(false);
              dispatch(clearQRCode());
              dispatch(clearStatus());
            }}
            open={true}
            setIsOpen={setIsModalOpen}>
            <div className={modal}>
              <div className={modalHeader}>
                <strong>商品名称：</strong>
                {planInfo.planName}-{planDurationDict[planInfo.planDuration]}
              </div>

              <div className={modalPrice}>
                <strong>支付金额： </strong>￥{planInfo.planPrice}
              </div>

              {/* <p>{planInfo.productCode}</p> */}
              <div className={payMethod}>
                <strong>支付方式：</strong>
                <div className={payMethodGroup}>
                  <div className={wx}>
                    <RiWechatPayFill className={wxPayIcon} />

                    <div
                      style={{
                        marginLeft: 5,
                      }}>
                      微信支付
                    </div>
                  </div>
                </div>
              </div>
              <div className={QRCodeContainer}>
                <div className={QRCodeGroup}>{isPaid ? <div className={QRCodeImg}>支付成功</div> : QRCodeDict[urlQRcode.status]}</div>
                <div className={toturial}>
                  <img src={wxpaytut} alt="" />
                </div>
              </div>
              <div className={tip}>请打开手机微信，扫一扫完成支付</div>
              <div className={btnGroup}>
                <Button
                  onClick={() => {
                    dispatch(checkOrder());

                    //todo: check order status
                  }}
                  className={finishBtn}>
                  我已付款
                </Button>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                  className={cancelBtn}>
                  取消订单
                </Button>
              </div>
            </div>
          </Modal>
        ) : (
          <></>
        )}
        {Object.entries(vip[planName])
          .map(([key, value]) => {
            if (!value) return null;
            return (
              <div
                key={key}
                className={`${cardContainer} ${recommendedDuration === key ? recommended : ""}`}
                onClick={() => {
                  const orderPostDto: OrderPostDto = {
                    product: value.productCode,
                  };
                  dispatch(createOrder(orderPostDto));
                  setIsModalOpen(true);
                  setPlanInfo({ planName, planDuration: key, planPrice: value.price, productCode: value.productCode });
                }}>
                <span className={itemName}>{planDurationDict[key]}</span>
                <span className={price}>￥{value.price}</span>
                <span className={priceDay}>
                  每天
                  <span
                    style={{
                      color: "red",
                      fontSize: 16,
                      letterSpacing: 0,
                    }}>
                    ￥{planDayPrice(value.price, key)}
                  </span>
                </span>
                <Button className={buyBtn}>立即购买</Button>
              </div>
            );
          })
          .reverse()}
      </div>
    );
  };

  return (
    <div className={container}>
      <Toggle btnClassName={toggleBtn} className={toggle} value={plan} setValue={setPlan}>
        {Object.keys(vip).map((name) => name)}
      </Toggle>
      <div className={header}>
        {["3.5无限制使用", "一站式访问GPT 3.5与4.0", "轻松享受Plus企业级架构的低延迟体验"].map((item) => (
          <span key={item} className={headerText}>
            <IoDiamondSharp className={diamondIcon} />
            {item}
          </span>
        ))}
      </div>
      <PlanBody planName={plan} />
    </div>
  );
};

export default Shop;
