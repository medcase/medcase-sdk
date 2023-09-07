import {RetrieveAvailabilityParameters} from "../clients/availabilities.client";

type Parameters = RetrieveAvailabilityParameters
export interface Client<T> {
    retrieve?: (parameters: Parameters) => Promise<T>;
}