import type { Person } from "./person"

export interface Invite {
    id: number
    person: Person
    theme: string
    date: Date
    time: number
    accepted: boolean
    remembered: boolean
}

export interface ApiInvite {
    id: number
    person_id: number
    person: Person
    theme: string
    date: string
    time: number
    accepted: boolean
    remembered: boolean
}