import {ApiClient} from "./api/clients/api.client";
import {AvailabilitiesClient} from "./api/clients/availabilities.client"
import {SurveyClient} from "./api/clients/survey.client";
import {ClientCredentials} from "./api/schemas";
import {PatientNablaClient} from "./api/clients/nabla/patient.nabla.client";
import {FileNablaClient} from "./api/clients/nabla/file.nabla.client";

export interface MedcaseSDKInterface {
    availabilities: AvailabilitiesClient;
    patientNabla: PatientNablaClient;
    fileNabla: FileNablaClient
    survey: SurveyClient;
    apiClient: ApiClient;
}

export class MedcaseSDK implements MedcaseSDKInterface {
    public apiClient: ApiClient;
    public availabilities: AvailabilitiesClient;
    public patientNabla: PatientNablaClient
    public survey: SurveyClient;
    public fileNabla: FileNablaClient;

    constructor(config: { clientCredentials: ClientCredentials, }) {
        this.apiClient = new ApiClient(config);
        this.availabilities = new AvailabilitiesClient(this.apiClient);
        this.patientNabla = new PatientNablaClient(this.apiClient);
        this.survey = new SurveyClient(this.apiClient);
        this.fileNabla = new FileNablaClient(this.apiClient);
    }
}