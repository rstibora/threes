import jdwDecode from "jwt-decode"
import { DateTime } from "luxon"

interface JwtTokenData {
    user_id: number
    email: string
    date_joined: string
}

export class Session {
    accessJwt: string
    userEmail: string
    userId: number
    dateJoined: DateTime

    constructor(accessJwt: string) {
        this.accessJwt = accessJwt

        const decodedJwt = jdwDecode<JwtTokenData>(accessJwt)
        this.userEmail = decodedJwt.email
        this.userId = decodedJwt.user_id
        this.dateJoined = DateTime.fromISO(decodedJwt.date_joined)
    }
}
