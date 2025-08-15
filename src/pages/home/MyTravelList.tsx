import { useState } from 'react';
import Header from '@/component/Header';
import Sidebar from '@/component/SideBar';
import { X, Heart } from 'react-feather';
import TagButton from '@/component/common/TagButton/TagButton';
import Button from '@/component/common/Button/Button';

type TravelItem = {
  id: number;
  title: string;
  tranquil: boolean;
  type: string;
  likes: number;
  imgUrl?: string;
};

const MyTravelList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [travelItems, setTravelItems] = useState<TravelItem[]>([
    { id: 1, title: '행궁동', tranquil: true, type: '자연관광지', likes: 3 },
    { id: 2, title: '행궁동', tranquil: true, type: '자연관광지', likes: 3 },
    { id: 3, title: '행궁동', tranquil: true, type: '자연관광지', likes: 3 },
    { id: 4, title: '행궁동', tranquil: true, type: '자연관광지', likes: 3 },
  ]);

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);
  const handleRemoveItem = (id: number) =>
    setTravelItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <div className="bg-beige1 min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} position="left" />

      <div className="pt-14 px-4 pb-8">
        <div className="mx-[-1rem] mb-3 rounded-b-xl bg-[#dfead1] pb-3 pt-2">
          <div className="text-center text-heading3 font-bold text-green1">나의 여행지</div>
        </div>

        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-full bg-[#edf0e2] px-4 py-2 pl-10 text-sm text-black placeholder:text-[#7f8c6b] focus:outline-none"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7f8c6b]">
            🔍
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {travelItems.map((item) => (
            <div
              key={item.id}
              className="relative flex items-center justify-between rounded-xl bg-[#fff3dd] p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[#e5e9db]">
               
                  <div className="h-6 w-8 rounded bg-gray-400" />
                </div>

                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-black">{item.title}</div>

                  <div className="mt-2 flex gap-3">
                    <TagButton selected color="green">
                      한적함
                    </TagButton>
                    <TagButton selected color="red">
                      {item.type}
                    </TagButton>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <button
                  aria-label="remove"
                  onClick={() => handleRemoveItem(item.id)}
                  className="rounded p-1 text-gray-500 hover:bg-black/5"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mt-4 flex items-center text-xs text-[#e57373]">
                  <Heart className="mr-1 h-4 w-4 fill-[#f28e8e] text-[#f28e8e]" />
                  {item.likes}
                </div>
              </div>
            </div>
          ))}
        </div>

       
      </div>
    </div>
  );
};

export default MyTravelList;
