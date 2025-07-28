import { Button } from "@/component";

const ButtonTestPage=()=>{
  const handleClick=()=>{
    alert('버튼 클릭됨');
  }
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
    </div>
  )
}
export default ButtonTestPage