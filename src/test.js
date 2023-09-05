import {MedcaseClient} from "./api/client";
import {GetAvailabilityCommand} from "./api/commands/get.availability.command";
import {BookMeetingCommand} from "./api/commands/book.meeting.command";

const medcaseClient = new MedcaseClient({
        clientCredentials: {
            clientId: "HgZEjkaPhOc996SY4gm4BqwZEHPm0HUo",
            clientSecret: "NMs3l0yYNeX3RiGJTPEHuAEtMFbU8zKTRJKt7q5UldZ6jCB4DOMUxarWR1Dh9Wcn",
        },
        testEnv: true,
    }
);

const getAvailabilityCommand = new GetAvailabilityCommand({
        dateRange: {
            startDate: "2023-09-05",
            endDate: "2023-09-19"
        },
        projectId: "ccca1021-96cd-473d-94a9-448ae5e92842",
    }
);


medcaseClient.executeCommand(getAvailabilityCommand).then((res) => {
        const bookMeetingCommand = new BookMeetingCommand({
            participantId: "ccca1021-96cd-473d-94a9-448ae5e92842",
            projectId: "ccca1021-96cd-473d-94a9-448ae5e92842",
            startDateTime: res[0].startDateTime,
            endDateTime: res[0].endDateTime,
        })

        medcaseClient.executeCommand(bookMeetingCommand).then((res) => {
                console.log(res);
            }
        )
    }
);