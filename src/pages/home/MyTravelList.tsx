import Header from '@/component/Header';
import { X, Heart } from 'react-feather';
import Button from '@/component/common/Button/Button';

const MyTravelList = () => {
  const travelItems = [
    { id: 1, title: '행궁동', tranquil: true, type: '자연관광지', likes: 3 },
    { id: 2, title: '행궁동', tranquil: true, type: '자연관광지', likes: 3 },
    { id: 3, title: '행궁동', tranquil: true, type: '자연관광지', likes: 3 },
    { id: 4, title: '행궁동', tranquil: true, type: '자연관광지', likes: 3 },
  ];

  // 👇 여기! 타입 명시
  const handleMenuClick: () => void = () => {
    console.log('메뉴 버튼 클릭됨 (Sidebar 열기 등)');
  };

  return (
    <div className="bg-beige1 min-h-screen">
      <Header onMenuClick={handleMenuClick} />

      <div className="px-4 pt-2 pb-8">
        <div className="text-center text-heading3 py-2 font-bold text-green1">
          나의 여행지
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-xl bg-[#edf0e2] px-4 py-2 pl-10 text-sm focus:outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-900">
            🔍
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {travelItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-[#fff1d7] p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-md bg-gray-300" />
                <div className="flex flex-col">
                  <div className="font-semibold text-sm text-black">
                    {item.title}
                  </div>
                  <div className="mt-1 flex gap-1">
                    <Button variant="sm" color="green-muted">
                      한적한
                    </Button>
                    <Button variant="sm" color="green3">
                      {item.type}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <X className="w-4 h-4 text-gray-500 cursor-pointer" />
                <div className="flex items-center text-xs text-red-400">
                  <Heart className="w-4 h-4 mr-1 fill-red-300 text-red-300" />
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
