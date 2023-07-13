import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { apiBaseUrl } from "../config/axiosConfig";
import { AxiosResponse, isAxiosError } from "axios";

export interface OrderPostDto {
  product: string;
}
export interface OrderCheckPostDto {
  //0:unpaid，1：paid
  code: 0 | 1;
}
export interface OrderResponseDto {
  message: string;
  QRcode_url: string;
  orderNo: string;
}
export interface WechatPayState {
  wechatPay: WechatPaySliceState;
}
export interface WechatPaySliceState {
  urlQRcode: {
    url: string;
    status: "pending" | "fulfilled" | "rejected";
  };
}

export const createOrder = createAsyncThunk("wechatPay/create", async (orderPostDto: OrderPostDto, { dispatch, rejectWithValue }) => {
  const url = apiBaseUrl + ":9443/user/wxpay/native/create";
  try {
    const response: AxiosResponse<OrderResponseDto, OrderPostDto> = await axiosInstance.post(url, orderPostDto);

    return { status: response.status, data: response.data.QRcode_url };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      return rejectWithValue(errCode);
    }
  }
});

const initialState: WechatPaySliceState = {
  urlQRcode: {
    url: "",
    status: "pending",
  },
};
export const wechatPaySlice = createSlice({
  name: "wechatPay",
  initialState,
  reducers: {
    clearQRCode(state) {
      state.urlQRcode = {
        url: "",
        status: "pending",
      };
    },
    setWechatPay(state, action) {
      state.urlQRcode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state, action) => {
      const { data, status } = action.payload as {
        data: string;
        status: number;
      };
      state.urlQRcode = {
        url: data,
        status: "fulfilled",
      };
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.urlQRcode = {
        url: "",
        status: "rejected",
      };
    });
    builder.addCase(createOrder.pending, (state, action) => {
      state.urlQRcode = {
        url: "",
        status: "pending",
      };
    });
  },
});
export default wechatPaySlice.reducer;
export const { setWechatPay, clearQRCode } = wechatPaySlice.actions;
