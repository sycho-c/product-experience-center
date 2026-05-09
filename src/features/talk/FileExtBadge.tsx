import { cn } from '@/lib/utils';

const EXT_COLOR: Record<string, string> = {
  PDF: 'bg-rose-500',
  XLS: 'bg-emerald-600',
  XLSX: 'bg-emerald-600',
  CSV: 'bg-emerald-600',
  DOC: 'bg-blue-600',
  DOCX: 'bg-blue-600',
  PPT: 'bg-orange-500',
  PPTX: 'bg-orange-500',
  HWP: 'bg-sky-600',
  ZIP: 'bg-violet-600',
  '7Z': 'bg-violet-600',
  RAR: 'bg-violet-600',
  TXT: 'bg-slate-500',
};

export function getFileExt(name: string): string {
  const m = name.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toUpperCase() : 'FILE';
}

interface FileExtBadgeProps {
  name: string;
  size?: 'sm' | 'md';
  className?: string;
}

/** 파일 확장자(예: PDF/XLSX/DOC) 라벨 — 색상 매핑된 사각형 배지. */
export function FileExtBadge({ name, size = 'md', className }: FileExtBadgeProps) {
  const ext = getFileExt(name);
  const color = EXT_COLOR[ext] ?? 'bg-slate-500';
  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center rounded font-bold leading-none text-white',
        size === 'sm' ? 'h-7 w-8 text-[9px]' : 'h-9 w-10 text-[10px]',
        color,
        className
      )}
    >
      {ext}
    </div>
  );
}
