import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";

export type ResType = {
  message: string;
  success: boolean;
};

export const responseToast = (
  response: any,
  navigate: NavigateFunction,
  url: string
) => {
  if (response.data.success) {
    toast.success(response.data.message);
    navigate(url);
  } else {
    toast.error(response.data.message);
  }
};