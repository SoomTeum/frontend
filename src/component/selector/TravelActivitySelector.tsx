import SelectorMulti from './SelectorMulti';
import { activityMap } from '@/constants/ActivityMap';

const TravelActivitySelector = () => {
  return (

    <div className="h-[500px] w-full max-w-xs"> 
      <Selector
  dataMap={activityMap}
  initialMain="자연"
  colorScheme={{
    base: 'bg-rose-300',                        
    active: 'bg-rose-100 text-rose-800',         
    text: 'text-black',                        
    rightActive: 'bg-rose-300 text-black',    
  }}
  onSelect={(category, activity) => {
    console.log('선택된:', category, activity);
  }}
/>

    </div>
  );
};

export default TravelActivitySelector;
