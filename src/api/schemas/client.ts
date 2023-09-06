import {RetrieveMeetingsParameters} from "../clients/meetings.client";
import {Availability} from "./medcase.objects/availability";

type Parameters = RetrieveMeetingsParameters
type RetrievedValues = Availability[]
export interface Client {
    retrieve?: (parameters: Parameters) => Promise<RetrievedValues>;
}