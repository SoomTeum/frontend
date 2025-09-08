
import { useState } from 'react';
import Header from '@/component/Header';
import Sidebar from '@/component/SideBar';
import SearchIcon from '@/image/Search.svg';
import { TRAVEL_ITEMS } from '@/constants/TravelSearch';
import PlaceCard from '@/component/common/Card/PlaceCard';

type TravelItem = {
  id: number;
  title: string;
  tranquil: boolean;
  type: string;
  likes: number;
  imgUrl?: string;
};

const TravelSearch = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [travelItems, setTravelItems] = useState<TravelItem[]>(
    () => TRAVEL_ITEMS.map((it) => ({ ...it }))
  );

  const handleMenuClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const handleRemoveItem = (id: number) =>
    setTravelItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <div className="bg-beige1 min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} position="left" />

      <div className="pt-14 px-4 pb-8">
        <div className="mx-[-1rem] mb-3 rounded-b-xl bg-green3-light pb-3 pt-2">
          <div className="text-center text-heading3 font-bold text-green1">여행지 탐색</div>
        </div>
        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-full bg-green0 px-4 py-2 pl-10 text-sm text-black placeholder:text-green-muted focus:outline-none"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-green-muted">
            <img src={SearchIcon} alt="search" className="h-4 w-4" />
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {travelItems.map((item) => (
            <PlaceCard
              key={item.id}
              title={item.title}
              theme={item.type}
              likeCount={item.likes}
              imgUrl={item.imgUrl}
              quietLevel={item.tranquil ? 5 : 3} // 백 연동 전 구현 확인 용
              showRemoveButton
              onRemove={() => handleRemoveItem(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelSearch;
