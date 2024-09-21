import React, { useContext, useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { AxiosCustom } from "../common/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { Valid } from "../common/Valid";
import { AppContext } from "../App";
import axios from "axios";
import { api, url } from "../common/Config";
import { fetchGallery } from "../redux/features/Gallery";

function GalleryAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState([]);
  const [data, setData] = useState({
    media: "",
    media_type: "",
  });

  const { lang } = useContext(AppContext);

  const handleUploadImage = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    console.log(selectedFile);

    const formData = new FormData();
    if ((selectedFile?.type).includes("video")) {
      formData.append("video", selectedFile);
      try {
        const response = await AxiosCustom(
          url + "back/videos",
          { method: "POST", data: formData },
          true
        );
        console.log(response);
        setData({ media: response.data.image, media_type: "video" });
      } catch (error) {
        alert("Error uploading video:", error);
        setFile(null);
      }
    } else {
      formData.append("image", selectedFile);
      try {
        const response = await AxiosCustom(
          url + "back/images?image_type=media",
          { method: "POST", data: formData },
          true
        );
        console.log(response);
        setData({ media: response.data.image, media_type: "image" });
      } catch (error) {
        alert("Error uploading image:", error);
        setFile(null);
      }
    }
    setFile({
      url: URL.createObjectURL(selectedFile),
      name: selectedFile.name,
      size: convertBytesToKBorMB(selectedFile.size),
      type: selectedFile.type, // Store the type of the file
    });
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
  const deleteImage = () => {
    setFile(null);
    setData({ media: "", media_type: "" });
  };

  const sendData = async (e) => {
    e.preventDefault();
    console.log(data);
    try {
      const res = await AxiosCustom("/back/galleries", {
        method: "POST",
        data,
      });
      if (res.status) {
        await dispatch(fetchGallery());
        navigate("/gallery");
      }
    } catch (error) {
      alert("Error sending data:", error);
    }
  };

  return (
    <div className="dress-add">
      <Breadcrumb
        page={"gallery"}
        pageLink={"gallery"}
        name={t("galleryAdd")}
      />
      <form onSubmit={sendData}>
        <div className="dress-add_content flex mt-5 justify-center">
          <div className="right-container w-2/5 h-[70vh]">
            <div className="dress-add_content_right w-full overflow-auto rounded-lg border bg-white">
              <div className="name px-5 py-4 font-bold border-b">
                {t("uploadImage")}
              </div>
              <div className="inputs p-5">
                {file?.type ? (
                  <div className="uploading-image_progressbar mb-3">
                    <div className="uploading-image mt-5 flex justify-between items-center">
                      <div className="left w-full flex flex-wrap items-center justify-between">
                        <div className="image w-full rounded-lg overflow-hidden">
                          {file.type.includes("video") ? (
                            <video
                              className="max-h-[225px] w-full object-cover"
                              controls
                            >
                              <source src={file.url} type={file.type} />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img
                              className="max-h-[225px] w-full object-cover"
                              src={file.url}
                              alt=""
                            />
                          )}
                        </div>
                        <div className="info mt-3 flex flex-col justify-center">
                          <div className="name">{file.name}</div>
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
                onClick={() => navigate("/gallery")}
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
      </form>
    </div>
  );
}

export default GalleryAdd;
