
const HOST = "http://127.0.0.1:8000"

export async function fetch_resource(method: string, resource: string, access_token?: string): Promise<Response> {
    const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]')?.getAttribute("value")
    if (csrf_token == null) {
        throw Error("CSRF token not found in HTML DOM.")
    }

    let headers: any = { "X-CSRFToken": csrf_token }
    if (access_token != null) {
        headers["Authorization"] = `Bearer ${access_token}`
    }

    return fetch(HOST + resource, { method, headers })
}
