import {Client} from "../schemas/client";
import {paths} from "../../config";
import {HttpMethod} from "../schemas/http.method";
import {Survey, SurveyRequest} from "../schemas/medcase.objects/survey";
import {ApiClient} from "./api.client";

export type CreateSurveyParameters = { projectId: string, patientId: string, survey: SurveyRequest };

export class SurveyClient implements Client<Survey> {
    constructor(private apiClient: ApiClient) {
    }

    create = (p: CreateSurveyParameters): Promise<Survey> => this.apiClient.call({
        path: `${paths.PROJECT}/${p.projectId}/${paths.PATIENT}/${p.patientId}/${paths.SURVEY}`,
        method: HttpMethod.POST,
        body: p.survey
    }).then(r => this.mapSurvey(r.data));

    private mapSurvey = (survey: Survey): Survey => ({id: survey.id, title: survey.title, items: survey.items});
}