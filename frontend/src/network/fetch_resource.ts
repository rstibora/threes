
const HOST = "http://127.0.0.1:8000"

export async function fetch_resource(method: string, resource: string, data?: any, access_token?: string): Promise<Response> {
    const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]')?.getAttribute("value")
    if (csrf_token == null) {
        throw Error("CSRF token not found in HTML DOM.")
    }

    let headers: any = {
        "X-CSRFToken": csrf_token,
        "Content-Type": "application/json",
    }
    if (access_token != null) {
        headers["Authorization"] = `Bearer ${access_token}`
    }

    let fetch_args: any = { method, headers }
    if (data != null) {
        fetch_args.body = JSON.stringify(data)
    }
    console.debug(`Fetch of ${resource} via ${method} with data ${data} and token ${access_token}`)
    return fetch(HOST + resource, fetch_args)
}
