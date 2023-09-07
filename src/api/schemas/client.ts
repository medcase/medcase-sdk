import {RetrieveAvailabilityParameters} from "../clients/availabilities.client";
import {CreatePatientParameters} from "../clients/patient.nabla.client";

type RetrieveParameters = RetrieveAvailabilityParameters
type CreateParameters = CreatePatientParameters

export interface Client<T> {
    retrieve?: (parameters: RetrieveParameters) => Promise<T>;
    create?: (parameters: CreateParameters) => Promise<T>;
}