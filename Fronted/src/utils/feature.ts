import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";

export type ResType = {
  message: string;
  success: boolean;
};

export const responseToast = (
  message: string,
  success: boolean,
  navigate?: NavigateFunction,
  url?: string
) => {
  if (success) {
    toast.success(message);
    if (navigate && url) {
      navigate(url);
    }
  } else {
    toast.error(message);
  }
};