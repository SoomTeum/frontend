import type { PlaceDetail } from '@/types/Detail';

export const mockPlaceDetails: PlaceDetail[] = [
  {
    id: '1001',
    name: '경포해수욕장',
    address: '강원특별자치도 강릉시 창해로 514 (안현동)',
    thumbnail: null,
    regionTag: '강릉시',
    themeTag: '자연관광지',
    serenity: 2,
    description:
      '동해안 최대 해변으로 유명하며 강문동, 안현동에 있고 시내에서 북으로 6km, 경포대에서 1km 되는 곳에 동해의 창파를 가득 담고 펼쳐진 명사오리이다. 모두를 삼키기라도 하려는 듯 어쩌고저ㅓㅈ고',
    liked: false,
    likeCount: 0,
    bookmarked: false,
    extra: {
      aiSummary:
        '주차는 오전 9시 이전에 상가 뒤편 주차장을 이용하면 좋고, 해변은 가족이나 초보자에게 적합하며 샤워실과 탈의실 같은 편의시설이 잘 갖춰져 있습니다. 대중교통은 다소 불편하므로 택시나 랜트카를 이용하는 것이 효율적입니다.',
      parkings: [
        {
          name: '강문제1공영주차장근데이렇게길어지면어떻게잘리는지확인',
          total: 170,
          available: 170,
        },
        {
          name: '강문제2공영주차장',
          total: 91,
          available: 11,
        },
      ],
    },
  },
  {
    id: '1002',
    name: '안목해변 커피거리',
    address: '강원특별자치도 강릉시 창해로 17',
    thumbnail: null,
    regionTag: '강릉시',
    themeTag: '체험관광지',
    serenity: 1,
    description: '카페가 즐비한 바다 앞 산책 코스. 일출 명소로 유명하며 주말에는 비교적 붐빕니다.',
    liked: false,
    likeCount: 12,
    bookmarked: true,
    extra: {
      aiSummary: '밤에 커피를 먹으ㅕㅁㄴ 잠이 안 올 수도 있습니다 어쩌고저ㅉ고',
      parkings: [
        {
          name: '안목해변 공영주차장',
          total: 120,
          available: 60,
        },
      ],
    },
  },
  {
    id: '1003',
    name: '하회마을',
    address: '경상북도 안동시 풍천면 전서로 186',
    thumbnail: null,
    regionTag: '안동시',
    themeTag: '역사관광지',
    serenity: 3,
    description:
      '경상북도 안동시 풍천면 하회리에 위치한 민속마을. 2010년 8월 유네스코 세계문화유산으로 지정된 명소이며 별칭으로 하회민속마을, 안동 하회마을,하회민속촌 등으로도 불린다. 하회(河回)라는 이름 그대로 강물이 마을을 감싸고 흐르고 있다. 도산서원과 함께 안동의 대표적인 랜드마크.',
    liked: true,
    likeCount: 87,
    bookmarked: false,
  },
  {
    id: '1004',
    name: '가천대학교',
    address: '경기도 성남시 수정구 성남대로 1342',
    thumbnail: null,
    regionTag: '성남시',
    themeTag: '문화시설',
    serenity: 2,
    description:
      '경기도 성남시 수정구(글로벌 캠퍼스)와 인천광역시 연수구(메디컬 캠퍼스)에 위치한 4년제 사립 종합대학교이다.',
    liked: false,
    likeCount: 5,
    bookmarked: false,
  },
];
