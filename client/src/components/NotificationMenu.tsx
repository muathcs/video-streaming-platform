import { notification } from "@/TsTypes/types";
import React from "react";
import { ImNotification } from "react-icons/im";

const NotificationMenu = ({ notifications }: { notifications: any }) => {
  return (
    <div className="absolute right-0  mt-2 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
      <div className="px-1 py-1">
        {notifications?.length === 0 ? (
          <div className="text-black flex px-2 py-4">
            <ImNotification className="text-red-500 mr-2 relative top-1" />
            You don't have any notifications
          </div>
        ) : (
          notifications?.map((notification: notification) => (
            <div
              key={notification.notificationid}
              className="group flex w-full items-center rounded-md px-2 py-4 border border-gray-300 bg-gray-100 text-lg my-2 cursor-pointer hover:bg-red-500 hover:text-white"
            >
              <ImNotification className="text-green-500 mr-2 relative top-1" />
              {notification.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationMenu;
