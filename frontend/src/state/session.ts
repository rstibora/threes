import jdwDecode from "jwt-decode"

interface JwtTokenData {
    user_id: number;
    email: string;
}

export class Session {
    accessJwt: string;
    userEmail: string;
    userId: number;

    constructor(accessJwt: string) {
        this.accessJwt = accessJwt

        const decodedJwt = jdwDecode<JwtTokenData>(accessJwt)
        this.userEmail = decodedJwt.email
        this.userId = decodedJwt.user_id
    }
}
