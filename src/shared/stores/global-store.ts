import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Info } from "../../dashboard/model/info";
import { dashboardService } from "../../dashboard/services/dashboard-service";
import { Stable } from "../../stables/model/stable";
import { stableService } from "../../stables/services/stable-service";
import { StaffStatus, type Staff } from "../../staff/model/staff";
import { staffService } from "../../staff/services/staff-service";
import { Campaign } from "../../campaigns/model/campaign";
import { campaignService } from "../../campaigns/services/campaigns-service";
import { Category } from "../../inventory/model/Category";
import { Product } from "../../inventory/model/Product";
import { inventoryService } from "../../inventory/services/inventory-service";
import { Animal } from "../../animals/model/animal";
import { animalsService } from "../../animals/services/animals-service";

interface GlobalState {
    // Dashboard
    info: Info;
    fetchInfo: () => Promise<void>;

    // Animals
    animals: Animal[];
    fetchAnimals: () => Promise<void>;
    addAnimal: (animal: Animal) => Promise<void>;
    deleteAnimal: (animal: Animal) => Promise<void>;
    updateAnimal: (animal: Animal) => Promise<void>;

    // Stables
    stables: Stable[];
    fetchStables: () => Promise<void>;
    addStable: (stable: Stable) => Promise<void>;
    deleteStable: (stable: Stable) => Promise<void>;
    updateStable: (stable: Stable) => Promise<void>;

    // Campaigns
    campaigns: Campaign[];
    fetchCampaigns: () => Promise<void>;
    addCampaign: (campaign: Campaign) => Promise<void>;
    updateCampaign: (campaign: Campaign) => Promise<void>;
    deleteCampaign: (campaign: Campaign) => Promise<void>;

    // Staff
    staff: Staff[];
    fetchStaff: () => Promise<void>;
    addStaff: (staff: Staff) => Promise<void>;
    deleteStaff: (staff: Staff) => Promise<void>;
    updateStaff: (staff: Staff) => Promise<void>;

    // Inventory
    categories: Category[];
    fetchCategories: () => Promise<void>;
    addCategory: (category: Category) => Promise<void>;
    deleteCategory: (category: Category) => Promise<void>;
    products: Product[];
    fetchProducts: () => Promise<void>;
    addProduct: (product: Product) => Promise<void>;
    deleteProduct: (product: Product) => Promise<void>;
}

