import type React from 'react';

export const TailwindDemo: React.FC = () => {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 my-4">
      <div className="flex-shrink-0">
        <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xl">T</span>
        </div>
      </div>
      <div>
        <div className="text-xl font-medium text-black">Tailwind và Ant Design</div>
        <p className="text-gray-500">Hoạt động cùng nhau!</p>
      </div>
    </div>
  );
};
