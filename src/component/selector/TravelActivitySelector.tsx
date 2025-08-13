import SelectorMulti from './SelectorMulti';
import { activityMap } from '@/constants/ActivityMap';

const TravelActivitySelector = () => {
  return (
    <div className="min-h-screen px-5 pt-3">
      <SelectorMulti
        dataMap={activityMap}
        initialMain="자연"
        colorScheme={{
          leftBase: 'bg-red2 text-black text-caption4',
          leftItem: 'text-black text-caption4',
          leftActive: 'bg-pink text-black text-caption4',
          rightItem: 'text-black',
          rightActive: 'bg-red2 text-black text-caption4',
          borderColor: 'border-red2',
        }}
        onSelect={(main, subs) => {
          console.log('선택된:', main, subs);
        }}
      />
    </div>
  );
};

export default TravelActivitySelector;
