export interface BookParticipantMeetingResult extends ParticipantMeeting {
    videoUrl: string;
}

export interface ParticipantMeeting {
    id: string,
    projectId: string,
    startDateTime: string,
    endDateTime: string,
    participantId: string,
    status: MeetingStatus
}

export enum MeetingStatus {

}

export interface BookParticipantMeetingRequest {
    projectId: string,
    startDateTime: string,
    endDateTime: string,
}