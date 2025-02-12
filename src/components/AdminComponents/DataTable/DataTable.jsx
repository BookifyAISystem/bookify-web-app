import React from "react";
import "./DataTable.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const DataTable = ({ columns, rows, slug }) => {
    
    const actionColumn = {
        field: "action",
        headerName: "Action",
        width: 150,
        renderCell: (params) => {
          return (
            <div className="action">
              <Link to={`/admin/${slug}/${params.row.id}`}>
                <img src="/view.svg" alt="View" />
              </Link>
              <div className="delete" onClick={() => handleDelete(params.row.id)}>
                <img src="/delete.svg" alt="Delete" />
              </div>
            </div>
          );
        },
      };  
      const handleDelete = (id) => {
        console.log(`Deleting row with ID: ${id}`);

      };
      

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={rows}
        columns={[...columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};


DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    slug: PropTypes.string.isRequired,
  };

  
export default DataTable;
