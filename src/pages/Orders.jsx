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
import { fetchOrders, setLimit, setPage } from "../redux/features/Orders";
import { AxiosCustom } from "../common/AxiosInstance";

const columns = [
  {
    id: "client",
    label: "client",
    minWidth: 170,
    align: "left",
  },
  {
    id: "email",
    label: "email",
    minWidth: 170,
    align: "left",
  },
  {
    id: "product",
    label: "product",
    minWidth: 170,
    align: "left",
  },
  {
    id: "message",
    label: "message",
    minWidth: 170,
    align: "left",
  },
  {
    id: "delete",
    label: "delete",
    minWidth: 100,
    align: "right",
  },
];

function Orders() {
  const { lang } = useContext(AppContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const page = useSelector((state) => state?.Orders?.page);
  const data = useSelector((state) => state?.Orders?.data);
  const count = useSelector((state) => state?.Orders?.count);
  const limit = useSelector((state) => state?.Orders?.limit);

  const handleChangePage = async (event, newPage) => {
    await dispatch(setPage(newPage)); // Set newPage directly
    await dispatch(fetchOrders()); // Fetch the recipes for the new page
  };

  const handleChangeRowsPerPage = async (event) => {
    const newLimit = parseInt(event.target.value); // Convert rows per page to an integer
    await dispatch(setLimit(newLimit));
    await dispatch(setPage(0)); // Reset to first page after changing rows per page
    await dispatch(fetchOrders()); // Fetch the recipes with new limit
  };
  useEffect(() => {
    dispatch(fetchOrders());
  }, []);
  console.log(data);

  const deleteOrder = async (id) => {
    try {
      const res = await AxiosCustom("/back/mails/" + id, { method: "DELETE" });
      if (res.status === 200) {
        dispatch(fetchOrders());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="orders-page">
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
                    data.map((order, index) => (
                      <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                        <TableCell align={"left"}>
                          <div className={"table-with-grid_tr_data"}>
                            <div className="name font-semibold">
                              {order?.full_name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align={"left"}>
                          <div
                            className={"table-with-grid_tr_data text-gray-600"}
                          >
                            <div className="name font-semibold">
                              {order?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align={"left"}>
                          <div
                            className={"table-with-grid_tr_data text-gray-600"}
                          >
                            <div className="name font-semibold">
                              {order?.product?.name_tm}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align={"left"}>
                          <div
                            className={"table-with-grid_tr_data text-gray-600"}
                          >
                            <div className="name font-semibold">
                              {order?.letter}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align={"right"}>
                          <button
                            className="mr-3"
                            onClick={() => deleteOrder(order?.id)}
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

export default Orders;
