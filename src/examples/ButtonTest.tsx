import { Button, TagButton } from "@/component";
import Badge from "@/component/common/Badge/Badge";
import { useState } from "react";

const options=[
  {label:'추천해요', color:'green' as const},
  {label:'별로예요', color:'red' as const},
];

const ButtonTestPage=()=>{
  const handleClick=()=>{
    alert('버튼 클릭됨');
  }

  const [selected, setSelected]=useState<string|null>(null);

  return(
    <div className="flex flex-col min-h-screen bg-beige3 gap-4 p-4">
      <h1 className="text-caption1">버튼 테스트</h1>

      {/*기본 큰 버튼*/}
      <Button onClick={handleClick}>기본버튼</Button>

      {/*중간 버튼 (green-muted)*/}
      <Button color="green-muted" variant="md">버튼1</Button>

      {/*중간 버튼 (green3)*/}
      <Button color="green3" variant="md">버튼2</Button>

      {/*비활성화된 버튼*/}
      <Button disabled>비활성화된 버튼</Button>

      {/*바로가기 버튼*/}
      <Button variant="sm">바로가기</Button>

      {/*이외에도 className props으로 조정 가능...*/}

      <h1 className="text-caption1">태그 버튼 테스트</h1>
      <div className="flex gap-2">
      {options.map(({ label, color }) => (
        <TagButton
          key={label}
          color={color}
          selected={selected === label}
          onClick={() => setSelected(label)}
        >
          {label}
        </TagButton>
      ))}
      </div>
      <h1 className="text-caption1">뱃지 테스트</h1>
      <Badge type="default" color="green" size="lg">추천해요</Badge>
      <Badge type="default" color="red">자연관광지</Badge>
      <Badge type="default" color="green" count={2}>한적함</Badge>
      <Badge type="parkingCount" percent={30}>100</Badge>
      <Badge type="parkingTag" size="xl">뭐시기뭐시기주차장</Badge>
    </div>
  )
}
export default ButtonTestPage