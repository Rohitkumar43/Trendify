import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userApi";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api-types";
import { responseToast } from "../../utils/feature";
import { Skeleton } from "../../components/loader";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];
const Customers = () => {

   const { user } = useSelector((state: RootState) => state.useReducer);

   
    const { isLoading, data, isError, error } = useAllUsersQuery(user?._id!);
    const [rows, setRows] = useState<DataType[]>([]);

    const [deleteuser] = useDeleteUserMutation();


   const deletehandler = async(userId: string) => {
    const res = await deleteuser({userId , adminUserId: user?._id!})
    responseToast(res , null , '');

  }



  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  // apply the useeffect to map the things into this 

  useEffect(() => {
    if(data){
      setRows(data.users.map((i) => ({
        avatar: <img src={i.photo}/>,
        name: i.name,
        email: i.email,
        gender: i.gender,
        role: i.role,
        action: <button onClick={() => deletehandler(i._id)}><FaTrash/></button>
      })))
    }


  }, [data]);


  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default Customers;
