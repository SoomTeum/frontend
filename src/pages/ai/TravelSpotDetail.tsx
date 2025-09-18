import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
import { getPlaceDetail, type IntegratedPlace } from '@/api/Detail/detail.api';
import { useEffect, useState } from 'react';
import { Badge, Image, Loader, ParkingTable } from '@/component';
import { likePlace, unlikePlace, getLikeStatus } from '@/api/like/like.api';

const TravelSpotDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contentId = '' } = useParams<{ contentId: string }>();
  const formatCount = (n: number, cap = 999) => (n > cap ? `${cap}+` : `${n}`);

  const [data, setData] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const isAuthed = !!localStorage.getItem('accessToken');

  const handleToggleLike = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!data) return;

    if (!isAuthed) {
      const here = `${location.pathname}${location.search}${location.hash}`;
      sessionStorage.setItem('postLoginRedirect', here);

      sessionStorage.setItem(
        'postLoginAction',
        JSON.stringify({
          kind: 'LIKE_PLACE',
          contentId,
          payload: {
            regionName: data.regionTag ?? '정보없음',
            themeName: data.themeName ?? '여행지',
            cnctrLevel: data.serenity ?? 0,
          },
        }),
      );

      navigate(
        `/login?redirect=${encodeURIComponent(here)}&action=like_place&cid=${encodeURIComponent(
          contentId,
        )}`,
        { replace: true },
      );
      return;
    }

    try {
      if (liked) {
        await unlikePlace(contentId);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        await likePlace({
          contentId,
          regionName: data.regionTag ?? '정보없음',
          themeName: data.themeName ?? '여행지',
          cnctrLevel: data.serenity ?? 0,
        });
        setLikeCount((c) => c + 1);
      }
      setLiked((prev) => !prev);
    } catch (err: any) {
      console.error('좋아요 처리 실패:', err?.message || err);
    }
  };

  const handleToggleBookmark = () => {
    setBookmarked((prev) => !prev);
  };

  function mapIntegratedToPlaceDetail(id: string, item: IntegratedPlace): PlaceDetail {
    const normalize = (u?: string | null) => {
      const s = (u ?? '').trim();
      if (!s) return '';
      return s.startsWith('http://') ? s.replace(/^http:\/\//, 'https://') : s;
    };
    const name = item.placeName ?? '';
    const thumbnail = normalize(item.placeImageUrl) || '';
    const address = item.placeAddress ?? '';
    const description = item.introduction ?? '';

    const regionTag = item.region ?? '정보없음';
    const themeName = item.themeName ?? '여행지';
    const serenity = item.tranquilityLevel ?? -1;

    const parkings =
      item.nearbyParkingLots?.map((p) => ({
        id: p.prkId,
        name: p.prkName,
        total: p.totalLots,
        available: p.availLots,
        distance: p.distance,
      })) ?? undefined;
    return {
      id,
      name,
      thumbnail,
      address,
      description,
      liked: false,
      likeCount: item.likeCount ?? 0,
      bookmarked: false,
      regionTag,
      themeName,
      serenity,
      extra: {
        aiSummary: item.aiTipSummary ?? undefined,
        parkings,
      },
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
        const item = await getPlaceDetail(contentId);
        if (!alive) return;

        if (!item) {
          setErrMsg('해당 여행지 정보를 찾을 수 없습니다.');
          setData(null);
        } else {
          const mapped = mapIntegratedToPlaceDetail(contentId, item);
          setData(mapped);
          //좋아요/북마크 초기값 세팅
          setLiked(mapped.liked);
          setLikeCount(mapped.likeCount);
          setBookmarked(mapped.bookmarked);

          if (isAuthed) {
            try {
              const { data: resp } = await getLikeStatus(contentId);
              if (alive && resp?.success && resp.data) {
                setLiked(!!resp.data.like);
              }
            } catch (e) {
              console.debug('좋아요 상태 조회 실패:', e);
            }
          }
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
        {loading ? (
          <div className="grid place-items-center py-40">
            <Loader className="h-40 w-40" />
          </div>
        ) : errMsg ? (
          <div className="text-caption3 p-6">{errMsg}</div>
        ) : !data ? (
          <div className="text-caption3 p-6">해당하는 id의 여행지가 존재하지 않습니다.</div>
        ) : (
          <>
            <div className="flex items-start">
              {/*썸네일*/}
              <div className="rounded-m bg-gray1 flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden">
                {data.thumbnail ? (
                  <Image
                    src={data.thumbnail}
                    alt={data.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon />
                )}
              </div>
              {/*이름, 주소*/}
              <div className="mt-2 flex flex-1 flex-col justify-between px-3">
                <div className="min-w-0">
                  <div className="text-caption3 line-clamp-2 break-keep">{data.name}</div>
                  <div className="text-body3 mt-6 line-clamp-2 break-keep">{data.address}</div>
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
                {data.themeName}
              </Badge>
              {data.serenity === -1 ? (
                <Badge type="default" color="green">
                  정보없음
                </Badge>
              ) : (
                <Badge type="default" color="green" count={data.serenity}>
                  한적함
                </Badge>
              )}
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
          </>
        )}
      </div>
    </div>
  );
};

export default TravelSpotDetail;
