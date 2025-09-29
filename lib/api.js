export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
export async function api(path, opts = {}) {
    opts.credentials = 'include'
    if (!opts.headers) opts.headers = {}
    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof
        FormData)) {
        opts.headers['Content-Type'] = 'application/json'
        opts.body = JSON.stringify(opts.body)
    }
    const res = await fetch(`${API_BASE}${path}`, opts)
    if (res.status === 401) {
        throw new Error('unauthorized')
    }
    return res
}