import {ApiClient} from "./api/clients/api.client";
import {AvailabilitiesClient} from "./api/clients/availabilities.client"
import {SurveyClient} from "./api/clients/survey.client";
import {ClientCredentials} from "./api/schemas";
import {PatientClient} from "./api/clients/patient.client";
import {FileClient} from "./api/clients/file.client";

export interface MedcaseSDKInterface {
    availabilities: AvailabilitiesClient;
    patient: PatientClient;
    file: FileClient
    survey: SurveyClient;
    apiClient: ApiClient;
}

export class MedcaseSDK implements MedcaseSDKInterface {
    public apiClient: ApiClient;
    public availabilities: AvailabilitiesClient;
    public patient: PatientClient
    public survey: SurveyClient;
    public file: FileClient;

    constructor(config: { clientCredentials: ClientCredentials, }) {
        this.apiClient = new ApiClient(config);
        this.availabilities = new AvailabilitiesClient(this.apiClient);
        this.patient = new PatientClient(this.apiClient);
        this.survey = new SurveyClient(this.apiClient);
        this.file = new FileClient(this.apiClient);
    }
}