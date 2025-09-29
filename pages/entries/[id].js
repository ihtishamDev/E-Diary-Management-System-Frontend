import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
export default function EntryPage() {
    const r = useRouter(); const { id } = r.query
    const [entry, setEntry] = useState(null)
    const [editing, setEditing] = useState(false)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    useEffect(() => { if (!id) return; fetchEntry() }, [id])
    async function fetchEntry() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'}/entries/${id}`, { credentials:'include' })
if (res.status === 401) return r.push('/')
        if (!res.ok) return
        const data = await res.json(); setEntry(data); setTitle(data.title);
        setContent(data.content)
    }
    async function save() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'}/entries/${id}`, { method:'PATCH', credentials:'include',
headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            title,
            content
        }) })
    if (res.ok) { setEditing(false); fetchEntry() }
}
async function del() {
    if (!confirm('delete?')) return; await fetch(`$
{process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1'}/entries/${id}`, {
        method: 'DELETE', credentials: 'include'
    }); r.push('/dashboard')
}
if (!entry) return <div className="max-w-3xl mx-auto mt-8">Loading...</div>
return (
    <main className="max-w-3xl mx-auto mt-8 p-4 bg-white shadow rounded">
        {editing ? (
            <div className="space-y-3">
                <input className="w-full border rounded px-3 py-2" value={title}
                    onChange={e => setTitle(e.target.value)} />
                <textarea className="w-full border rounded px-3 py-2" rows={10}
                    value={content} onChange={e => setContent(e.target.value)} />
                <div className="flex gap-2">
                    <button onClick={save}
                        className="px-3 py-2 bg-indigo-600 text-white rounded">Save</button>
                    <button onClick={() => setEditing(false)} className="px-3 py-2 bggray-200 rounded">Cancel</button>
                </div>
            </div>
        ) : (
            <div>
                <h1 className="text-xl font-semibold">{entry.title}</h1>
                <div className="text-sm text-gray-500">{new
                    Date(entry.created_at).toLocaleString()}</div>
                <p className="mt-3">{entry.content}</p>
                <div className="mt-4 flex gap-2">
                    <button onClick={() => setEditing(true)} className="px-3 py-2 bgyellow-400 rounded">Edit</button>
                    <button onClick={del} className="px-3 py-2 bg-red-500 text-white
rounded">Delete</button>
                </div>
            </div>
        )}
    </main>
)
}
