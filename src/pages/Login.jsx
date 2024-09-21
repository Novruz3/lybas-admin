import { t } from "i18next";
import React, { useState } from "react";
import { AxiosCustom } from "../common/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [data, setData] = useState({
    login: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const sendData = async (e) => {
    e.preventDefault();
    console.log(data);
    try {
      const res = await AxiosCustom("admins/login", { method: "POST", data });
      if (res.status) {
        sessionStorage.setItem("access-token", res.data.access_token);
        sessionStorage.setItem("admin", res.data.login)
        navigate("/");
      }
    } catch (error) {
      // alert(error.response.data.message);
      setData({ login: "", password: "" });
    }
  };

  return (
    <div className="login-background bg-gray-100 w-screen h-screen">
      <div className="login w-4/5 m-auto absolute left-[50%] top-[50%] -translate-y-1/2 -translate-x-1/2 flex">
        <div className="login_form w-1/2 p-20 bg-white">
          <div className="login_form_title font-bold text-3xl mb-5">
            {t("signIn")}
          </div>
          <form onSubmit={sendData}>
            <label className="mb-2 block cursor-pointer" htmlFor="login">
              {t("login")}
            </label>
            <input
              type="text"
              id="login"
              value={data.login}
              name="login"
              onChange={handleData}
              required
              className="outline-none border w-full py-2 px-4 mb-4 rounded-lg text-lybas-gray"
            />
            <label className="mb-2 block cursor-pointer">{t("password")}</label>
            <div className="input_password pr-3 mb-5 text-lybas-gray flex justify-between items-center border rounded-lg">
              <input
                type={passwordOpen ? "text" : "password"}
                value={data.password}
                name="password"
                onChange={handleData}
                required
                className="outline-none py-2 px-4 w-full mr-3 text-lybas-gray"
              />
              {passwordOpen ? (
                <Visibility
                  onClick={() => setPasswordOpen(!passwordOpen)}
                  className="cursor-pointer"
                />
              ) : (
                <VisibilityOff
                  onClick={() => setPasswordOpen(!passwordOpen)}
                  className="cursor-pointer"
                />
              )}
            </div>
            <input
              type="submit"
              value={t("signIn")}
              className="bg-lybas-blue text-white w-full rounded-lg py-2 mb-5 text-center"
            />
          </form>
          <Link to="/register" className="cursor-pointer">
            Dont have an acoount?
          </Link>
        </div>
        <div className="welcome w-1/2 text-white font-bold text-3xl p-10 flex items-end">
          <span className="w-0">{t("heyWelcomeBack")}</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
