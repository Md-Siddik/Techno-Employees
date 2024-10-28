import { useState } from 'react';

const RightSideBar = ({ userRole }) => {
    const [activeTab, setActiveTab] = useState("Recent");

    const isAdmin = userRole === "admin";
    const tabs = isAdmin ? ["Recent", "Reports", "Analytics", "Settings"] : ["Notifications", "Updates"];

    const sideBarContent = isAdmin
        ? {
            Recent: [
                { id: 1, title: "New User SignUp", time: "Today", description: "John Doe signed up" },
                { id: 2, title: "System Alert", time: "Yesterday", description: "Server restart scheduled" },
            ],
            Reports: [
                { id: 1, title: "Monthly Sales", time: "October", description: "Sales Report ready" },
                { id: 2, title: "User Growth", time: "Q3", description: "User growth increased" },
            ],
            Analytics: [
                { id: 1, title: "Website Traffic", time: "This Week", description: "Increased by 30%" },
                { id: 2, title: "User Engagement", time: "Last Month", description: "High interaction rate" },
            ],
            Settings: [
                { id: 1, title: "Admin Preferences", time: "Updated", description: "New settings applied" },
                { id: 2, title: "Security", time: "This Week", description: "2FA enabled" },
            ],
        }
        : {
            Notifications: [
                { id: 1, title: "Message", time: "10 mins ago", description: "You have a new message" },
                { id: 2, title: "Update", time: "1 hr ago", description: "System update available" },
            ],
            Updates: [
                { id: 1, title: "App Version", time: "Today", description: "New version released" },
                { id: 2, title: "Feature", time: "Last Week", description: "New feature added" },
            ],
        };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="w-[20%] min-h-screen border-l border-gray-400 p-4">
            <h1 className="text-2xl font-bold text-gray-300 mb-4">Right Sidebar</h1>
            <div className="flex overflow-x-auto mb-6 whitespace-nowrap">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`px-3 py-2 rounded-lg font-semibold text-sm transition duration-200 ${
                            activeTab === tab
                                ? 'bg-white/10 backdrop-blur-md shadow-md text-gray-800'
                                : 'text-gray-400 hover:bg-white/5'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div>
                {(sideBarContent[activeTab] || []).map((content) => (
                    <ContentCard
                        key={content.id}
                        title={content.title}
                        time={content.time}
                        description={content.description}
                    />
                ))}
            </div>
        </div>
    );
};

const ContentCard = ({ title, time, description }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20 transition duration-300 ease-in-out hover:bg-white/20 transform mt-4">
        <div className="text-gray-300">
            <h1 className="text-lg font-semibold text-gray-300">{title}</h1>
            <p className="text-sm text-gray-400">
                {description}: <span className="font-medium">{time}</span>
            </p>
        </div>
    </div>
);

export default RightSideBar;
