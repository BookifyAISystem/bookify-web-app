import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";


function CustomerLayout() {

  return (
    <div>
      <header>
        <Header />
      </header>
      <div>

        <main >
          <Outlet />
        </main>
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default CustomerLayout;
