import type { Person } from "./person"

export interface Invite {
    id: number
    person: Person
    theme: string
    date: Date
    time: number
    references: string
    status: number
}

export interface ApiInvite {
    id: number
    person_id: number
    person: Person
    theme: string
    date: string
    time: number
    references: string
    status: InviteStatus
}

export enum InviteStatus {
    WAIT_CONFIRMATION = 0,
    CONFIRMED = 1,
    REJECTED = 2,
    WAIT_REMEMBER = 3,
    REMEMBERED = 4,
    DONE = 5,
    NOT_DONE = 6
}