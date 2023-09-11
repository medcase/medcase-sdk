import {ApiClient} from "./api.client";
import {Client, Parameters} from "../schemas/client";
import {HttpMethod} from "../schemas/http.method";
import {medcaseConstants} from "../../config";
import {AxiosResponse} from "axios";
import {Patient} from "../schemas";

type CreatePatientParameters = Parameters<{ patient: Patient }>

export class PatientNablaClient implements Client<Patient> {
    constructor(private apiClient: ApiClient) {
    }

    create = (p: CreatePatientParameters): Promise<Patient> => this.apiClient.call({
            method: HttpMethod.POST,
            path: `/${medcaseConstants.TELEHEALTH}/${medcaseConstants.PROJECT}/${p.projectId}/${medcaseConstants.EHR}/${medcaseConstants.NABLA}/${medcaseConstants.PATIENT}`,
            body: p.patient
        }).then((r: AxiosResponse) => this.mapPatient(r.data));

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