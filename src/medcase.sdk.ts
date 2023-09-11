import {ApiClient} from "./api/clients/api.client";
import {AvailabilitiesClient} from "./api/clients/availabilities.client"
import {SurveyClient} from "./api/clients/survey.client";
import {PatientNablaClient} from "./api/clients/patient.nabla.client";
import {ClientCredentials} from "./api/schemas";

export interface MedcaseSDKInterface {
    availabilities: AvailabilitiesClient;
    patientNabla: PatientNablaClient;
    survey: SurveyClient;
    apiClient: ApiClient;
}

export class MedcaseSDK implements MedcaseSDKInterface {
    public apiClient: ApiClient;
    public availabilities: AvailabilitiesClient;
    public patientNabla: PatientNablaClient
    public survey: SurveyClient;

    constructor(config: { clientCredentials: ClientCredentials, }) {
        this.apiClient = new ApiClient(config);
        this.availabilities = new AvailabilitiesClient(this.apiClient);
        this.patientNabla = new PatientNablaClient(this.apiClient);
        this.survey = new SurveyClient(this.apiClient);
    }
}