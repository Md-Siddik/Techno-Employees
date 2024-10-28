import { Outlet } from "react-router-dom";
import LeftSideBar from "../SideBar/LeftSideBar";
import RightSideBar from "../SideBar/RightSideBar";

const Main = ({ isAdmin }) => {
    return (
        <div className="flex items-center justify-between min-w-screen min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
            <LeftSideBar userRole={isAdmin ? "admin" : "employee"} />
            <Outlet />
            <RightSideBar />
        </div>
    );
};

export default Main;