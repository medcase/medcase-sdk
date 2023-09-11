import {Client} from "../schemas/client";
import {medcaseConstants} from "../../config";
import {HttpMethod} from "../schemas/http.method";
import {Survey, SurveyRequest} from "../schemas";
import {ApiClient} from "./api.client";
import {Parameters} from "../schemas/client";

type CreateSurveyParameters = Parameters<{ patientId: string, survey: SurveyRequest }>

export class SurveyClient implements Client<Survey> {
    constructor(private apiClient: ApiClient) {
    }

    create = (p: CreateSurveyParameters): Promise<Survey> => this.apiClient.call({
        path: `/${medcaseConstants.TELEHEALTH}/${medcaseConstants.PROJECT}/${p.projectId}/${medcaseConstants.PATIENT}/${p.patientId}/${medcaseConstants.SURVEY}`,
        method: HttpMethod.POST,
        body: p.survey
    }).then(r => this.mapSurvey(r.data));

    private mapSurvey = (survey: Survey): Survey => ({id: survey.id, title: survey.title, items: survey.items});
}