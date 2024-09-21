import React, { useContext, useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { Select, MenuItem, FormControl, Chip, Box } from "@mui/material";
import { AxiosCustom } from "../common/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { Valid } from "../common/Valid";
import { AppContext } from "../App";
import axios from "axios";
import { api, url } from "../common/Config";
import { fetchBanners } from "../redux/features/Banners";

function BannerAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState([]);
  const [data, setData] = useState({
    title_tm: "",
    title_ru: "",
    title_en: "",
    sub_title_tm: "",
    sub_title_ru: "",
    sub_title_en: "",
    description_tm: "",
    description_ru: "",
    description_en: "",
    image: {
      url: "",
      hash_blur: "",
    },
  });

  const { lang } = useContext(AppContext);

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleUploadImage = async (event) => {
    const formData = new FormData();
    formData.append("image", event.target.files[0]);
    setFile({
      url: URL.createObjectURL(event.target.files[0]),
      name: event.target.files[0].name,
      size: convertBytesToKBorMB(event.target.files[0].size),
    });
    try {
      const res = await AxiosCustom(
        url + "back/images/blur-hash",
        { method: "POST", data: formData },
        true
      );
      setData({
        ...data,
        image: {
          url: res.data.image.url,
          hash_blur: res.data.image.hash_blur,
        },
      });
    } catch (err) {
      console.error(err);
    }
    // axios
    //   .post(url + "back/images/blur-hash", formData)
    //   .then((response) => {
    //     console.log(response);
    //     setData({
    //       ...data,
    //       image: {
    //         url: response.data.image.url,
    //         hash_blur: response.data.image.hash_blur,
    //       },
    //     });
    //   })
    //   .catch((error) => {
    //     alert("Error uploading file:", error);
    //     setFile({});
    //   });
  };
  function convertBytesToKBorMB(bytes) {
    const KB = 1024;
    const MB = 1024 * KB;

    if (bytes < KB) {
      return bytes + " bytes";
    } else if (bytes < MB) {
      return (bytes / KB).toFixed(2) + " KB";
    } else {
      return (bytes / MB).toFixed(2) + " MB";
    }
  }
  function calculateImageSize(size) {
    const isImageTooBig = size > 10 * 1024 * 1024; // 10 MB in bytes

    if (isImageTooBig) {
      return false;
    }
    return true;
  }
  const deleteImage = async () => {
    try {
      const res = await AxiosCustom("/back/images", {
        method: "DELETE",
        data: { image: data.image },
      });

      if (res.status === 200) {
        console.log("Image deleted successfully");
        // Optionally, reset the image data in the state if needed
        setFile({});
        setData({ ...data, image: {} });
      } else {
        console.error("Failed to delete image", res);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const sendData = async (e) => {
    e.preventDefault();
    console.log(data);
    try {
      if (Valid(data)) {
        const res = await AxiosCustom("/back/sliders", {
          method: "POST",
          data,
        });
        if (res.status) {
          await dispatch(fetchBanners());
          navigate("/banner");
        }
      } else {
        alert(t("fillTheGaps"));
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="dress-add">
      <Breadcrumb page={"banners"} pageLink={"banners"} name={t("bannerAdd")} />
      <div>
        <div className="dress-add_content flex justify-between mt-5">
          <div className="dress-add_content_left w-3/5 h-[70vh] overflow-auto rounded-lg border bg-white mr-5">
            <div className="name px-5 py-4 font-bold border-b">
              {t("bannerInformation")}
            </div>
            <div className="inputs grid grid-cols-2 gap-5 p-5">
              <div className="dress-input">
                <label className="label font-semibold block mb-2.5">
                  {`${t("title")}_tm`}
                </label>
                <input
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("title")}_tm`}
                  name="title_tm"
                  value={data.title_tm}
                  onChange={handleInput}
                />
              </div>
              <div className="dress-input">
                <label className="label font-semibold block mb-2.5">
                  {`${t("title")}_ru`}
                </label>
                <input
                  name="title_ru"
                  value={data.title_ru}
                  onChange={handleInput}
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("title")}_ru`}
                />
              </div>
              <div className="dress-input">
                <label className="label font-semibold block mb-2.5">
                  {`${t("title")}_en`}
                </label>
                <input
                  name="title_en"
                  value={data.title_en}
                  onChange={handleInput}
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("title")}_en`}
                />
              </div>
              <div className="dress-input col-span-2">
                <label className="label font-semibold block mb-2.5">
                  {`${t("sub_title")}_tm`}
                </label>
                <textarea
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("sub_title")}_tm`}
                  name="sub_title_tm"
                  value={data.sub_title_tm}
                  onChange={handleInput}
                />
              </div>
              <div className="dress-input col-span-2">
                <label className="label font-semibold block mb-2.5">
                  {`${t("sub_title")}_ru`}
                </label>
                <textarea
                  name="sub_title_ru"
                  value={data.sub_title_ru}
                  onChange={handleInput}
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("sub_title")}_ru`}
                />
              </div>
              <div className="dress-input col-span-2">
                <label className="label font-semibold block mb-2.5">
                  {`${t("sub_title")}_en`}
                </label>
                <textarea
                  name="sub_title_en"
                  value={data.sub_title_en}
                  onChange={handleInput}
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("sub_title")}_en`}
                />
              </div>
              <div className="dress-input col-span-2">
                <label className="label font-semibold block mb-2.5">
                  {`${t("description")}_tm`}
                </label>
                <textarea
                  name="description_tm"
                  value={data.description_tm}
                  onChange={handleInput}
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("description")}_tm`}
                />
              </div>
              <div className="dress-input col-span-2">
                <label className="label font-semibold block mb-2.5">
                  {`${t("description")}_ru`}
                </label>
                <textarea
                  name="description_ru"
                  value={data.description_ru}
                  onChange={handleInput}
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("description")}_ru`}
                />
              </div>
              <div className="dress-input col-span-2">
                <label className="label font-semibold block mb-2.5">
                  {`${t("description")}_en`}
                </label>
                <textarea
                  name="description_en"
                  value={data.description_en}
                  onChange={handleInput}
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("description")}_en`}
                />
              </div>
            </div>
          </div>
          <div className="right-container w-2/5 h-[70vh]">
            <div className="dress-add_content_right w-full overflow-auto rounded-lg border bg-white">
              <div className="name px-5 py-4 font-bold border-b">
                {t("uploadImage")}
              </div>
              <div className="inputs p-5">
                {file?.url ? (
                  <div className="uploading-image_progressbar mb-3">
                    <div className="uploading-image mt-5 flex justify-between items-center">
                      <div className="left w-full flex flex-wrap items-center justify-between">
                        <div className="image w-full rounded-lg overflow-hidden">
                          <img
                            className="max-h-[225px] w-full object-cover"
                            src={file?.url}
                            alt=""
                          />
                        </div>
                        <div className="info mt-3 flex flex-col justify-center">
                          <div className="name">{file?.name}</div>
                        </div>
                        <button onClick={deleteImage}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.33317 15.8337L4.1665 14.667L8.83317 10.0003L4.1665 5.33366L5.33317 4.16699L9.99984 8.83366L14.6665 4.16699L15.8332 5.33366L11.1665 10.0003L15.8332 14.667L14.6665 15.8337L9.99984 11.167L5.33317 15.8337Z"
                              fill="#0B1527"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full mt-3">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full  border-2 border-lybas-blue border-dashed rounded-lg cursor-pointer bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="mb-3"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 16V7.85L8.4 10.45L7 9L12 4L17 9L15.6 10.45L13 7.85V16H11ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z"
                            fill="#0E1217"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-lybas-blue">
                          {t("clickToUpload")}
                        </p>
                        <p className="text-xs text-gray-500">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        onChange={handleUploadImage}
                        type="file"
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="actions flex mt-10">
              <button
                onClick={() => navigate("/banner")}
                className="bg-white border mr-5 w-full py-2 rounded hover:bg-gray-100"
              >
                {t("cancel")}
              </button>
              <button
                onClick={sendData}
                className={
                  "text-white border flex items-center justify-center w-full py-2 rounded bg-lybas-blue hover:bg-blue-800"
                }
              >
                <span className="mr-3">{t("add")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerAdd;
