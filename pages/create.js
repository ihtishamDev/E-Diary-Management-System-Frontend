import { useState } from 'react'
import { useRouter } from 'next/router'
export default function Create() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [file, setFile] = useState(null)
    const [msg, setMsg] = useState('')
    async function submit(e) {
        e.preventDefault()
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/entries`, {
            method: 'POST', credentials: 'include', headers: { 'ContentType': 'application/json' }, body: JSON.stringify({ title, content })
        })
        if (!res.ok) { setMsg('Error creating'); return }
        const entry = await res.json()
        if (file) {
            const form = new FormData(); form.append('entry_id', entry.id);
            form.append('file', file)
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/attachments/upload`, {
                method: 'POST', credentials: 'include', body:
                    form
            })
        }
        router.push('/dashboard')
    }
    return (
        <main className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow rounded">
            <h1 className="text-xl font-semibold mb-4">New Entry</h1>
            <form onSubmit={submit} className="space-y-3">
                <input className="w-full border rounded px-3 py-2" placeholder='Title'
                    value={title} onChange={e => setTitle(e.target.value)} />
                <textarea className="w-full border rounded px-3 py-2"
                    placeholder='Write your diary...' value={content}
                    onChange={e => setContent(e.target.value)} rows={10} />
                <input type='file' onChange={e => setFile(e.target.files[0])} />
                <div>
                    <button type='submit' className="px-4 py-2 bg-indigo-600 text-white
                        rounded hover:bg-indigo-700">Create</button>
                </div>
            </form>
            <p className="mt-3">{msg}</p>
        </main>
    )
}
