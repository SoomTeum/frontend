import SelectorMulti from '@/component/selector/SelectorMulti';
const DATA = {
  자연: [
    '역사관광지',
    '휴양관광지',
    '체험관광지',
    '산업관광지',
    '건축/조형물',
    '문화시설',
    '축제',
    '공연/행사',
  ],
  인문: [],
  스포츠: [],
  쇼핑: [],
};

const ThemeSelcetPage = () => {
  return (
    <div>
      테마선택페이지
      <SelectorMulti
        dataMap={DATA}
        initialMain="자연"
        colorScheme={{
          leftBase: 'bg-green3-light text-caption4',
          leftItem: 'text-black text-caption4',
          leftActive: 'bg-green0',
          rightItem: 'text-green1',
          rightActive: 'border border-green3',
        }}
        onSelect={(main, subs) => console.log(main, subs)}
      />
    </div>
  );
};

export default ThemeSelcetPage;
