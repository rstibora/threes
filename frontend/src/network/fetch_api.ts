
const HOST = "http://127.0.0.1:8000"

export async function fetch_resource(method: string, resource: string, access_token?: string): Promise<Response> {
    return fetch(HOST + resource, {
        method,
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
}
