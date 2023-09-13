import {ApiClient} from "./api.client";
import {Client, Parameters} from "../schemas/client";
import {HttpMethod} from "../schemas/http.method";
import {medcaseConstants} from "../../config";
import {AxiosResponse} from "axios";
import {FileResponse} from "../schemas/file";

type CreateFileParameters = Parameters<{
    file: ReadableStream,
    patientId: string,
    filename: string,
    contentTypeHeader: string
}>

export class FileClient implements Client<FileResponse> {
    constructor(private apiClient: ApiClient) {
    }

    create = (p: CreateFileParameters): Promise<FileResponse> => this.apiClient.call({
        method: HttpMethod.POST,
        path: `/${medcaseConstants.TELEHEALTH}/${medcaseConstants.PROJECT}/${p.projectId}/${medcaseConstants.EHR}/${medcaseConstants.NABLA}/${medcaseConstants.PATIENT}/${p.patientId}/${medcaseConstants.FILE}`,
        body: p.file,
        headers: {'Content-Type': p.contentTypeHeader, 'x-filename': p.filename}
    }).then((r: AxiosResponse) => this.mapFileResponse(r.data));

    private mapFileResponse = ({id}: FileResponse): FileResponse => ({id})
}