import {ClientCredentials} from "./schemas/client.interfaces";
import {AppLogger} from "@medcase/logger-lib";
import {ApiClient} from "./clients/api.client";
import {AvailabilitiesClient} from "./clients/availabilities.client"
import {SurveyClient} from "./clients/survey.client";
import {PatientNablaClient} from "./clients/patient.nabla.client";

export class MedcaseSDK {
    private readonly apiClient: ApiClient;
    public availabilities: AvailabilitiesClient;
    public patientNabla: PatientNablaClient
    public survey: SurveyClient;

    constructor(config: {
        clientCredentials: ClientCredentials,
        logger: AppLogger,
    }) {
        this.apiClient = new ApiClient(config);
        this.availabilities = new AvailabilitiesClient(this.apiClient);
        this.patientNabla = new PatientNablaClient(this.apiClient);
        this.survey = new SurveyClient(this.apiClient);
    }
}