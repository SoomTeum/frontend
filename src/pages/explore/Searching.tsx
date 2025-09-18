import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/component";
import bubbleUrl from "@/image/Searching.svg";
import personUrl from "@/image/Searching2.svg";

export default function Searching() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate("/travelsearch");
    }, 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-[var(--color-green3)] flex flex-col items-center justify-center">
        <Loader className="w-[300px] h-[300px] mb-1" />   
  <img
    src={bubbleUrl}
    alt="당신의 취향에 맞는 여행지를 찾고 있습니다…"
    className="w-[80%] max-w-xs drop-shadow-sm select-none"
    draggable={false}/>
  <img
    src={personUrl}
    alt="검색 일러스트"
    className="w-[62%] max-w-[260px] mt-6 select-none"
    draggable={false}/>
    </div>
  );
}
