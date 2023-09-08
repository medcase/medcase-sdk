import {Availability} from "../schemas/medcase.objects/availability";
import {ApiClient} from "./api.client";
import {AxiosResponse} from "axios";
import {HttpMethod} from "../schemas/http.method";
import {medcaseConstants} from "../../config";
import {buildPath} from "../../utils/build.query";
import {Client, Parameters} from "../schemas/client";
import {DateRange} from "../schemas/date.range";

export type RetrieveAvailabilityParameters = Parameters<{ dateRange: DateRange, clinicianId: string }>

export class AvailabilitiesClient implements Client<Availability[]> {
    constructor(private apiClient: ApiClient) {
    }

    retrieve = async ({ projectId, data: {dateRange, clinicianId} }: RetrieveAvailabilityParameters): Promise<Availability[]> => {
        const availabilityPath: string = buildPath(
            [medcaseConstants.TELEHEALTH, medcaseConstants.PROJECT, projectId, medcaseConstants.AVAILABILITY],
            {startDate: dateRange.startDate, endDate: dateRange.endDate, clinicianId: clinicianId}
        );

        const response: AxiosResponse = await this.apiClient.makeRetryCallWithRefreshTokenRetryHook({
            method: HttpMethod.GET,
            path: availabilityPath
        })
        return response.data.map(this.mapAvailability);
    }

    private mapAvailability = (availability: Availability): Availability => ({
        startDateTime: availability.startDateTime,
        endDateTime: availability.endDateTime
    });
}