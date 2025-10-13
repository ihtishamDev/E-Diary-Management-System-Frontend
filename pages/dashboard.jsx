import SideBar from '../components/SideBar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AddNoteModal from '../components/AddNoteModal';
import TableSlider from '../components/TableSlider'; // import the slider

const Dashboard = () => {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [err, setErr] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeCategories, setActiveCategories] = useState([]); // now holds category names
  const [lastWeekNotes, setLastWeekNotes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch entries
  async function load() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/entries`,

        { credentials: 'include' }
      );
      if (res.status === 401) return router.push('/');
      const data = await res.json();
      setEntries(data);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      setLastWeekNotes(data.filter(e => new Date(e.created_at) >= oneWeekAgo));
    } catch (e) {
      setErr(String(e));
    }
  }

     useEffect(() => {
    load();
    categoryload();
  }, []);
  
  async function categoryload() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/entries/getCategory`,

        { credentials: 'include' }
      );
      if (res.status == 401) return router.push('/');
       if (res.status == 404) return ;
      const data = await res.json();

      console.log(res , "datadatadata");
      

      // All categories (unique)
      const catSet = new Set(data.map(e => e.category || 'Uncategorized'));
      setCategories([...catSet]);

      // Active categories (unique from active entries)
      const activeCatSet = new Set(
        data.filter(e => e.status === "active").map(e => e.category || "Uncategorized")
      );
      setActiveCategories([...activeCatSet]);

    } catch (e) {
      setErr(String(e));


    }

  }
 




  // Logout
  async function logout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/');
  }

  // Save or update entry
  async function saveEntry(data) {
    const url = editing
      ? `${process.env.NEXT_PUBLIC_API_BASE}/entries/${editing.id}`
      : `${process.env.NEXT_PUBLIC_API_BASE}/entries/EntryData`;
    const method = editing ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      await load();
      setModalOpen(false);
      setEditing(null);
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.detail || 'Error');
    }
  }

  // Delete entry
  async function deleteEntry(id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/entries/${id}`,
        { method: 'DELETE', credentials: 'include' }
      );
      if (res.ok) await load();
    } catch (e) {
      setErr(String(e));
    }
  }

  return (
    <div className="min-h-screen bg-[url('/images/dashboard/dashboard_back.png')] bg-no-repeat bg-cover">
      <div className="flex min-h-screen">
        <SideBar />

        <main className="flex-1 p-6 relative z-10">
          <h1 className="text-2xl font-semibold mb-4 text-black drop-shadow">Dashboard</h1>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-600 text-white rounded-lg p-4 shadow">
              <div className="text-sm">Listed Categories</div>
              <div className="text-3xl font-bold">{categories.length}</div>
              <div
                className="mt-2 text-sm underline cursor-pointer"
                onClick={() => router.push('/categories')}
              >
                View Details
              </div>
            </div>

            <div className="bg-purple-600 text-white rounded-lg p-4 shadow">
              <div className="text-sm">Active Categories</div>
              <div className="text-3xl font-bold">{activeCategories.length}</div>
              <div
                className="mt-2 text-sm underline cursor-pointer"
                onClick={() => router.push('/categories')}
              >
                View Details
              </div>
            </div>

            <div className="bg-green-600 text-white rounded-lg p-4 shadow">
              <div className="text-sm">Total Notes</div>
              <div className="text-3xl font-bold">{entries.length}</div>
              <div
                className="mt-2 text-sm underline cursor-pointer"
                onClick={() => router.push('/notes')}
              >
                View Details
              </div>
            </div>

            <div className="bg-orange-600 text-white rounded-lg p-4 shadow">
              <div className="text-sm">Last Week Notes</div>
              <div className="text-3xl font-bold">{lastWeekNotes.length}</div>
              <div
                className="mt-2 text-sm underline cursor-pointer"
                onClick={() => router.push('/notes')}
              >
                View Details
              </div>
            </div>
          </div>

          {/* Table Slider Component */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Recently Added Notes</h2>
              <button
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Add Note
              </button>
            </div>

            {err && <p className="text-red-600 p-4">{err}</p>}

            <TableSlider
              entries={entries}
              entriesPerSlide={8}
              onEdit={(entry) => {
                setEditing(entry);
                setModalOpen(true);
              }}
              onDelete={(id) => {
                setDeleteId(id);
                setShowDeleteModal(true);
              }}
            />
          </div>

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-10 bg-black/10 flex items-center justify-center bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg w-80 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this note?</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (deleteId) {
                        await deleteEntry(deleteId);
                        setDeleteId(null);
                      }
                      setShowDeleteModal(false);
                    }}
                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit Modal */}
          <AddNoteModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditing(null);
            }}
            onSubmit={saveEntry}
            entry={editing}
            categories={activeCategories} // ✅ only active category names
          />

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
