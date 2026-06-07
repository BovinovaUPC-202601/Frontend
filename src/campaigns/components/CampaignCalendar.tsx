import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

import { useCampaignsStore } from '../stores/campaigns-store';
import { useGlobalStore } from '../../shared/stores/global-store';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const TZ = 'America/Lima';

function dayInTz(d: Date | string | undefined | null): dayjs.Dayjs {
    return dayjs.utc(d).tz(TZ);
}

export function CampaignCalendar() {
    const { calendarDate, setCalendarDate } = useCampaignsStore();
    const { campaigns } = useGlobalStore();

    const startOfMonth = dayInTz(calendarDate).startOf('month');
    const endOfMonth = dayInTz(calendarDate).endOf('month');
    const daysInMonth = endOfMonth.date();
    const startDayOfWeek = startOfMonth.day();

    const monthLabel = startOfMonth.format('MMMM YYYY');

    const prevMonth = () => setCalendarDate(startOfMonth.subtract(1, 'month').toDate());
    const nextMonth = () => setCalendarDate(startOfMonth.add(1, 'month').toDate());

    const dayLabels = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

    const getCampaignsForDay = (day: number) => {
        const date = startOfMonth.date(day).startOf('day');
        return campaigns.filter((c: any) => {
            const start = dayInTz(c.startDate).startOf('day');
            const end = dayInTz(c.endDate).startOf('day');
            return (date.isSame(start) || date.isAfter(start)) && (date.isSame(end) || date.isBefore(end));
        });
    };

    if (campaigns.length === 0) {
        return (
            <div className="bg-white rounded-[16px] shadow-md border border-[#E1E7DF] p-12 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-[#F4F8F2] flex items-center justify-center text-[#7E8F82]">
                    <CalendarMonthIcon className="w-7 h-7" />
                </div>
                <p className="text-[#0E1A12] text-base font-inter font-medium">No hay campañas para mostrar</p>
                <p className="text-[#7E8F82] text-sm font-inter">Agrega una campaña para verla en el calendario</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[16px] shadow-md border border-[#E1E7DF] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E1E7DF]">
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-1.5 rounded-[8px] text-[#4F6354] hover:bg-[#F4F8F2] transition-all duration-150 cursor-pointer"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <h3 className="text-base font-bold text-[#0E1A12] font-inter capitalize">{monthLabel}</h3>
                    <button
                        onClick={nextMonth}
                        className="p-1.5 rounded-[8px] text-[#4F6354] hover:bg-[#F4F8F2] transition-all duration-150 cursor-pointer"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7">
                {dayLabels.map((label) => (
                    <div
                        key={label}
                        className="text-center text-xs font-semibold text-[#7E8F82] font-inter py-2.5 border-b border-[#E1E7DF] bg-[#F4F8F2]/60"
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-[#E1E7DF]/50 bg-[#F4F8F2]/30" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const campaignsForDay = getCampaignsForDay(day);
                    const isToday = startOfMonth.date(day).startOf('day').isSame(dayInTz(new Date()).startOf('day'));

                    return (
                        <div
                            key={day}
                            className={`min-h-[100px] border-b border-r border-[#E1E7DF]/50 p-1.5 flex flex-col gap-1 transition-colors duration-150 hover:bg-[#F4F8F2]/50 ${isToday ? 'bg-[#C8F0DA]/20' : ''}`}
                        >
                            <span
                                className={`text-xs font-semibold font-inter w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-[#10A065] text-white' : 'text-[#4F6354]'}`}
                            >
                                {day}
                            </span>
                            <div className="flex flex-col gap-0.5">
                                {campaignsForDay.slice(0, 3).map((c) => (
                                    <div
                                        key={c.id}
                                        className="text-[10px] leading-tight font-medium text-white font-inter px-1.5 py-0.5 rounded-[4px] truncate"
                                        style={{
                                            backgroundColor: (c as any).isActive ? '#10A065' : dayjs(c.startDate).isAfter(dayjs()) ? '#3A82B0' : '#7E8F82'
                                        }}
                                        title={c.name}
                                    >
                                        {c.name}
                                    </div>
                                ))}
                                {campaignsForDay.length > 3 && (
                                    <span className="text-[10px] text-[#7E8F82] font-inter font-medium px-1">+{campaignsForDay.length - 3} más</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
