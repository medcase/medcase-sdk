export interface    Patient {
    id: string
    firstName: string
    lastName: string
    email?: string
    phone?: string
    address?: Address,
    sex?: Sex
    externalId?: string
    /** The format is an ISO 8601 string (YYYY-MM-DD).*/
    dateOfBirth?: string
}

export enum Sex {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}

export interface Address {
    streetAddress: string,
    zipCode: string,
    city: string,
    state?: string,
    country?: string
}