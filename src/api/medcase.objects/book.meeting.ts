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
    CREATED = "CREATED",
    CANCELLED = "CANCELLED",
    FINISHED = "FINISHED",
    PATIENT_ABSENT = "PATIENT_ABSENT",
    STARTED = "STARTED",
}

export interface BookParticipantMeetingRequest {
    projectId: string,
    startDateTime: string,
    endDateTime: string,
}