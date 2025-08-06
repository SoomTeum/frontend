import { useState } from 'react';

const activityMap: Record<string, string[]> = {
  자연: ['휴양/문화지', '체험관광지', '산업관광지'],
  인문: ['건축/조형물', '문화시설'],
  예술: ['축제', '공연/행사'],
  쇼핑: [],
};

const TravelActivitySelector = () => {
  const [selectedCategory, setSelectedCategory] = useState('자연');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-xs h-[360px] rounded-xl overflow-hidden shadow-md bg-[#fff5f5]">
      {/* 왼쪽 카테고리 리스트 */}
      <div className="w-1/2 flex flex-col bg-rose-300 py-2">
        {Object.keys(activityMap).map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setSelectedActivity(null); // 카테고리 바꾸면 활동 초기화
            }}
            className={`py-2 px-2 text-center text-sm ${
              selectedCategory === category
                ? 'bg-rose-100 text-rose-800 font-bold rounded-md mx-1'
                : 'text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 오른쪽 활동 리스트 */}
      <div className="w-1/2 flex flex-col bg-white py-2">
        {activityMap[selectedCategory].length > 0 ? (
          activityMap[selectedCategory].map((activity) => (
            <button
              key={activity}
              onClick={() => setSelectedActivity(activity)}
              className={`py-2 px-2 text-center text-sm rounded-md mx-1 mb-1 ${
                selectedActivity === activity
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              {activity}
            </button>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-gray-400">
            해당 항목 없음
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelActivitySelector;
