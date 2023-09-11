import {ApiClient} from "./api.client";
import {Client, Parameters} from "../schemas/client";
import {HttpMethod} from "../schemas/http.method";
import {buildPath} from "../../utils/build.query";
import {medcaseConstants} from "../../config";
import {AxiosResponse} from "axios";
import {Patient} from "../schemas";

type CreatePatientParameters = Parameters<{ patient: Patient }>

export class PatientNablaClient implements Client<Patient> {
    constructor(private apiClient: ApiClient) {
    }

    create = async ({projectId, data: {patient}}: CreatePatientParameters): Promise<Patient> => {
        const patientPath: string = buildPath(
            [medcaseConstants.TELEHEALTH, medcaseConstants.PROJECT, projectId, medcaseConstants.EHR, medcaseConstants.NABLA, medcaseConstants.PATIENT]
        );

        const response: AxiosResponse = await this.apiClient.makeRetryCallWithRefreshTokenRetryHook({
            method: HttpMethod.POST,
            path: patientPath,
            body: patient
        })

        return this.mapPatient(response.data);
    }

    private mapPatient = (patient: Patient): Patient => ({
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        sex: patient.sex,
        externalId: patient.externalId,
        dateOfBirth: patient.dateOfBirth
    })
}