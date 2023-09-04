import {HttpMethod, MedcaseClientCommand} from "../schemas/client.command";
import {BookParticipantMeetingRequest, BookParticipantMeetingResult} from "../medcase.objects/book.meeting";

export class BookMeetingCommand implements MedcaseClientCommand<BookParticipantMeetingResult> {
    path: string;
    method: HttpMethod;
    resourceMapper: (resource: BookParticipantMeetingResult) => BookParticipantMeetingResult;
    body: BookParticipantMeetingRequest;

    constructor(config: { participantId: string, projectId: string, startDateTime: string, endDateTime: string }) {
        this.path = `/telehealth/participant/${config.participantId}/meeting`;
        this.method = HttpMethod.POST;
        this.resourceMapper = this.mapParticipantMeetingResult;
        this.body = {
            projectId: config.projectId,
            startDateTime: config.startDateTime,
            endDateTime: config.endDateTime
        }
    }

    mapParticipantMeetingResult = (resource: BookParticipantMeetingResult): BookParticipantMeetingResult => ({
        id: resource.id,
        projectId: resource.projectId,
        startDateTime: resource.startDateTime,
        endDateTime: resource.endDateTime,
        participantId: resource.participantId,
        status: resource.status,
        videoUrl: resource.videoUrl
    })
}