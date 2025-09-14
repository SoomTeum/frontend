import { useState } from 'react';
import Header from '@/component/Header';
import Sidebar from '@/component/SideBar';
import SearchIcon from '@/image/Search.svg';
import { TRAVEL_ITEMS } from '@/constants/MyTravel';
import PlaceCard from '@/component/common/Card/PlaceCard';

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
  const [travelItems, setTravelItems] = useState<TravelItem[]>(() =>
    TRAVEL_ITEMS.map((it) => ({ ...it })),
  );

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const handleRemoveItem = (id: number) =>
    setTravelItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <div className="min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} position="left" />
      <div className="mx-auto flex w-full max-w-[480px] flex-col pt-14">
        <div className="bg-green3-light text-caption3 text-green1 h-10 w-full items-center py-[10px] text-center">
          나의 여행지
        </div>
        <div className="px-8 pt-4 pb-8">
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray2 text-green1 placeholder:text-green1 text-caption3 w-full rounded-full px-4 py-2 pl-10 focus:outline"
            />
            <span className="text-green1 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
              <img src={SearchIcon} alt="search" className="h-4 w-4" />
            </span>
          </div>

          <div className="flex grid shrink-0 flex-col gap-4">
            {travelItems.map((item) => (
              <PlaceCard
                key={item.id}
                title={item.title}
                theme={item.type}
                likeCount={item.likes}
                imgUrl={item.imgUrl}
                quietLevel={item.tranquil ? 5 : 3} //백 연동 전 구현 확인 용
                showRemoveButton
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyTravelList;
