import React, { useState } from 'react'
import './Books.scss'
import Add from '../Add/Add';
import { dataBooks } from '../Data/dataBooks';
import DataTable from '../DataTable/DataTable';

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "img",
    headerName: "Cover",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img} alt="" />;
    },
  },
  { 
    field: "title", 
    type: "string",
    headerName: "Title", 
    width: 150 
  },
  { 
    field: "author", 
    type: "string",
    headerName: "Author", 
    width: 150 
  },
  { 
    field: "price", 
    type: "string",
    headerName: "Price", 
    width: 200 
  },
  { 
    field: "publishedDate", 
    type: "string",
    headerName: "Published Date", 
    width: 200 
  },
  { 
    field: "inStock", 
    type: "boolean",
    headerName: "In Stock", 
    width: 150 
  },
];

const Books = () => {
  const [open, setOpen] = useState(false);
  
  
    return (
      <div className='books'>
        <div className='info'>
          <h1>Books</h1>
          <button onClick={() => setOpen(true)}>Add New Books</button>
        </div>
  
        <DataTable slug="books" columns={columns} rows={dataBooks} />
  
  
        {open && <Add slug="books" columns={columns} setOpen={setOpen} />}
      </div>
    )
  }

export default Books