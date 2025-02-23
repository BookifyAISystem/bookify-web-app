import React, { useState } from 'react'
import './Users.scss'
import DataTable from '../DataTable/DataTable';
import Add from '../Add/Add';
import { userRows } from '../Data/userRows';

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "img",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  { 
    field: "firstName", 
    type: "string",
    headerName: "First name", 
    width: 150 
  },
  { 
    field: "lastName", 
    type: "string",
    headerName: "Last name", 
    width: 150 
  },
  { 
    field: "email", 
    type: "string",
    headerName: "Email", 
    width: 200 
  },
  { 
    field: "phone", 
    type: "string",
    headerName: "Phone", 
    width: 150
  },
  { 
    field: "createdAt", 
    type: "string",
    headerName: "Created At", 
    width: 150 
  },
  { 
    field: "verified", 
    type: "boolean",
    headerName: "Verified", 
    width: 100
  },
];

const Users = () => {
  const [open, setOpen] = useState(false);


  return (
    <div className='users'>
      <div className='info'>
        <h1>Users</h1>
        <button onClick={() => setOpen(true)}>Add New User</button>
      </div>

      <DataTable slug="users" columns={columns} rows={userRows} />

      {/* TEST THE API */}
      {/* {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="users" columns={columns} rows={data} />
      )} */}

      {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
    </div>
  )
}

export default Users