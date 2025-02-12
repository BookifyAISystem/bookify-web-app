import React from "react";
import PropTypes from "prop-types";
import "./Add.scss";

const Add = ({ slug, columns, setOpen }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Thêm item mới vào danh sách (chưa kết nối API)
    setOpen(false);
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>
          X
        </span>
        <h1>Add new {slug}</h1>
        <form onSubmit={handleSubmit}>
          {columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column, index) => (
              <div className="item" key={index}>
                <label>{column.headerName}</label>
                <input type={column.type || "text"} placeholder={column.field} />
              </div>
            ))}
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
};

Add.propTypes = {
  slug: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Add;
