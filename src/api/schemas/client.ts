import {RetrieveAvailabilityParameters} from "../clients/availabilities.client";
import {CreateSurveyParameters} from "../clients/survey.client";

type RetrieveParameters = RetrieveAvailabilityParameters
type CreateParameters = CreateSurveyParameters
export interface Client<T> {
    retrieve?: (parameters: RetrieveParameters) => Promise<T>;
    create?: (parameters: CreateParameters) => Promise<T>;
}