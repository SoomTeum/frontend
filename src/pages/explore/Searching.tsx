import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import bubbleUrl from "@/image/Searching.svg";
import personUrl from "@/image/Searching2.svg"; // ✅ 파일명 확인

export default function Searching() {
  const navigate = useNavigate();

  // ✅ 3초 후 자동 이동
  useEffect(() => {
    const t = setTimeout(() => {
      navigate("/explore/travelsearch");
    }, 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-[var(--color-green3)] flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center">
        <Spinner className="-mb-2 mt-2" />

        {/* 말풍선 */}
        <img
          src={bubbleUrl}
          alt="당신의 취향에 맞는 여행지를 찾고 있습니다…"
          className="w-[80%] max-w-xs mt-3 drop-shadow-sm select-none"
          draggable={false}
          onError={() => console.warn("Searching.svg 로딩 실패")}
        />
      </div>

      {/* 사람 일러스트 */}
      <img
        src={personUrl}
        alt="검색 일러스트"
        className="w-[62%] max-w-[260px] mt-6 select-none"
        draggable={false}
        onError={() => console.warn("Searching2.svg 로딩 실패")}
      />
    </div>
  );
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-8 w-8 ${className}`}>
      {/* 회전 링 */}
      <div className="h-full w-full rounded-full border-4 border-white/40 border-t-white animate-spin" />
    </div>
  );
}
