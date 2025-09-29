"use client";
import { useState, useEffect } from "react";
import { Input, Table, Button, Modal, Select, message } from "antd";
import SideBar from "../components/SideBar";
import DeleteModal from "../components/DeleteModal";

const { Option } = Select;

const Categories = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategory, seteditCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // New state for Add Category
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addCategoryName, setAddCategoryName] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const base =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

      const res = await fetch(`${base}/entries/getCategory`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const grouped = data.reduce((acc, entry) => {
        const cat = entry.category || "Uncategorized";
        if (!acc[cat])
          acc[cat] = {
            total: 0,
            last: entry.updated_at,
            id: entry.id,
            status: entry.status,
          };
        acc[cat].total += 1;
        if (new Date(entry.updated_at) > new Date(acc[cat].last)) {
          acc[cat].last = entry.updated_at;
          acc[cat].id = entry.id;
          acc[cat].status = entry.status;
        }
        return acc;
      }, {});

      const formatted = Object.keys(grouped).map((name) => ({
        key: grouped[name].id,
        id: grouped[name].id,
        category: name,
        totalUsed: grouped[name].total,
        lastUpdate: new Date(grouped[name].last).toLocaleString(),
        status: grouped[name].status || "active",
      }));

      setCategoryList(formatted);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add Category
 const handleAddCategory = async () => {
  if (!addCategoryName.trim()) {
    message.error("Category name is required");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const base =
      process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

    const res = await fetch(`${base}/entries/categoryName`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: addCategoryName,   // ✅ backend ke schema ke hisaab se
        status: "active"             // optional
      }),
      credentials: "include",
    });

    if (!res.ok) throw new Error(await res.text());

    message.success("Category added successfully");
    setIsAddModalOpen(false);
    setAddCategoryName("");
    fetchCategories(); // refresh list
  } catch (err) {
    console.error("Add failed:", err);
    message.error("Failed to add category");
  }
};


  // Delete logic
  const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

    const res = await fetch(`${base}/entries/deletecategory/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });

    if (!res.ok) throw new Error(await res.text());

    setCategoryList((prev) => prev.filter((item) => item.id !== id));
    message.success("Category deleted");
    console.log(id);
    
  } catch (err) {
    console.error("Delete failed:", err);
    message.error("Failed to delete category");
  }
};


  // Save Edit
  const eidtCategory = async () => {
    if (!newCategoryName.trim()) {
      message.error("Category is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const base =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

      const res = await fetch(`${base}/entriescategory/${editCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ category: newCategoryName }),
      });

      if (!res.ok) throw new Error(await res.text());

      const updatedAt = new Date().toLocaleString();
      setCategoryList((prev) =>
        prev.map((item) =>
          item.id === editCategory.id
            ? { ...item, category: newCategoryName, lastUpdate: updatedAt }
            : item
        )
      );

      setIsEditModalOpen(false);
      seteditCategory(null);
      setNewCategoryName("");
      message.success("Category updated");
    } catch (err) {
      console.error("Update failed:", err);
      message.error("Failed to update");
    }
  };

  // Handle status change
  const handleStatusChange = async (record, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

      const res = await fetch(`${base}/entries/category/${record.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ category: record.category, status: newStatus}), 
      });
      
      
      if (!res.ok) throw new Error(await res.text());

      setCategoryList((prev) =>
        prev.map((item) =>
          item.id === record.id ? { ...item, status: newStatus } : item
        )
      );
      message.success("Status updated");
      console.log(record);
      
      
    } catch (err) {
      console.error("Status update failed:", err);
      message.error("Failed to update status");

    }
  };
  


  // Table columns
  const columns = [
    { title: "Name", dataIndex: "category", key: "category" },
    { title: "Total Used", dataIndex: "totalUsed", key: "totalUsed" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Select
          value={record.status}
          style={{ width: 100 }}
          onChange={(value) => handleStatusChange(record, value)}
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Disable</Option>
        </Select>
      ),
    },
    { title: "Last update", dataIndex: "lastUpdate", key: "lastUpdate" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="space-x-3">
          <Button
            size="small"
            onClick={() => {
              seteditCategory(record);
              setNewCategoryName(record.category);
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            onClick={() => {
              setDeleteId(record.id);
              setShowDeleteModal(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = categoryList.filter((c) =>
    c.category.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="bg-[url('/images/dashboard/dashboard_back.png')] bg-no-repeat bg-cover min-h-screen flex">
      <div className="min-h-screen w-64 bg-white shadow-lg">
        <SideBar />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search category..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-[250px]"
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add Category
          </button>
        </div>

        <div className="bg-white rounded-md shadow w-full">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>

      {/* Delete modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (deleteId) {
            await handleDelete(deleteId);
            setDeleteId(null);
          }
          setShowDeleteModal(false);
        }}
      />

      {/* Edit modal */}
      <Modal
        title="Edit Category"
        open={isEditModalOpen}
        onOk={eidtCategory}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Save"
      >
        <Input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      </Modal>

      {/* Add Category modal */}
      <Modal
        title="Add New Category"
        open={isAddModalOpen}
        onOk={handleAddCategory}
        onCancel={() => setIsAddModalOpen(false)}
        okText="Add"
      >
        <Input
          placeholder="Enter category name"
          value={addCategoryName}
          onChange={(e) => setAddCategoryName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Categories;
