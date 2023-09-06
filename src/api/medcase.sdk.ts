import {ClientCredentials} from "./schemas/client.interfaces";
import {AppLogger} from "@medcase/logger-lib";
import {ApiClient} from "./clients/api.client";
import {MeetingsClient} from "./clients/meetings.client"

export class MedcaseSDK {
    private readonly apiClient: ApiClient;
    public meetings: MeetingsClient;

    constructor(config: {
        clientCredentials: ClientCredentials,
        logger: AppLogger,
    }) {
        this.apiClient = new ApiClient(config);
        this.meetings = new MeetingsClient(this.apiClient);
    }
}