import {ClientCredentials} from "./schemas/client.interfaces";
import {AppLogger} from "@medcase/logger-lib";
import {ApiClient} from "./clients/api.client";
import {AvailabilitiesClient} from "./clients/availabilities.client"

export class MedcaseSDK {
    private readonly apiClient: ApiClient;
    public availabilities: AvailabilitiesClient;

    constructor(config: {
        clientCredentials: ClientCredentials,
        logger: AppLogger,
    }) {
        this.apiClient = new ApiClient(config);
        this.availabilities = new AvailabilitiesClient(this.apiClient);
    }
}