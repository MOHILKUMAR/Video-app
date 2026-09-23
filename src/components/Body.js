import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { closeDrawer } from "../utils/appSlice";
import Sidebar, { SidebarDrawer } from "./Sidebar";
import Footer from "./Footer";

const Body = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  // The watch page gives the player the full width; its menu is the drawer.
  const isWatchPage = location.pathname === "/watch";

  useEffect(() => {
    dispatch(closeDrawer());
  }, [location, dispatch]);

  return (
    <div className="flex">
      {!isWatchPage && <Sidebar />}
      <SidebarDrawer />
      <main className="@container flex min-h-[calc(100dvh-3.5rem)] min-w-0 flex-1 flex-col">
        <div className="flex-1 px-4 sm:px-6">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Body;
