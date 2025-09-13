import Selector from "./Selector";
import { regionMap } from "@/constants/RegionMap";
import { cn } from "@/utils/cn";

type Props = {
  className?: string;
  onChange?: (main: string, subs: string[]) => void; 
};

export default function TravelActivitySelector({ className, onChange }: Props) {
  return (
    <div className={cn("w-full", className)}>
      <Selector
        dataMap={regionMap}
        initialMain="서울"
        colorScheme={{
          leftBase: "bg-orange text-black text-caption4",
          leftItem: "text-black text-caption4",
          leftActive: "bg-white text-black text-caption4",
          rightItem: "text-black text-caption4 hover:bg-gray1",
          rightActive: "bg-orange text-black text-caption4",
          borderColor: "[border-top-color:var(--color-orange)]",
        }}
        onSelect={(main, subs) => {
          console.log("선택된:", main, subs); 
          onChange?.(main, subs);
        }}
      />
    </div>
  );
}
