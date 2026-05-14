interface MobileNoticeCardProps {
  title: string;
  body: string;
  ctaLabel: string;
  /** 채널 표시 이름 (좌상단). 기본 'SK렌터카'. */
  channelName?: string;
  /** 좌상단 채널 아이콘 라벨 (2글자). 기본 'SK'. */
  channelInitial?: string;
  /** 우측 시간 라벨 — 보내준 시각 표시. */
  time?: string;
  onTap?: () => void;
}

/**
 * 카카오 알림톡(비즈뿌리오) 푸시 카드 — 게스트의 개인 카카오톡에
 * 도착한 비즈니스 채널 초대장 형태로 표시.
 *
 * 헤더(채널명 + kakao 로고) → 본문(알림톡 도착 + 제목 + 본문) → CTA 노란 버튼.
 */
export function MobileNoticeCard({
  title,
  body,
  ctaLabel,
  channelName = 'SK렌터카',
  channelInitial = 'SK',
  time,
  onTap,
}: MobileNoticeCardProps) {
  return (
    <button
      onClick={onTap}
      className="block w-full overflow-hidden rounded-2xl bg-[#1F1F1F] text-left shadow-elev transition-transform hover:scale-[0.99] active:scale-[0.98]"
    >
      {/* 헤더 — 채널 이름 + kakao 로고 */}
      <div className="flex items-center justify-between bg-[#1F1F1F] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <div className="grid h-5 w-5 place-items-center rounded-md bg-[#FEE500] text-[10px] font-bold text-[#1F1F1F]">
            {channelInitial}
          </div>
          <span className="text-[11px] font-semibold text-white">
            {channelName}
          </span>
        </div>
        <span className="rounded-sm bg-[#FEE500] px-1.5 py-0.5 text-[9px] font-bold text-[#1F1F1F]">
          kakao
        </span>
      </div>

      {/* 본문 */}
      <div className="bg-[#2A2A2A] px-3 py-2.5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#FEE500]">
            알림톡 도착
          </span>
          {time && (
            <span className="text-[10px] text-white/50">{time}</span>
          )}
        </div>
        <div className="text-[12px] font-semibold text-white">{title}</div>
        <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-white/80">
          {body}
        </p>
      </div>

      {/* CTA */}
      <div className="border-t border-white/5 bg-[#2A2A2A] px-3 py-2">
        <div className="rounded-md bg-white/95 py-1.5 text-center text-[11px] font-semibold text-[#1F1F1F]">
          {ctaLabel}
        </div>
      </div>
    </button>
  );
}
