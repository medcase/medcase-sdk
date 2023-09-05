import {HttpMethod, MedcaseClientCommand} from "../schemas/client.command";
import {Availability} from "../schemas/medcase.objects/availability";

type DateRange = { startDate: string, endDate: string };

export class GetAvailabilityCommand implements MedcaseClientCommand<Availability> {
    path: string;
    method: HttpMethod;
    resourceMapper: (resource: Availability) => Availability;

    constructor(config: { dateRange: DateRange, projectId: string, clinicianId?: string }) {
        this.path = `/telehealth/project/${config.projectId}/availability${this.buildQuery(config.dateRange, config.clinicianId)}`;
        this.method = HttpMethod.GET;
        this.resourceMapper = this.mapAvailability;
    }

    buildQuery = (dateRange: DateRange, clinicianId?: string): string =>
        `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}${clinicianId ? `&clinicianId=${clinicianId}` : ""}`;

    mapAvailability = (availability: Availability): Availability => ({
        startDateTime: availability.startDateTime,
        endDateTime: availability.endDateTime
    });
}