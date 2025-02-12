import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar.jsx";
import FooterAdmin from "./footer/FooterAdmin";
import MenuAdmin from "./menu/MenuAdmin";
import '../../styles/global.scss';


function AdminLayout() {

  return (
    <div className="main">
        <Navbar />

        <div className="container">
            <div className="menuContainer">
                <MenuAdmin/>
            </div>

            <div className="contentContainer">
                <Outlet />
            </div>
        </div>


        <FooterAdmin />
        
    </div>
  );
}

export default AdminLayout;
