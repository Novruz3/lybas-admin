import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { Valid } from "../common/Valid";
import { AxiosCustom } from "../common/AxiosInstance";
import { useDispatch } from "react-redux";
import { fetchFAQ } from "../redux/features/FAQ";

function FAQAdd() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    title_tm: "",
    title_ru: "",
    title_en: "",
    description_tm : "",
    description_ru : "",
    description_en : ""
  });
  const sendData = async () => {
    if (Valid(data)) {
      try {
        const res = await AxiosCustom("/back/faqs", { method: "POST", data });
        console.log(res);
        if (res.status) {
          dispatch(fetchFAQ());
          navigate("/faq");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert(t("fillTheGaps"));
    }
  };

  return (
    <div className="dress-add">
      <Breadcrumb page={"faq"} pageLink={"faq"} name={t("addFAQ")} />

      <div className="dress-add_content flex justify-between mt-5">
        <div className="dress-add_content_left w-full h-[70vh] overflow-auto rounded-lg border bg-white mr-5">
          <div className="name px-5 py-4 font-bold border-b">
            {t("aboutTheFAQ")}
          </div>
          <div className="inputs grid grid-cols-2 gap-5 p-5">
            <div className="dress-input col-span-2">
              <label
                className="label font-semibold block mb-2.5"
              >
                {`${t("title")}_tm`}
              </label>
              <input
                name="title_tm"
                value={data.title_tm}
                onChange={(e) => setData({ ...data, title_tm: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t("title")}_tm`}
              />
            </div>
            <div className="dress-input col-span-2">
              <label
                className="label font-semibold block mb-2.5"
              >
                {`${t("title")}_ru`}
              </label>
              <input
                name="title_ru"
                value={data.title_ru}
                onChange={(e) => setData({ ...data, title_ru: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t("title")}_ru`}
              />
            </div>
            <div className="dress-input col-span-2">
              <label
                className="label font-semibold block mb-2.5"
              >
                {`${t("title")}_en`}
              </label>
              <input
                name="title_en"
                value={data.title_en}
                onChange={(e) => setData({ ...data, title_en: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t("title")}_en`}
              />
            </div>
            <div className="dress-input col-span-2">
              <label
                className="label font-semibold block mb-2.5"
              >
                {`${t("description")}_tm`}
              </label>
              <textarea
                name="description_tm"
                value={data.name_tm}
                onChange={(e) => setData({ ...data, description_tm: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t("description")}_tm`}
              />
            </div>
            <div className="dress-input col-span-2">
              <label
                className="label font-semibold block mb-2.5"
              >
                {`${t("description")}_ru`}
              </label>
              <textarea
                name="description_ru"
                value={data.description_ru}
                onChange={(e) => setData({ ...data, description_ru: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t("description")}_ru`}
              />
            </div>
            <div className="dress-input col-span-2">
              <label
                className="label font-semibold block mb-2.5"
              >
                {`${t("description")}_en`}
              </label>
              <textarea
                name="description_en"
                value={data.description_en}
                onChange={(e) => setData({ ...data, description_en: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t("description")}_en`}
              />
            </div>
            <div className="actions col-span-2 flex mt-10">
              <button
                onClick={() => navigate("/faq")}
                className="bg-white border mr-5 px-20 py-2 rounded hover:bg-gray-100"
              >
                {t("cancel")}
              </button>
              <button
                onClick={sendData}
                className="bg-lybas-blue text-white border px-20 py-2 rounded hover:bg-blue-800"
              >
                {t("add")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQAdd;
