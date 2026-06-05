export class Alert {
    id: number = 0;
    bovineId: number = 0;
    userId: number = 0;
    alertType: string = '';
    urgencyLevel: string = '';
    status: string = '';
    message: string = '';
    createdAt: string = '';

    constructor(data: Partial<Alert> = {}) {
        Object.assign(this, data);
    }

    get isUnread() { return this.status === 'Unread'; }
    get isRed()    { return this.urgencyLevel === 'Red'; }
    get isYellow() { return this.urgencyLevel === 'Yellow'; }

    // Friendly Spanish label for the alert category. The specific condition
    // (fiebre, hipotermia, taquicardia, …) is in `message`, not here.
    get alertTypeLabel() {
        const labels: Record<string, string> = {
            BiometricAnomaly: 'Anomalía biométrica',
            VisualAnomaly:    'Anomalía visual',
        };
        return labels[this.alertType] ?? this.alertType;
    }
}
