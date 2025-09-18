// 코드→라벨 매핑
export const CAT1_LABEL: Record<string, string> = {
  A01: "자연관광지",
  A02: "문화시설",
  A03: "축제/공연/행사",
  A04: "여행코스",
  A05: "레포츠",
  B02: "숙박",
  A08: "쇼핑",
  A07: "음식",
};

export const CAT2_LABEL: Record<string, string> = {
  A0101: "자연관광지",
  A0102: "관광자원",
  A0201: "역사관광지",
  A0202: "문화시설",
  A0203: "전시/미술관",
  A0204: "공연장",
  A0301: "축제",
  A0302: "공연/행사",
  A0401: "가족코스",
  A0402: "나홀로코스",
  A0403: "힐링코스",
  A0404: "도보코스",
  A0405: "캠핑코스",
  A0502: "스포츠",
  A0503: "수상레저",
  A0505: "자전거",
  A0507: "등산",
  B0201: "호텔",
  B0202: "콘도/리조트",
  B0203: "펜션",
  B0204: "민박",
  B0205: "게스트하우스",
  A0801: "쇼핑",
  A0701: "한식",
  A0702: "서양식",
  A0703: "일식",
  A0704: "중식",
  A0705: "아시아식",
  A0706: "카페/디저트",
};

// 원본 raw에서 라벨 추출
export function displayThemeLabel(raw: any): string {
  const c2 = (raw?.cat2 ?? raw?.CAT2 ?? "").toString().trim();
  if (c2 && CAT2_LABEL[c2]) return CAT2_LABEL[c2];

  const c1 = (raw?.cat1 ?? raw?.CAT1 ?? "").toString().trim();
  if (c1 && CAT1_LABEL[c1]) return CAT1_LABEL[c1];

  if (raw?.cat2Name) return String(raw.cat2Name);
  if (raw?.cat1Name) return String(raw.cat1Name);
  if (raw?.themeName) return String(raw.themeName);

  return "기타";
}
