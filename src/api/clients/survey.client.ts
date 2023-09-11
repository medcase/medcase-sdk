import {Client, Parameters} from "../schemas/client";
import {buildPath} from "../../utils/build.query";
import {medcaseConstants} from "../../config";
import {AxiosResponse} from "axios";
import {HttpMethod} from "../schemas/http.method";
import {Survey, SurveyRequest} from "../schemas/survey";
import {ApiClient} from "./api.client";

type CreateSurveyParameters = Parameters<{ patientId: string, survey: SurveyRequest }>

export class SurveyClient implements Client<Survey> {
    constructor(private apiClient: ApiClient) {
    }

    create = async ({projectId, data: {patientId, survey}}: CreateSurveyParameters): Promise<Survey> => {
        const createSurveyPath: string = buildPath(
            [medcaseConstants.PROJECT, projectId, medcaseConstants.PATIENT, patientId, medcaseConstants.SURVEY]
        )

        const response: AxiosResponse = await this.apiClient.makeRetryCallWithRefreshTokenRetryHook({
            path: createSurveyPath,
            method: HttpMethod.POST,
            body: survey
        })

        return this.mapSurvey(response.data);
    }

    private mapSurvey = (survey: Survey): Survey => ({
            id: survey.id,
            title: survey.title,
            items: survey.items,
        }
    );
}