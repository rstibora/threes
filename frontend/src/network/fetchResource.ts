
export class HttpError extends Error {
    code: number

    constructor(message: string, code: number) {
        super(message)
        this.code = code
    }
}


export async function fetchResource(method: string, resource: string, data?: any, access_token?: string): Promise<Response> {
    let headers: any = {
        "Content-Type": "application/json",
    }
    if (access_token != null) {
        headers["Authorization"] = `Bearer ${access_token}`
    }

    let fetch_args: any = { method, headers }
    if (data != null) {
        fetch_args.body = JSON.stringify(data)
    }
    return fetch(
        `http://${process.env.HOST}${process.env.PORT === "" ? "" : ":"}${process.env.PORT}${resource}`,
        fetch_args)
}
