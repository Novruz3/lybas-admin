import React, { useContext, useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { AxiosCustom } from "../common/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { Valid } from "../common/Valid";
import { AppContext } from "../App";
import axios from "axios";
import { api, url } from "../common/Config";
import { fetchRecipes } from "../redux/features/Recipes";

function RecipesAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState([]);
  const [data, setData] = useState({
    name_tm: "",
    name_ru: "",
    name_en: "",
    description_tm: "",
    description_ru: "",
    description_en: "",
    image: "",
  });
  const [composition, setComposition] = useState({
    name_tm: "",
    name_ru: "",
    name_en: "",
    percentage: 0,
  });
  const [compositions, setCompositions] = useState([]);

  const { lang } = useContext(AppContext);

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleInputComposition = (e) => {
    const { name, value } = e.target;

    // Convert 'percentage' field to a number
    setComposition({
      ...composition,
      [name]: name === "percentage" ? Number(value) : value,
    });
  };
  const handleUploadImage = (event) => {
    const formData = new FormData();
    formData.append("image", event.target.files[0]);
    setFile({
      url: URL.createObjectURL(event.target.files[0]),
      name: event.target.files[0].name,
      size: convertBytesToKBorMB(event.target.files[0].size),
    });
    axios
      .post(url + "back/images?image_type=recipe", formData)
      .then((response) => {
        console.log(response);
        setData({ ...data, image: response.data.image });
      })
      .catch((error) => {
        alert("Error uploading file:", error);
        setFile({});
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
        setData({ ...data, image: "" });
      } else {
        console.error("Failed to delete image", res);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendData = async (e) => {
    e.preventDefault();

    // Create a new data object that includes the compositions
    const newDataWithCompositions = {
      ...data,
      compositions: compositions.length > 0 ? compositions : null,
    };

    try {
      // First request - just sending `data` (without compositions)
      if (Valid(data)) {
        const res1 = await AxiosCustom("/back/recipes", {
          method: "POST",
          data: data, // Only `data` sent here
        });
        if (res1.status) {
          await dispatch(fetchRecipes());
          navigate("/recipes");
        }

        // Second request - sending `data` with `compositions`
        if (!res1.status && compositions.length > 0) {
          const res2 = await AxiosCustom("/back/recipes", {
            method: "POST",
            data: newDataWithCompositions, // `data` with compositions sent here
          });

          if (res2.status) {
            await dispatch(fetchRecipes());
            navigate("/recipes");
          } else {
            alert(t("fillTheGaps"));
          }
        }
      } else {
        alert(t("fillTheGaps"));
      }
    } catch (error) {
      alert(error);
    }
  };

  const addCompositions = (e) => {
    e.preventDefault();

    // Check if the composition is valid before adding it
    if (
      !composition.name_tm ||
      !composition.name_ru ||
      !composition.name_en ||
      composition.percentage <= 0
    ) {
      alert("Please fill in all the fields correctly.");
      return;
    }

    // Add the current composition to the compositions array
    setCompositions((prevData) => [...prevData, composition]);

    // Reset the composition form
    setComposition({
      name_tm: "",
      name_ru: "",
      name_en: "",
      percentage: 0,
    });
    console.log(compositions);
    setOpen(false);
  };

  const deleteComposition = (index) => {
    setCompositions((prevCompositions) =>
      prevCompositions.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="dress-add">
      <Breadcrumb page={"recipes"} pageLink={"recipes"} name={t("recipeAdd")} />
      <div onSubmit={sendData}>
        <div className="dress-add_content flex justify-between mt-5">
          <div className="dress-add_content_left w-3/5 h-[70vh] overflow-auto rounded-lg border bg-white mr-5">
            <div className="name px-5 py-4 font-bold border-b">
              {t("recipeInformation")}
            </div>
            <div className="inputs grid grid-cols-2 gap-5 p-5">
              <div className="dress-input">
                <label className="label font-semibold block mb-2.5">
                  {`${t("nameSimple")}_tm`}
                </label>
                <input
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("nameSimple")}_tm`}
                  name="name_tm"
                  value={data.name_tm}
                  onChange={handleInput}
                />
              </div>
              <div className="dress-input">
                <label className="label font-semibold block mb-2.5">
                  {`${t("nameSimple")}_ru`}
                </label>
                <input
                  name="name_ru"
                  value={data.name_ru}
                  onChange={handleInput}
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("nameSimple")}_ru`}
                />
              </div>
              <div className="dress-input">
                <label className="label font-semibold block mb-2.5">
                  {`${t("nameSimple")}_en`}
                </label>
                <input
                  name="name_en"
                  value={data.name_en}
                  onChange={handleInput}
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={`${t("nameSimple")}_en`}
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
            <div className="filter-edit_body_datas grid grid-cols-3 gap-5 p-5">
              {compositions.length > 0 &&
                compositions.map((com, index) => (
                  <div className="data">
                    <div className="data_label font-bold mb-2">
                      {t("composition")} {index + 1}
                    </div>
                    <div className="data_input rounded-lg bg-gray-100 flex items-center">
                      <input
                        type="text"
                        className="outline-none w-full bg-gray-100 py-2.5 px-5 text-lybas-gray rounded-lg"
                        placeholder={t("nameSimple")}
                        value={com?.name_tm}
                      />
                      <button
                        className="mr-3"
                        onClick={() => deleteComposition(index)}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                            fill="#FF3521"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              <div className="flex items-end">
                <button
                  onClick={() => setOpen(true)}
                  className="bg-lybas-blue text-white py-2 px-4 rounded-lg"
                >
                  {t("add compositions")}
                </button>
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
                onClick={() => navigate("/recipes")}
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t("addNewOne")}</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
          <>
            <div className="input-filter flex flex-col mb-2">
              <label className="mb-2 text-black cursor-pointer" htmlFor="tm">
                Türkmençe
              </label>
              <input
                className="w-full text-lybas-gray rounded-lg bg-gray-100 outline-none py-2 px-5"
                type="text"
                id="tm"
                name="name_tm"
                value={composition.name_tm}
                onChange={handleInputComposition}
                placeholder="Türkmençe"
              />
            </div>
            <div className="input-filter flex flex-col mb-2">
              <label className="mb-2 text-black cursor-pointer" htmlFor="ru">
                Русский
              </label>
              <input
                className="w-full text-lybas-gray rounded-lg bg-gray-100 outline-none py-2 px-5"
                type="text"
                id="ru"
                name="name_ru"
                value={composition.name_ru}
                onChange={handleInputComposition}
                placeholder="Русский"
              />
            </div>
            <div className="input-filter flex flex-col">
              <label className="mb-2 text-black cursor-pointer" htmlFor="en">
                English
              </label>
              <input
                className="w-full text-lybas-gray rounded-lg bg-gray-100 outline-none py-2 px-5"
                type="text"
                id="en"
                name="name_en"
                value={composition.name_en}
                onChange={handleInputComposition}
                placeholder="English"
              />
            </div>
            <div className="input-filter flex flex-col mb-2">
              <label
                className="mb-2 text-black cursor-pointer"
                htmlFor="percentage"
              >
                Percentage
              </label>
              <input
                className="w-full text-lybas-gray rounded-lg bg-gray-100 outline-none py-2 px-5"
                type="number"
                id="percentage"
                name="percentage"
                value={composition.percentage}
                onChange={handleInputComposition}
                placeholder="Percentage"
                min="0"
                max="100"
              />
            </div>
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button onClick={addCompositions} autoFocus>
            <span>{t("add")}</span>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RecipesAdd;
