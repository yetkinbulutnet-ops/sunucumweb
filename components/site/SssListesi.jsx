import { Icon } from './chrome';

export default function SssListesi({ sss }) {
  return (
    <div className="mt-5 space-y-3">
      {sss.map((s) => (
        <details key={s.q} className="group rounded-2xl border border-line bg-surface p-5 open:border-brandline">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16px] font-bold text-strong">
            {s.q}
            <Icon name="plus" className="mt-1 h-4 w-4 shrink-0 text-brandtext transition-transform group-open:rotate-45" />
          </summary>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-body">{s.a}</p>
        </details>
      ))}
    </div>
  );
}
