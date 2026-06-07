import {Megaphone as CampaignIcon} from "lucide-react";
import { Pagination, PaginationItem } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useGlobalStore } from "../../shared/stores/global-store";
import type { Campaign } from "../model/campaign";

function relativeLabel(c: Campaign): {
  text: string;
  color: string;
  dotColor: string;
} {
  const now = dayjs();
  const start = c.startDate ? dayjs(c.startDate) : null;
  const end = c.endDate ? dayjs(c.endDate) : null;

  if (start && end && now.isAfter(start) && now.isBefore(end)) {
    return {
      text: "En curso",
      color: "text-[#10A065]",
      dotColor: "bg-[#10A065]",
    };
  }

  if (start && start.isAfter(now)) {
    const days = start.diff(now, "day");
    const weeks = start.diff(now, "week");
    const months = start.diff(now, "month");

    if (days === 0)
      return { text: "Hoy", color: "text-[#10A065]", dotColor: "bg-[#10A065]" };
    if (days === 1)
      return {
        text: "Mañana",
        color: "text-[#3A82B0]",
        dotColor: "bg-[#3A82B0]",
      };
    if (days <= 7)
      return {
        text: `En ${days} días`,
        color: "text-[#3A82B0]",
        dotColor: "bg-[#3A82B0]",
      };
    if (weeks === 1)
      return {
        text: "En 1 semana",
        color: "text-[#B17A2B]",
        dotColor: "bg-[#B17A2B]",
      };
    if (weeks <= 4)
      return {
        text: `En ${weeks} semanas`,
        color: "text-[#B17A2B]",
        dotColor: "bg-[#B17A2B]",
      };
    if (months === 1)
      return {
        text: "En 1 mes",
        color: "text-[#B17A2B]",
        dotColor: "bg-[#B17A2B]",
      };
    if (months < 12)
      return {
        text: `En ${months} meses`,
        color: "text-[#B17A2B]",
        dotColor: "bg-[#B17A2B]",
      };
    return {
      text: `En ${start.diff(now, "year")} años`,
      color: "text-[#B17A2B]",
      dotColor: "bg-[#B17A2B]",
    };
  }

  if (end && end.isBefore(now)) {
    return {
      text: "Finalizada",
      color: "text-[#7E8F82]",
      dotColor: "bg-[#7E8F82]",
    };
  }

  return { text: "—", color: "text-[#7E8F82]", dotColor: "bg-[#7E8F82]" };
}

export function NextCampaigns() {
  const { info } = useGlobalStore();
  const campaigns: Campaign[] = info?.nextCampaigns || [];
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(campaigns.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleCampaigns = campaigns.slice(startIndex, endIndex);

  return (
    <div className="rounded-[16px] bg-white shadow-md p-5 border border-[#E1E7DF] h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-[#C8F0DA] flex items-center justify-center text-[#10A065]">
          <CampaignIcon className="w-5 h-5" />
        </div>
        <h2 className="font-bold text-lg text-[#0E1A12] font-inter">
          Próximas campañas
        </h2>
      </div>

      <div className="flex flex-col gap-1">
        {campaigns.length === 0 ? (
          <span className="text-[#4F6354] text-sm italic font-inter py-8 text-center">
            No hay campañas próximas
          </span>
        ) : (
          visibleCampaigns.map((c) => {
            const label = relativeLabel(c);
            return (
              <div
                key={c.id}
                className="flex items-center gap-3 cursor-pointer transition-all duration-150 hover:bg-[#F4F8F2] rounded-[12px] px-3 py-2.5 group"
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${label.dotColor}`}
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[#0E1A12] text-sm font-semibold font-inter truncate">
                    {c.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-inter font-medium ${label.color}`}
                    >
                      {label.text}
                    </span>
                    <span className="text-[#7E8F82] text-xs font-inter">
                      {c.startDate && c.endDate
                        ? `${dayjs(c.startDate).format("DD/MM/YY")} - ${dayjs(c.endDate).format("DD/MM/YY")}`
                        : c.date
                          ? dayjs(c.date).format("LL")
                          : "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && campaigns.length > 0 && (
        <div className="flex justify-center mt-5 pt-4 border-t border-[#E1E7DF]">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            size="small"
            renderItem={(item) => (
              <PaginationItem
                className="font-inter text-[#4F6354] text-xs"
                {...item}
              />
            )}
          />
        </div>
      )}
    </div>
  );
}
