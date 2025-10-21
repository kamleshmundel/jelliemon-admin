import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Trash2, Edit2, UserX, X } from "lucide-react";

const dummyUsers = [
    { id: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14", name: "John Doe", email: "john@example.com", location: "USA", language: "EN", lastLogin: "2025-10-20 10:00", lastLogout: "2025-10-20 18:00" },
    { id: "n1o2p3q4-r5s6-7t8u-9v10-w11x12y13z14", name: "Lisa Ray", email: "lisa@example.com", location: "UK", language: "EN", lastLogin: "2025-10-19 09:30", lastLogout: "2025-10-19 17:30" }
];

export default function UsersTab() {
    const [users, setUsers] = useState(dummyUsers);
    const [modalUser, setModalUser] = useState<any>(null);

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) setUsers(u => u.filter(x => x.id !== id));
    };

    const handleDeactivate = (_id: string) => {
        if (window.confirm("Are you sure you want to deactivate this user?")) alert("User deactivated");
    };

    const schema = Yup.object({ name: Yup.string().required(), email: Yup.string().email().required(), location: Yup.string().required(), language: Yup.string().required() });

    return (
        <div className="p-4 min-h-screen text-zinc-200">
            <h2 className="text-2xl font-semibold mb-4 text-white">Users</h2>
            <table className="min-w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <thead className="bg-zinc-800 text-zinc-400">
                    <tr>
                        <th className="px-4 py-3 text-left">UUID</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Location</th>
                        <th className="px-4 py-3 text-left">Language</th>
                        <th className="px-4 py-3 text-left">Last Login</th>
                        <th className="px-4 py-3 text-left">Last Logout</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="border-t border-zinc-800 hover:bg-zinc-800 transition">
                            <td className="px-4 py-2">{u.id}</td>
                            <td className="px-4 py-2">{u.name}</td>
                            <td className="px-4 py-2">{u.email}</td>
                            <td className="px-4 py-2">{u.location}</td>
                            <td className="px-4 py-2">{u.language}</td>
                            <td className="px-4 py-2">{u.lastLogin}</td>
                            <td className="px-4 py-2">{u.lastLogout}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button onClick={() => handleDelete(u.id)} className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition">
                                    <Trash2 size={16} /> Delete
                                </button>
                                <button onClick={() => handleDeactivate(u.id)} className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-white text-sm transition">
                                    <UserX size={16} /> Deactivate
                                </button>
                                <button onClick={() => setModalUser(u)} className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm transition">
                                    <Edit2 size={16} /> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalUser && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 rounded-lg w-full max-w-md p-6 relative shadow-lg shadow-black/50">
                        <button onClick={() => setModalUser(null)} className="absolute top-3 right-3 text-zinc-400 hover:text-white">
                            <X size={18} />
                        </button>
                        <h3 className="text-lg font-medium mb-4 text-white">Edit User</h3>
                        <Formik
                            initialValues={{ name: modalUser.name, email: modalUser.email, location: modalUser.location, language: modalUser.language }}
                            validationSchema={schema}
                            onSubmit={v => {
                                setUsers(u => u.map(x => x.id === modalUser.id ? { ...x, ...v } : x));
                                setModalUser(null);
                            }}
                        >
                            <Form className="space-y-4">
                                {["name", "email", "location", "language"].map(field => (
                                    <div key={field}>
                                        <label className="block text-sm font-medium mb-1 text-zinc-200">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                        <Field name={field} className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500" />
                                    </div>
                                ))}
                                <div className="flex justify-end gap-3 mt-3">
                                    <button type="button" onClick={() => setModalUser(null)} className="px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800 transition">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white transition">
                                        Save
                                    </button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            )}
        </div>

    )
}
