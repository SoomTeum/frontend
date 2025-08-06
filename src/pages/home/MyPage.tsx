import { useState } from 'react';
import Header from '@/component/Header';
import Sidebar from '@/component/SideBar';
import { User } from 'react-feather';

const MyPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const handleMenuClick = () => {
    setIsSidebarOpen(true); 
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false); 
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} position="left" /> {/* ✅ position="left" 전달 */}

      {/* 사용자 정보 */}
      <div className="bg-green-100 text-center py-4 px-4 text-green-900 text-sm mt-[3.5rem]">
        <p className="font-semibold">안녕하세요 여행자님!</p>
        <p className="text-green-900">breathtrip@naver.com</p>
        <button className="mt-2 px-3 py-1 text-xs bg-yellow-100 text-green-800 rounded border border-yellow-200">
          로그아웃
        </button>
      </div>

      {/* 개인정보 입력 */}
      <div className="flex flex-col px-6 mt-8 gap-6 text-gray-700">
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-semibold">이메일</label>
          <input
            id="email"
            type="email"
            value="breathtrip@naver.com"
            readOnly
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm"
          />
        </div>

        <div>
          <label htmlFor="nickname" className="block mb-1 text-sm font-semibold">닉네임</label>
          <input
            id="nickname"
            type="text"
            defaultValue="여행자"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm"
          />
        </div>

        <button className="text-red-600 text-sm self-start mt-2">회원 탈퇴</button>
      </div>

      {/* 플로팅 유저 아이콘 */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg p-2">
        <User className="text-blue-600" size={28} />
      </div>
    </div>
  );
};

export default MyPage;
