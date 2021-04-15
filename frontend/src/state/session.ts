import jdwDecode from "jwt-decode"

interface JwtTokenData {
    id: number;
    email: string;
}

export class Session {
    accessJwt: string;
    userEmail: string;

    constructor(accessJwt: string) {
        this.accessJwt = accessJwt

        const decodedJwt = jdwDecode<JwtTokenData>(accessJwt)
        this.userEmail = decodedJwt.email
    }
}
