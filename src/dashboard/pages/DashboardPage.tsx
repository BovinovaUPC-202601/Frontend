import { useEffect, useMemo } from "react";
import { useGlobalStore } from "../../shared/stores/global-store";
import { DashboardCards } from "../components/DashboardCards";
import { NextCampaigns } from "../components/NextCampaigns";

export function DashboardPage() {
    const {
        info,
        animals,
        stables,
        campaigns,
        staff,
        products,
        fetchInfo,
        fetchAnimals,
        fetchStables,
        fetchCampaigns,
        fetchStaff,
        fetchCategories,
        fetchProducts
    } = useGlobalStore();

    useEffect(() => {
        fetchInfo();
        fetchAnimals();
        fetchStables();
        fetchCampaigns();
        fetchStaff();
        fetchCategories();
        fetchProducts();
    }, []);

    const activeCampaigns = useMemo(() =>
        campaigns.filter(c => c.isActive).length, [campaigns]
    );

    const maleCount = useMemo(() =>
        animals.filter(a => (a.gender?.toLowerCase() === "male")).length, [animals]
    );

    const femaleCount = useMemo(() =>
        animals.filter(a => (a.gender?.toLowerCase() === "female")).length, [animals]
    );

    const activeStaff = useMemo(() =>
        staff.filter(s => s.status === 1).length, [staff]
    );

    const totalCapacity = useMemo(() =>
        stables.reduce((sum, s) => sum + (s.limit || 0), 0), [stables]
    );

    const totalProductQty = useMemo(() =>
        products.reduce((sum, p) => sum + (p.quantity || 0), 0), [products]
    );

    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="rounded-[16px] bg-gradient-to-br from-[#C8F0DA] to-[#F4F8F2] p-6 border border-[#D8E8DD]">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center text-[#0A7E4D]">
                                <span className="text-lg">👋</span>
                            </div>
                            <div>
                                <h2 className="text-[24px] leading-[32px] text-[#0E1A12] font-semibold">
                                    Bienvenido{info?.name ? `, ${info.name}` : ""}
                                </h2>
                                <p className="text-[#4F6354] text-sm">
                                    Panel de control — VacApp
                                </p>
                            </div>
                        </div>
                    </div>

                    <DashboardCards />
                </div>

                <div className="xl:w-[400px]">
                    <NextCampaigns />
                </div>
            </div>

            <div className="rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-5">
                <h3 className="font-inter font-semibold text-[#0E1A12] text-base mb-4">
                    Resumen rápido
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[#7E8F82] text-[11px] font-inter font-medium uppercase tracking-wider">Machos</span>
                        <span className="text-[#0E1A12] text-xl font-bold font-inter">{maleCount}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[#7E8F82] text-[11px] font-inter font-medium uppercase tracking-wider">Hembras</span>
                        <span className="text-[#0E1A12] text-xl font-bold font-inter">{femaleCount}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[#7E8F82] text-[11px] font-inter font-medium uppercase tracking-wider">Capacidad</span>
                        <span className="text-[#0E1A12] text-xl font-bold font-inter">{totalCapacity}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[#7E8F82] text-[11px] font-inter font-medium uppercase tracking-wider">Personal activo</span>
                        <span className="text-[#0E1A12] text-xl font-bold font-inter">{activeStaff}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[#7E8F82] text-[11px] font-inter font-medium uppercase tracking-wider">Total uds.</span>
                        <span className="text-[#0E1A12] text-xl font-bold font-inter">{totalProductQty}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[#7E8F82] text-[11px] font-inter font-medium uppercase tracking-wider">Campañas activas</span>
                        <span className="text-[#0E1A12] text-xl font-bold font-inter">{activeCampaigns}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
