
export async function fetchResource(method: string, resource: string, data?: any, access_token?: string): Promise<Response> {
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
    return fetch(`http://${process.env.HOST}${process.env.PORT === undefined ? "" : ":"}
                 ${process.env.PORT}${resource}`, fetch_args)
}
