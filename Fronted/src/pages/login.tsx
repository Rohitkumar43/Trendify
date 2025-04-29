import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "../firebase";
import { getUser, useLoginMutation } from "../redux/api/userApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface MessageResponse {
  message: string;
  user?: any;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      if (!gender || !date) {
        toast.error("Please select gender and date of birth");
        return;
      }

      const { user } = await signInWithPopup(auth, googleProvider);

      if (!user) {
        toast.error("Failed to get user information");
        return;
      }

      try {
        const res = await login({
          name: user.displayName!,
          email: user.email!,
          photo: user.photoURL!,
          gender,
          role: "user",
          dob: date,
          _id: user.uid,
        });

        if ("data" in res) {
          const data = res.data as MessageResponse;
          toast.success(data.message);
          
          if (data.user) {
            dispatch(userExist(data.user));
            navigate("/");
          } else {
            // If no user data in response, try to fetch it
            const userData = await getUser(user.uid);
            if (userData?.user) {
              dispatch(userExist(userData.user));
              navigate("/");
            } else {
              toast.error("Failed to get user data");
              dispatch(userNotExist());
            }
          }
        } else {
          const error = res.error as FetchBaseQueryError;
          const message = (error.data as MessageResponse).message;
          toast.error(message || "Login failed");
          dispatch(userNotExist());
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Failed to communicate with server");
        dispatch(userNotExist());
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === "auth/operation-not-allowed") {
        toast.error("Google Sign-In is not enabled. Please contact support.");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup was blocked. Please allow popups for this site.");
      } else if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
        // This is a common error when user closes the popup - no need to show an error
        toast("Login cancelled");
      } else if (error.code === "auth/unauthorized-domain") {
        toast.error("This domain is not authorized for Google Sign-In. Make sure to add your domain in Firebase console.");
      } else if (error.code === "auth/network-request-failed") {
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        toast.error(error.message || "Sign In Failed");
      }
      dispatch(userNotExist());
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;