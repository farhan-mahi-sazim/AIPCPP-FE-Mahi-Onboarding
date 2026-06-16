import React from "react";

const UserCard: React.FC = () => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
    <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-semibold text-sm">
      U
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-900">User</span>
      <span className="text-xs text-gray-500">user@example.com</span>
    </div>
  </div>
);

export default UserCard;
