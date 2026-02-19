import { Outlet } from "react-router-dom";
import Sidebar from "../composants/Sidebar";
import { useState } from "react";
import Footer from "../composants/Footer";
import Avatar from "../composants/Avatar";

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? "md:ml-72" : "md:ml-20"
        }`}
      >
        <main className="flex-1 flex flex-col bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#c7d2fe] p-4 sm:p-8 lg:p-12 min-h-screen relative">
          {/* Avatar flottant en haut à droite du main */}
          <div className="absolute top-0 right-0 z-20 p-6">
            <Avatar />
          </div>
          <div className="flex-1 flex justify-center items-start w-full py-15">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DefaultLayout;
