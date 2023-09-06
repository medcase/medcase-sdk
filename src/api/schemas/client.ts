import {RetrieveMeetingsParameters} from "../clients/availabilities.client";

type Parameters = RetrieveMeetingsParameters
export interface Client<T> {
    retrieve?: (parameters: Parameters) => Promise<T>;
}