export const useGlobalStore = create(immer<GlobalState>((set) => ({
    // Dashboard
    info: new Info(),
    fetchInfo: async () => {
        try {
            const res = await dashboardService.getData();

            if (res.data)
                set(state => { state.info = new Info(res.data); });
        } catch (error) {
            console.error(error);
        }
    },

    // Animals
    animals: [],
    fetchAnimals: async () => {
        try {
            const res = await animalsService.getAnimals();
            if (res.data) {
                set((state) => {
                    state.animals = res.data.map(a => new Animal(a));
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    addAnimal: async (animal: Animal) => {
        try {
            const res = await animalsService.addAnimal(animal);
            if (res.data) {
                set((state) => {
                    state.animals.push(new Animal(res.data));
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    deleteAnimal: async (animal: Animal) => {
        try {
            const res = await animalsService.deleteAnimal(animal);
            if (res.status === 200) {
                set((state) => {
                    state.animals = state.animals.filter((a) => a.id != animal.id);
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    updateAnimal: async (animal: Animal) => {
        try {
            const res = await animalsService.updateAnimal(animal);
            if (res.data) {
                set((state) => {
                    const index = state.animals.findIndex((a) => a.id === animal.id);
                    if (index !== -1) state.animals[index] = new Animal(res.data);
                });
            }
        } catch (error) {
            console.error(error);
        }
    },

    // Stables
    stables: [],
    fetchStables: async () => {
        try {
            const res = await stableService.getStables();
            if (res.data) {
                set((state) => {
                    state.stables = res.data.map(s => new Stable(s));
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    addStable: async (stable: Stable) => {
        try {
            const res = await stableService.addStable(stable);
            if (res.data) {
                set((state) => {
                    state.stables.push(new Stable(res.data));
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    deleteStable: async (stable: Stable) => {
        try {
            const res = await stableService.deleteStable(stable);
            if (res.status === 200) {
                set((state) => {
                    state.stables = state.stables.filter((s) => s.id != stable.id);
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    updateStable: async (stable: Stable) => {
        try {
            const res = await stableService.updateStable(stable);
            if (res.data) {
                set((state) => {
                    const index = state.stables.findIndex((s) => s.id === stable.id);
                    if (index !== -1) state.stables[index] = new Stable(res.data);
                });
            }
        } catch (error) {
            console.error(error);
        }
    },

    //Campaigns
    campaigns: [],
    fetchCampaigns: async () => {
        try {
            const res = await campaignService.getCampaigns();
            if (res.data) {
                set((state) => {
                    state.campaigns = res.data.map(c => new Campaign(c));
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    addCampaign: async (campaign) => {
        try {
            const res = await campaignService.addCampaign(campaign);
            if (res.data) {
                set((state) => {
                    state.campaigns.push(new Campaign(res.data));
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    updateCampaign: async (campaign) => {
        try {
            const res = await campaignService.updateCampaign(campaign);
            if (res.data) {
                set((state) => {
                    const index = state.campaigns.findIndex((c) => c.id === campaign.id);
                    if (index !== -1) state.campaigns[index] = new Campaign(res.data);
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    deleteCampaign: async (campaign) => {
        try {
            const res = await campaignService.deleteCampaign(campaign);
            if (res.status === 200) {
                set((state) => {
                    state.campaigns = state.campaigns.filter((c) => c.id != campaign.id);
                });
            }
        } catch (error) {
            console.error(error);
        }
    },

    // Staff
    staff: [],
    fetchStaff: async () => {
        try {
            const res = await staffService.getStaff();
            if (res.data) {
                const mappedStaff: Staff[] = res.data.map((s: any) => ({
                    ...s,
                    status: s.employeeStatus
                }));
                set(state => { state.staff = mappedStaff; });
            }
        } catch (error) {
            console.error(error);
        }
    },
    addStaff: async (staff) => {
        try {
            const newStaff: Staff = { ...staff, status: StaffStatus.Activo };
            const res = await staffService.addStaff(newStaff);
            if (res.data) {
                const mappedStaff: Staff = { ...res.data, status: res.data.employeeStatus };
                set((state) => {
                    state.staff.push(mappedStaff);
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    deleteStaff: async (staff) => {
        try {
            const res = await staffService.deleteStaff(staff);
            if (res.status === 200) {
                set((state) => {
                    state.staff = state.staff.filter((s) => s.id != staff.id);
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    updateStaff: async (staff) => {
        try {
            const res = await staffService.updateStaff(staff);
            if (res.data) {
                const mappedStaff: Staff = { ...res.data, status: res.data.employeeStatus };
                set((state) => {
                    const index = state.staff.findIndex((s) => s.id === staff.id);
                    if (index !== -1) state.staff[index] = mappedStaff;
                });
            }
        } catch (error) {
            console.error(error);
        }
    },

    // Inventory
    categories: [],
    fetchCategories: async () => {
        try {
            const res = await inventoryService.getCategories();
            if (res.data) {
                set(state => { state.categories = res.data.map(c => new Category(c)); });
            }
        }
        catch (error) {
            console.error(error);
        }
    },
    addCategory: async (category) => {
        try {
            const res = await inventoryService.createCategory(category);
            if (res.data) {
                set((state) => {
                    state.categories.push(new Category(res.data));
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    deleteCategory: async (category) => {
        try {
            const res = await inventoryService.deleteCategory(category);
            if (res.status === 200) {
                set((state) => {
                    state.categories = state.categories.filter((c) => c.id != category.id);
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    products: [],
    fetchProducts: async () => {
        try {
            const res = await inventoryService.getProducts();
            if (res.data) {
                set(state => { state.products = res.data.map(p => new Product(p)); });
            }
        } catch (error) {
            console.error(error);
        }
    },
    addProduct: async (product) => {
        try {
            const res = await inventoryService.createProduct(product);
            if (res.data) {
                set(state => {
                    state.products.push(new Product(res.data));
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    deleteProduct: async (product) => {
        try {
            const res = await inventoryService.deleteProduct(product);
            if (res.status === 200) {
                set(state => {
                    state.products = state.products.filter((p) => p.id != product.id);
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
})));
