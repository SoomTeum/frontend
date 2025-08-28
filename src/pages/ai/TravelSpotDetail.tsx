import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  EnergyIcon,
  ImageIcon,
  StarFill,
  StarLine,
  HeartFill,
  HeartOutline,
} from '@/assets';
import type { PlaceDetail } from '@/types/Detail';
import { getKorDetail, type KorDetailItem } from '@/api/Detail/detail.api';
import { useEffect, useState } from 'react';
import { Badge, Image, ParkingTable } from '@/component';

const TravelSpotDetail = () => {
  const navigate = useNavigate();
  const { contentId = '' } = useParams<{ contentId: string }>();
  const formatCount = (n: number, cap = 999) => (n > cap ? `${cap}+` : `${n}`);

  const [data, setData] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const handleToggleLike = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));
    setLiked((prev) => !prev);
  };
  const handleToggleBookmark = () => {
    setBookmarked((prev) => !prev);
  };

  function mapKorToPlaceDetail(id: string, item: KorDetailItem): PlaceDetail {
    const name = item.title ?? '';
    const thumbnail = item.firstimage2 ?? item.firstimage2 ?? '';
    const address = item.addr1 ?? '';
    const description = item.overview ?? '';

    const regionTag = '정보없음';
    return {
      id,
      name,
      thumbnail,
      address,
      description,
      //투두: 서버에 좋아요/북마크 API 붙이면 여기를 갱신
      liked: false,
      likeCount: 0,
      bookmarked: false,
      //투두: 태그/지표는 추후 실제 데이터로 교체
      regionTag,
      themeTag: '여행지',
      serenity: 0,
      extra: {},
    };
  }
  useEffect(() => {
    if (!contentId) {
      setErrMsg('contentId가 없습니다.');
      setLoading(false);
      return;
    }
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErrMsg(null);
        const item = await getKorDetail(contentId);
        if (!alive) return;

        if (!item) {
          setErrMsg('해당 여행지 정보를 찾을 수 없습니다.');
          setData(null);
        } else {
          const mapped = mapKorToPlaceDetail(contentId, item);
          setData(mapped);
          //좋아요/북마크 초기값 세팅
          setLiked(mapped.liked);
          setLikeCount(mapped.likeCount);
          setBookmarked(mapped.bookmarked);
        }
      } catch (e: any) {
        setErrMsg(e?.message || '여행지 정보를 불러오지 못했습니다.');
        setData(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [contentId]);

  if (!data) {
    return <div className="text-caption3">해당하는 id의 여행지가 존재하지 않습니다.</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="bg-green3-light relative sticky top-0 z-50 h-10 w-full shadow-sm">
        <button onClick={() => navigate(-1)} className="absolute top-1/2 -translate-y-1/2 pl-4">
          <ArrowLeft className="w-4" />
        </button>
        <span className="text-caption3 text-green1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          여행지 상세조회
        </span>
      </div>

      <div className="px-9 py-5">
        <div className="flex items-start">
          {/*썸네일*/}
          <div className="rounded-m bg-gray1 flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden">
            {data.thumbnail ? (
              <Image src={data.thumbnail} alt={data.name} className="h-full w-full object-cover" />
            ) : (
              <ImageIcon />
            )}
          </div>
          {/*이름, 주소*/}
          <div className="mt-2 flex flex-1 flex-col justify-between px-3">
            <div className="min-w-0">
              <div className="text-caption3 line-clamp-2 break-words">{data.name}</div>
              <div className="text-body3 mt-6 line-clamp-2">{data.address}</div>
            </div>

            {/*좋아요, 저장*/}
            <div className="mt-8 flex items-center gap-1">
              <button onClick={handleToggleLike} className="transition-transform">
                {liked ? <HeartFill /> : <HeartOutline />}
              </button>
              <span
                className="text-caption4 ml-0.5 w-[4ch] leading-none whitespace-nowrap tabular-nums"
                aria-label={`좋아요 ${likeCount}개`}
              >
                {formatCount(likeCount)}
              </span>

              <button onClick={handleToggleBookmark} className="ml-5 transition-transform">
                {bookmarked ? <StarFill /> : <StarLine />}
              </button>
            </div>
          </div>
        </div>
        {/*태그 뱃지 영역*/}
        <div className="mt-3 flex gap-3">
          <Badge color="orange" type="default">
            {data.regionTag}
          </Badge>
          <Badge color="red" type="default">
            {data.themeTag}
          </Badge>
          <Badge type="default" color="green" count={data.serenity}>
            한적함
          </Badge>
        </div>
        {/*소개...*/}
        <div className="mt-5 px-1">
          <div className="text-title4">소개</div>
          <div className="text-body3 mt-2 pr-2">{data.description}</div>
        </div>

        {/*강릉시 한정 정보*/}
        {/*AI 꿀팁 요약*/}
        {data.extra?.aiSummary && (
          <div className="mt-9 px-1">
            <div className="flex items-center">
              <span className="text-title4 mr-1">AI 꿀팁 요약</span>
              <EnergyIcon />
            </div>
            <div className="text-body3 mt-2 pr-2">{data.extra.aiSummary}</div>
          </div>
        )}
        {/*주차장 정보*/}
        {data.extra?.parkings && (
          <ParkingTable parkings={data.extra.parkings} className="mt-9 px-1" />
        )}
      </div>
    </div>
  );
};

export default TravelSpotDetail;
