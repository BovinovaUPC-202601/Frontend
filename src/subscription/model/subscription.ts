export type SubscriptionPlan = "Free" | "Plus";

export class Subscription {
    plan: SubscriptionPlan;

    constructor(plan: SubscriptionPlan) {
        this.plan = plan;
    }
}