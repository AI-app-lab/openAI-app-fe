import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { rejects } from "assert";
import { AxiosResponse, isAxiosError } from "axios";
import { err } from "../utils/alert";
import axiosInstance, { apiBaseUrl } from "../config/axiosConfig";
type Size = "512x512" | "1024x1024";
export interface AiDrawApiRequestDto {
  prompt: string;
  n: number;
  size: Size;
}

interface AiDrawSliceState {
  n: number;
  size: Size;
  images: Array<string>;
  isLoading: boolean;
}
export interface AiDrawState {
  aiDraw: AiDrawSliceState;
}
export const getPictures = createAsyncThunk("aiDrawApi/getPictures", async (drawRequestDto: AiDrawApiRequestDto, { rejectWithValue }) => {
  const drawUrl = import.meta.env.VITE_DRAW_URL;
  try {
    const response = await axiosInstance.post(apiBaseUrl + drawUrl, drawRequestDto);
    const { data, status } = response as AxiosResponse<any>;
    return { data, status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      return rejectWithValue(errCode);
    }
  }
});

const initialState: AiDrawSliceState = {
  n: 1,
  size: "512x512",
  images: [],
  isLoading: false,
};
export const aiDrawApiSlice = createSlice({
  name: "aiDraw",
  initialState,
  reducers: {
    setNumPictures: (state, action) => {
      state.n = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPictures.fulfilled, (state, action) => {
      state.isLoading = false;
      state.images = [];
      action.payload?.data.data.map((item: any) => {
        state.images.push(item.url);
      });
    });
    builder.addCase(getPictures.rejected, (state, action) => {
      state.isLoading = false;
      switch (action.payload) {
        case 400:
          err("指令格式有误");
          break;
        case 401:
          err("未授权");
          break;
        case 403:
          err("服务未开通或已过期");
          break;
        default:
          err("未知错误");
      }
    });
    builder.addCase(getPictures.pending, (state, action) => {
      state.isLoading = true;
      console.log("getPictures.pending", action);
    });
  },
});

export const { setNumPictures, setSize } = aiDrawApiSlice.actions;
export default aiDrawApiSlice.reducer;
