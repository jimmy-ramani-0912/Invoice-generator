import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import InvoicePage from "./components/InvoicePageSection/InvoicePage";

function App() {
  return (
    <>
      <div className="h-screen w-screen overflow-x-hidden ">
        <Navbar />
        <InvoicePage />
        <Footer />
      </div>
    </>
  );
}

export default App;
