import { useState } from 'react';

const LeftSideBar = ({ userRole }) => {
    const [activeTab, setActiveTab] = useState("All");

    const isAdmin = userRole === "admin";
    const tabs = isAdmin ? ["All", "Email", "Orders", "Waiting", "Schedule"] : ["MyTasks", "Messages"];

    const notifications = isAdmin
        ? {
            All: [
                { id: 1, name: "John Doe", time: "10:00 AM", description: "Clock In" },
                { id: 2, name: "Jane Smith", time: "09:30 AM", description: "Clock Out" },
                { id: 3, name: "Michael Johnson", time: "11:00 AM", description: "Meeting" },
            ],
            Email: [
                { id: 1, name: "Sarah Williams", time: "08:15 AM", description: "New Email Received" },
                { id: 2, name: "David Brown", time: "08:45 AM", description: "Follow-up Required" },
            ],
            Orders: [
                { id: 1, name: "Michael Johnson", time: "11:00 AM", description: "Order #1234 placed" },
                { id: 2, name: "John Doe", time: "02:30 PM", description: "Order #5678 confirmed" },
            ],
            Waiting: [
                { id: 1, name: "Sarah Williams", time: "12:00 PM", description: "Waiting for confirmation" },
                { id: 2, name: "Jane Smith", time: "03:00 PM", description: "Pending approval" },
            ],
            Schedule: [
                { id: 1, date: "2024-10-30", time: "09:00 AM", description: "Team Meeting" },
                { id: 2, date: "2024-10-31", time: "01:00 PM", description: "Project Deadline" },
                { id: 3, date: "2024-11-01", time: "10:00 AM", description: "Client Call" },
            ],
        }
        : {
            MyTasks: [
                { id: 1, name: "Project A", time: "Due Today", description: "Complete Documentation" },
                { id: 2, name: "Task B", time: "Tomorrow", description: "Prepare Presentation" },
            ],
            Messages: [
                { id: 1, name: "Manager", time: "09:00 AM", description: "Please review the document." },
                { id: 2, name: "Team Lead", time: "11:30 AM", description: "Update the project status." },
            ],
        };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="w-[20%] min-h-screen border-r border-gray-400 p-4">
            <h1 className="text-2xl font-bold text-gray-300 mb-4">Notifications</h1>
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
                {activeTab === "Schedule" ? (
                    notifications.Schedule?.map((schedule) => (
                        <ScheduleCard
                            key={schedule.id}
                            date={schedule.date}
                            time={schedule.time}
                            description={schedule.description}
                        />
                    ))
                ) : (
                    (notifications[activeTab] || []).map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            name={notification.name}
                            time={notification.time}
                            description={notification.description}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const NotificationCard = ({ name, time, description }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20 transition duration-300 ease-in-out hover:bg-white/20 transform mt-4">
        <div>
            <img
                className="w-[48px] h-[48px] rounded-full border border-gray-300 shadow-sm"
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="User portrait"
            />
        </div>
        <div className="text-gray-300">
            <h1 className="text-lg font-semibold text-gray-300">{name}</h1>
            <p className="text-sm text-gray-400">
                {description}: <span className="font-medium">{time}</span>
            </p>
        </div>
    </div>
);

const ScheduleCard = ({ date, time, description }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20 transition duration-300 ease-in-out hover:bg-white/20 transform mt-4">
        <div className="text-gray-300">
            <h1 className="text-lg font-semibold text-gray-300">{description}</h1>
            <p className="text-sm text-gray-400">
                Date: <span className="font-medium">{date}</span> | Time: <span className="font-medium">{time}</span>
            </p>
        </div>
    </div>
);

export default LeftSideBar;
