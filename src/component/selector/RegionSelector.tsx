import Selector from '@/component/selector/Selector';
import { regionMap } from '@/constants/RegionMap';

const RegionSelector = () => {
  return (
   <Selector
  dataMap={regionMap}
  initialMain="서울"
  colorScheme={{
    base: 'bg-orange-300',                        
    active: 'bg-orange-100 text-orange-800',       
    text: 'text-black',                            
    rightActive: 'bg-orange-300 text-black',        
  }}
  onSelect={(region, gu) => {
    console.log(region, gu);
  }}
/>
  );
};

export default RegionSelector;