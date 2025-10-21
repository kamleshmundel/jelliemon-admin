import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Trash2, Edit2, X } from "lucide-react";
import { notify } from "../../utils/helpers";
import subjectsServices from "./service";
import { Comps } from "../../components";

const schema = Yup.object({ name: Yup.string().required(), board: Yup.string().required() });

const initPageObj = { page: 1, total: 0, };

export default function SubjectsTab() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [modalSubject, setModalSubject] = useState<any>(null);
    const [pageObj, setPageObj] = useState(initPageObj);
    const perPage = 15;

    useEffect(() => {
        getSubjects(pageObj.page);
    }, [pageObj.page]);

    const getSubjects = async (page: number) => {
        try {
            const reqObj = { page, page_size: perPage };
            const { data } = await subjectsServices.getSubjects(reqObj);
            setSubjects(data.results)
            setPageObj(pre => ({ ...pre, total: data.count }))
        } catch (err: any) {
            notify.error(err?.message)
        }
    }

    const onSubmit = async (values: any) => {
        try {
            const reqObj = modalSubject && modalSubject.id ? { id: modalSubject.id, ...values } : values;
            await subjectsServices.addSubjects(reqObj);
            setModalSubject(null);
            getSubjects(1);
        } catch (err: any) {
            notify.error(err?.message)
        }
    }

    const handleDelete = (id: number) => { if (confirm("Are you sure?")) setSubjects(s => s.filter(x => x.id !== id)); };

    return (
        <div className="p-4 min-h-screen text-zinc-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Subjects</h2>
                <button onClick={() => setModalSubject({})} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition">
                    Add Subject
                </button>
            </div>
            <table className="min-w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <thead className="bg-zinc-800 text-zinc-400">
                    <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Board</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map(s => (
                        <tr key={s.id} className="border-t border-zinc-800 hover:bg-zinc-800 transition">
                            <td className="px-4 py-2">{s.id}</td>
                            <td className="px-4 py-2">{s.name}</td>
                            <td className="px-4 py-2">{s.board}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button onClick={() => handleDelete(s.id)} className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition">
                                    <Trash2 size={16} /> Delete
                                </button>
                                <button onClick={() => setModalSubject(s)} className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm transition">
                                    <Edit2 size={16} /> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Comps.Pagination total={pageObj.total} page={pageObj.page} perPage={perPage} setPage={page => setPageObj(pre => ({ ...pre, page }))} />
            {modalSubject !== null && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 rounded-lg w-full max-w-md p-6 relative shadow-lg shadow-black/50">
                        <button onClick={() => setModalSubject(null)} className="absolute top-3 right-3 text-zinc-400 hover:text-white">
                            <X size={18} />
                        </button>
                        <h3 className="text-lg font-medium mb-4 text-white">{modalSubject.id ? "Edit Subject" : "Add Subject"}</h3>
                        <Formik
                            initialValues={{ name: modalSubject.name || "", board: modalSubject.board || "" }}
                            validationSchema={schema}
                            onSubmit={onSubmit}
                        >
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-zinc-200">Name</label>
                                    <Field name="name" className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500" placeholder="eg. English" />
                                    <ErrorMessage name="name" component="div" className="text-xs text-red-500 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-zinc-200">Board</label>
                                    <Field as="select" name="board" className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
                                        <option value="">Select Board</option>
                                        <option value="CBSE">CBSE</option>
                                        <option value="ICSE">ICSE</option>
                                        <option value="State">State</option>
                                    </Field>
                                    <ErrorMessage name="board" component="div" className="text-xs text-red-500 mt-1" />
                                </div>
                                <div className="flex justify-end gap-3 mt-3">
                                    <button type="button" onClick={() => setModalSubject(null)} className="px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800 transition">
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
