import {Availability} from "../schemas/medcase.objects/availability";
import {ApiClient} from "./api.client";
import {AxiosResponse} from "axios";
import {HttpMethod} from "../schemas/http.method";
import {medcaseConstants} from "../../config";
import {buildPath} from "../../utils/build.query";

type DateRange = { startDate: string, endDate: string };

export class MeetingsClient {
    constructor(private apiCaller: ApiClient) {
    }

    obtain = async (projectId: string, dateRange: DateRange, clinicianId: string): Promise<Availability[]> => {

        const availabilityPath: string = buildPath(
            [medcaseConstants.TELEHEALTH, medcaseConstants.PROJECT, projectId, medcaseConstants.AVAILABILITY],
            {startDate: dateRange.startDate, endDate: dateRange.endDate, clinicianId: clinicianId}
        );

        const response: AxiosResponse = await this.apiCaller.makeRetryCallWithRefreshTokenRetryHook({method:HttpMethod.GET, path:availabilityPath})
        return response.data.map(this.mapAvailability);
    }

    private mapAvailability = (availability: Availability): Availability => ({
        startDateTime: availability.startDateTime,
        endDateTime: availability.endDateTime
    });
}