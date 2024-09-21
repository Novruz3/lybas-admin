import { t } from "i18next";
import React, { useContext, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { AxiosCustom } from "../common/AxiosInstance";
import Search from "../components/Search";
import { api, url } from "../common/Config";
import { fetchGallery, setLimit, setPage } from "../redux/features/Gallery";

const columns = [
  {
    id: "media",
    label: "media",
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

function Gallery() {
  const { lang } = useContext(AppContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const page = useSelector((state) => state?.Gallery?.page);
  const data = useSelector((state) => state?.Gallery?.data);
  const count = useSelector((state) => state?.Gallery?.count);
  const limit = useSelector((state) => state?.Gallery?.limit);

  const handleChangePage = async (event, newPage) => {
    await dispatch(setPage(newPage)); // Set newPage directly
    await dispatch(fetchGallery()); // Fetch the recipes for the new page
  };

  const handleChangeRowsPerPage = async (event) => {
    const newLimit = parseInt(event.target.value); // Convert rows per page to an integer
    await dispatch(setLimit(newLimit));
    await dispatch(setPage(0)); // Reset to first page after changing rows per page
    await dispatch(fetchGallery()); // Fetch the recipes with new limit
  };
  useEffect(() => {
    dispatch(fetchGallery());
  }, []);

  const deleteGallery = async (id) => {
    try {
      const res = await AxiosCustom("/back/galleries/" + id, {
        method: "DELETE",
      });
      if (res.status === 200) {
        dispatch(fetchGallery());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="orders-page">
      <Search
        title="gallery"
        className="mt-5"
        action={{ link: "gallery_add", text: "addGallery" }}
      />
      <div className="orders_table mt-5 shadow-lybas-1 rounded-lg overflow-hidden">
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
                  {data?.length > 0 &&
                    data.map((gallery, index) => (
                      <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                        <TableCell align={"center"}>
                          <div className={"table-with-grid_tr_data"}>
                            <div className="name font-semibold flex justify-center">
                              {gallery.media_type === "image" ? (
                                <img
                                  className="w-12 h-12 rounded-lg object-cover mr-3"
                                  src={api + gallery.media}
                                  alt=""
                                />
                              ) : (
                                <svg
                                  className="w-12 h-12 mr-3"
                                  focusable="false"
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  data-testid="Person2Icon"
                                >
                                  <path d="M18.39 14.56C16.71 13.7 14.53 13 12 13s-4.71.7-6.39 1.56C4.61 15.07 4 16.1 4 17.22V20h16v-2.78c0-1.12-.61-2.15-1.61-2.66zM9.78 12h4.44c1.21 0 2.14-1.06 1.98-2.26l-.32-2.45C15.57 5.39 13.92 4 12 4S8.43 5.39 8.12 7.29L7.8 9.74c-.16 1.2.77 2.26 1.98 2.26z"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align={"center"}>
                          <button
                            className="mr-3"
                            onClick={() => deleteGallery(gallery?.id)}
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
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50, 100]}
              component="div"
              count={count}
              rowsPerPage={limit}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
