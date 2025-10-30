import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Trash2, Edit2, X } from "lucide-react";
import subjectsServices from "../subjects/service";
import lessonsServices from "./service";
import { notify } from "../../utils/helpers";
import { Comps } from "../../components";

const initPageObj = { page: 1, total: 0 };
const schema = Yup.object({ title: Yup.string().required(), subjectId: Yup.number().required() });

export default function LessonsTab() {
    const [lessons, setLessons] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [modalLesson, setModalLesson] = useState<any>(null);
    const [selectedSubject, setSelectedSubject] = useState<number>(0);
    const [pageObj, setPageObj] = useState(initPageObj);
    const perPage = 15;

    const [loading, setLoading] = useState(false);
    const loader = {
        set: () => setLoading(true),
        remove: () => setLoading(false),
    }

    useEffect(() => { getSubjects(); }, []);
    useEffect(() => { getLessons(pageObj.page); }, [pageObj.page, selectedSubject]);

    const getSubjects = async () => {
        try {
            loader.set();
            const { data } = await subjectsServices.getSubjects({ no_pagination: true });
            setSubjects(data);
            if (data.length) setSelectedSubject(data[0].id);
        } catch (err: any) { notify.error(err?.message); } finally {
            loader.remove();
        }
    };

    const getLessons = async (page: number) => {
        try {
            if (!selectedSubject) return;
            loader.set();
            const reqObj = { subject: selectedSubject, page, page_size: perPage };
            const { data } = await lessonsServices.getLessons(reqObj);
            setLessons(data.results);
            setPageObj(pre => ({ ...pre, total: data.count }));
        } catch (err: any) { notify.error(err?.message); } finally {
            loader.remove();
        }
    };

    const onSubmit = async (values: any) => {
        try {
            loader.set();
            const reqObj = modalLesson?.id ? { id: modalLesson?.id, ...values } : values;
            await lessonsServices.addLessons(reqObj);
            setModalLesson(null);
            getLessons(1);
        } catch (err: any) {
            notify.error(err?.message);
        } finally {
            loader.remove();
        }
    };

    const onDelete = async (id: number) => {
        try {
            if (confirm("Are you sure?")) {
                loader.set();
                const { message }: any = await lessonsServices.deleteLessons({ id });
                notify.success(message);
            }
        } catch (err: any) {
            notify.error(err?.message);
        } finally {
            loader.remove();
        }
    }

    return (
        <>
            {loading && <Comps.Loader />}
            <div className="p-4 min-h-screen text-zinc-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">Lessons</h2>
                    <button onClick={() => setModalLesson({ subjectId: selectedSubject })} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition">
                        Add Lesson
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 font-medium text-zinc-200">Select Subject</label>
                        <select value={selectedSubject} onChange={e => setSelectedSubject(Number(e.target.value))} className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <table className="min-w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                    <thead className="bg-zinc-800 text-zinc-400">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Lesson</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessons.map(l => (
                            <tr key={l.id} className="border-t border-zinc-800 hover:bg-zinc-800 transition">
                                <td className="px-4 py-2">{l.id}</td>
                                <td className="px-4 py-2">{l.title}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button onClick={() => onDelete(l.id)} className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition">
                                        <Trash2 size={16} /> Delete
                                    </button>
                                    <button onClick={() => setModalLesson(l)} className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm transition">
                                        <Edit2 size={16} /> Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Comps.Pagination total={pageObj.total} page={pageObj.page} perPage={perPage} setPage={p => setPageObj(pre => ({ ...pre, page: p }))} />

                {modalLesson && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                        <div className="bg-zinc-900 rounded-lg w-full max-w-md p-6 relative shadow-lg shadow-black/50">
                            <button onClick={() => setModalLesson(null)} className="absolute top-3 right-3 text-zinc-400 hover:text-white">
                                <X size={18} />
                            </button>
                            <h3 className="text-lg font-medium mb-4 text-white">{modalLesson.id ? "Edit Lesson" : "Add Lesson"}</h3>
                            <Formik initialValues={{ title: modalLesson.title || "", subjectId: modalLesson.subjectId || selectedSubject }} validationSchema={schema} onSubmit={onSubmit}>
                                <Form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-zinc-200">Subject</label>
                                        <Field as="select" name="subjectId" className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
                                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </Field>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-zinc-200">Lesson Name</label>
                                        <Field name="title" className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter lesson name" />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-3">
                                        <button type="button" onClick={() => setModalLesson(null)} className="px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800 transition">
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
        </>

    );
}
