import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Trash2, Edit2, X } from "lucide-react";
import subjectsServices from "../subjects/service";
import { notify } from "../../utils/helpers";
import { Comps } from "../../components";
import unitsServices from "./service";

const schema = Yup.object({ subjectId: Yup.number().required(), title: Yup.string().trim().required() });

const initPageObj = { page: 1, total: 0, };

export default function Units() {
    const [units, setUnits] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [modalUnit, setModalUnit] = useState<any>(null);
    const [selectedSubject, setSelectedSubject] = useState<number>(0);

    const [pageObj, setPageObj] = useState(initPageObj);
    const perPage = 15;

    useEffect(() => {
        getSubjects();
    }, []);

    useEffect(() => {
        getUnits(pageObj.page);
    }, [pageObj.page, selectedSubject]);

    const getSubjects = async () => {
        try {
            const reqObj = { no_pagination: true };
            const { data } = await subjectsServices.getSubjects(reqObj);
            setSubjects(data);
            setSelectedSubject(data[0]?.id);
        } catch (err: any) {
            notify.error(err?.message)
        }
    }

    const getUnits = async (page: number) => {
        try {
            if (!selectedSubject) return;
            const reqObj = { page, subjectId: selectedSubject, page_size: perPage };
            const { data } = await unitsServices.getUnits(reqObj);
            setUnits(data.results)
            setPageObj(pre => ({ ...pre, total: data.count }))
        } catch (err: any) {
            notify.error(err?.message)
        }
    }

    const onSubmit = async (values: any) => {
        try {
            const reqObj = { ...values };
            await unitsServices.addUnits(reqObj);
            setModalUnit(null);
            getUnits(1);
        } catch (err: any) {
            notify.error(err?.message)
        }
    }

    const onSubChange = (subjectId: number) => {
        setSelectedSubject(Number(subjectId))
        setPageObj(initPageObj);
    }

    return (
        <div className="p-4 min-h-screen text-zinc-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Units</h2>
                <button onClick={() => setModalUnit({ subjectId: selectedSubject })} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition">
                    Add Unit
                </button>
            </div>

            <div className="mb-4">
                <label className="block mb-1 font-medium text-zinc-200">Select Subject</label>
                <select value={selectedSubject as number} onChange={e => onSubChange(Number(e.target.value))} className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
                    {subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            <table className="min-w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <thead className="bg-zinc-800 text-zinc-400">
                    <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {units.map(l => (
                        <tr key={l.id} className="border-t border-zinc-800 hover:bg-zinc-800 transition">
                            <td className="px-4 py-2">{l.id}</td>
                            <td className="px-4 py-2">{l.title}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button onClick={() => setUnits(ls => ls.filter(x => x.id !== l.id))} className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition">
                                    <Trash2 size={16} /> Delete
                                </button>
                                <button onClick={() => setModalUnit(l)} className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm transition">
                                    <Edit2 size={16} /> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Comps.Pagination total={pageObj.total} page={pageObj.page} perPage={perPage} setPage={page => setPageObj(pre => ({ ...pre, page }))} />

            {modalUnit !== null && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 rounded-lg w-full max-w-md p-6 relative shadow-lg shadow-black/50">
                        <button onClick={() => setModalUnit(null)} className="absolute top-3 right-3 text-zinc-400 hover:text-white">
                            <X size={18} />
                        </button>
                        <h3 className="text-lg font-medium mb-4 text-white">{modalUnit.id ? "Edit Unit" : "Add Unit"}</h3>
                        <Formik
                            initialValues={{ title: modalUnit.title || "", subjectId: modalUnit.subjectId || selectedSubject }}
                            validationSchema={schema}
                            onSubmit={onSubmit}
                        >
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-zinc-200">Subject</label>
                                    <Field as="select" name="subjectId" className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </Field>
                                    <ErrorMessage name="subjectId" component="div" className="text-xs text-red-500 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-zinc-200">Unit Name</label>
                                    <Field name="title" className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500" placeholder="eg. Noun" />
                                    <ErrorMessage name="title" component="div" className="text-xs text-red-500 mt-1" />
                                </div>
                                <div className="flex justify-end gap-3 mt-3">
                                    <button type="button" onClick={() => setModalUnit(null)} className="px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800 transition">
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
