import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { t } from "i18next";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AxiosCustom } from "../common/AxiosInstance";
import { fetchAboutUs } from "../redux/features/AboutUs";

const columns = [
  {
    id: "nameSimple",
    label: "nameSimple",
    minWidth: 170,
    align: "center",
  },
  {
    id: "desc",
    label: "desc",
    minWidth: 170,
    align: "center",
  },
  {
    id: "delete",
    label: "delete",
    minWidth: 100,
    align: "center",
  },
];

function AboutUs() {
  const data = useSelector((state) => state?.AboutUs?.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = localStorage.getItem("lang");

  useEffect(() => {
    if (!data?.length) dispatch(fetchAboutUs());
  }, []);

  const deleteAboutUs = async (id) => {
    try {
      const res = await AxiosCustom("/back/about-us/" + id, {
        method: "DELETE",
      });
      if (res.status === 200) {
        dispatch(fetchAboutUs());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="categories">
      {!data && (
        <Search
          title="aboutUs"
          className="mt-5"
          action={{ link: "aboutUs_add", text: "addAboutUs" }}
        />
      )}
      <div className="notification_table mt-5 shadow-lybas-1 rounded-lg overflow-hidden">
        <div className="relative overflow-x-auto">
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell
                        key={index}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        <span className="font-bold">{t(column.label)}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell align={"center"}>
                        <div className="name font-semibold">
                          {data?.about_us?.title_en}
                        </div>
                      </TableCell>
                      <TableCell align={"center"}>
                        <div className="name font-semibold">
                          {data?.about_us?.description_en}
                        </div>
                      </TableCell>
                      <TableCell align={"center"}>
                        <button
                          className="mr-3"
                          onClick={() => deleteAboutUs(data?.about_us?.id)}
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
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
