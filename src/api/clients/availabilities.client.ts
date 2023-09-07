import {Availability} from "../schemas/medcase.objects/availability";
import {ApiClient} from "./api.client";
import {HttpMethod} from "../schemas/http.method";
import {paths} from "../../config";
import {Client} from "../schemas/client";
import {DateRange} from "../schemas/date.range";
import {buildQuery} from "../../utils/build.query";
import {AxiosResponse} from "axios";

export type RetrieveAvailabilityParameters = { projectId: string, dateRange: DateRange, clinicianId: string };

export class AvailabilitiesClient implements Client<Availability[]> {
    constructor(private apiClient: ApiClient) {
    }

    retrieve = (p: RetrieveAvailabilityParameters): Promise<Availability[]> => this.apiClient.call({
        method: HttpMethod.GET,
        path: `/${paths.TELEHEALTH}/${paths.PROJECT}/${p.projectId}${paths.AVAILABILITY}${buildQuery({
            startDate: p.dateRange.startDate,
            endDate: p.dateRange.endDate,
            clinicianId: p.clinicianId
        })}`
    }).then((r: AxiosResponse) => r.data.map(this.mapAvailability));


    private mapAvailability = (availability: Availability): Availability => ({
        startDateTime: availability.startDateTime,
        endDateTime: availability.endDateTime
    });
}