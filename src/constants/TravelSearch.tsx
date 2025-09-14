// src/constants/TravelSearch.ts
export const TRAVEL_ITEMS = [
  {
    id: 1,
    title: "경복궁",
    tranquil: false,
    type: "자연",     // UI 용
    likes: 12,
    // API용
    contentId: "10001",
    regionName: "서울특별시",   // ✅ 정식 지역명
    themeName: "자연",          // ✅ 스웨거: themeName
    cnctrLevel: 3,              // ✅ 숫자
  },
  {
    id: 2,
    title: "해운대 해수욕장",
    tranquil: false,
    type: "자연",
    likes: 30,
    contentId: "10002",
    regionName: "부산광역시",   // ✅
    themeName: "자연",
    cnctrLevel: 3,
  },
  {
    id: 3,
    title: "설악산",
    tranquil: true,
    type: "자연",
    likes: 25,
    contentId: "10003",
    regionName: "강원도",       // ✅
    themeName: "자연",
    cnctrLevel: 5,
  },
  {
    id: 4,
    title: "한라산",
    tranquil: true,
    type: "자연",
    likes: 40,
    contentId: "10004",
    regionName: "제주특별자치도", // ✅
    themeName: "자연",
    cnctrLevel: 5,
  },
];
