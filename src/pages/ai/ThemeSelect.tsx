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
    '이렇게',
    '늘어나면',
    '어떻게',
    '되는지',
  ],
  인문: [],
  스포츠: [],
  쇼핑: [],
};

const ThemeSelcetPage = () => {
  return (
    <div className="px-10">
      <div className="px-4 pt-3">
        <h2 className="text-title3 text-green1 py-2 text-center">테마</h2>
      </div>
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
