import { useState } from 'react';

const regionMap: Record<string, string[]> = {
  서울: ['강남구', '강북구', '강서구', '강동구', '관악구', '광진구', '구로구', '노원구', '도봉구'],
  경기: ['수원시', '성남시', '고양시'],
  인천: ['미추홀구', '부평구', '연수구'],
  세종: ['세종시'],
  강원: ['춘천시', '강릉시'],
  충북: ['청주시', '충주시'],
  충남: ['천안시', '아산시'],
  대전: ['서구', '유성구'],
  경북: ['포항시', '구미시'],
  전북: ['전주시', '익산시'],
};

const RegionSelector = () => {
  const [selectedRegion, setSelectedRegion] = useState('서울');
  const [selectedGu, setSelectedGu] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-xs rounded-xl overflow-hidden shadow-md bg-[#fff1d7]">
      {/* 왼쪽 지역 리스트 */}
      <div className="w-1/2 flex flex-col bg-orange-300">
        {Object.keys(regionMap).map((region) => (
          <button
            key={region}
            onClick={() => {
              setSelectedRegion(region);
              setSelectedGu(null); // 지역 바꾸면 구 선택 초기화
            }}
            className={`py-2 px-2 text-center text-sm ${
              selectedRegion === region
                ? 'bg-orange-100 text-orange-800 font-bold rounded-md mx-1'
                : 'text-white'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* 오른쪽 구 리스트 */}
      <div className="w-1/2 flex flex-col bg-white">
        {regionMap[selectedRegion].map((gu) => (
          <button
            key={gu}
            onClick={() => setSelectedGu(gu)}
            className={`py-2 px-2 text-center text-sm rounded-md mx-1 mb-1 ${
              selectedGu === gu
                ? 'bg-orange-300 text-white font-bold'
                : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            {gu}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegionSelector;
