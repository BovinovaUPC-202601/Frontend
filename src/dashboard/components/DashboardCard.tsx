import type { ReactNode } from "react";

interface ItemData {
    label: string;
    detail?: ReactNode;
    progress?: { current: number; max: number };
}

interface DashboardCardProps {
    title: string;
    icon: ReactNode;
    content: string;
    discClass: string;
    iconClass: string;
    items: ItemData[];
}

function ItemProgress({ current, max }: { current: number; max: number }) {
    const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
    const barColor = pct >= 100 ? "bg-[#D04A3A]" : pct >= 80 ? "bg-[#B17A2B]" : "bg-[#10A065]";

    return (
        <div className="flex items-center gap-2 shrink-0">
            <div className="w-16 h-1.5 rounded-full bg-[#E1E7DF]">
                <div className={`h-1.5 rounded-full ${barColor} transition-all duration-300`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[#7E8F82] text-[10px] font-inter font-medium whitespace-nowrap">{current}/{max}</span>
        </div>
    );
}

export function DashboardCard(props: DashboardCardProps) {
    return (
        <div className="flex gap-4 rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-4 cursor-pointer transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]">
            <div className="flex flex-col items-center gap-1 shrink-0 w-[72px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${props.discClass}`}>
                    <div className={props.iconClass}>
                        {props.icon}
                    </div>
                </div>
                <span className="text-[#0E1A12] text-xl font-bold font-inter leading-none mt-1">{props.content}</span>
                <span className="text-[#4F6354] text-[11px] font-inter text-center leading-tight">{props.title}</span>
            </div>

            <div className="flex-1 min-w-0 border-l border-[#E1E7DF] pl-4 flex flex-col justify-center gap-0.5">
                {props.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 py-0.5">
                        <span className="text-[#0E1A12] text-sm font-inter truncate">{item.label}</span>
                        {item.progress ? <ItemProgress current={item.progress.current} max={item.progress.max} /> : (
                            <span className="text-[#7E8F82] text-[11px] font-inter shrink-0">{item.detail}</span>
                        )}
                    </div>
                ))}
                {props.items.length === 0 && (
                    <span className="text-[#7E8F82] text-xs font-inter italic">Sin datos</span>
                )}
            </div>
        </div>
    )
}
