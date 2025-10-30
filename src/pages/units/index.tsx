import { useEffect, useState } from "react";
import { Trash2, Edit2 } from "lucide-react";
import subjectsServices from "../subjects/service";
import { notify } from "../../utils/helpers";
import { Comps } from "../../components";
import unitsServices from "./service";
import lessonsServices from "../lessons/service";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";


const initPageObj = { page: 1, total: 0, };

export default function Units() {
    const [units, setUnits] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<number>(0);
    const [selectedLesson, setSelectedLesson] = useState<number>(0);

    const nav = useNavigate();

    const [pageObj, setPageObj] = useState(initPageObj);
    const perPage = 15;

    useEffect(() => {
        getSubjects();
    }, []);

    useEffect(() => {
        getUnits(pageObj.page);
    }, [pageObj.page, selectedLesson]);

    const getSubjects = async () => {
        try {
            const reqObj = { no_pagination: true };
            const { data } = await subjectsServices.getSubjects(reqObj);
            setSubjects(data);
            setSelectedSubject(data[0]?.id);
            await getLessons(data[0]?.id);
        } catch (err: any) {
            notify.error(err?.message)
        }
    }

    const getLessons = async (subjectId: number) => {
        try {
            const reqObj = { no_pagination: true, subject: subjectId };
            const { data } = await lessonsServices.getLessons(reqObj);
            setLessons(data);
            setSelectedLesson(data[0]?.id);
        } catch (err: any) {
            notify.error(err?.message)
        }
    }

    const getUnits = async (page: number) => {
        try {
            if (!selectedLesson) { setUnits([]); return; }
            const reqObj = { page, lessonId: selectedLesson, page_size: perPage };
            const { data } = await unitsServices.getUnits(reqObj);
            setUnits(data.results)
            setPageObj(pre => ({ ...pre, total: data.count }))
        } catch (err: any) {
            notify.error(err?.message)
        }
    }

    const onSubChange = (subjectId: number) => {
        setSelectedSubject(Number(subjectId));
        getLessons(subjectId);
        setPageObj(initPageObj);
    }

    const onDelete = async (id: number) => {
        try {
            if(confirm("Are you sure?")) {
                const { message }: any = await unitsServices.deleteUnit({id});
                if(pageObj.page !== 1) setPageObj(initPageObj);
                else getUnits(1);
                notify.success(message);
            }
        } catch(err: any) {
            notify.error(err?.message);
        }
    }

    return (
        <div className="p-4 min-h-screen text-zinc-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Units</h2>
                <button onClick={() => nav(ROUTES.unitAddEdit)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition">
                    Add Unit
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block mb-1 font-medium text-zinc-200">Select Subject</label>
                    <select value={selectedSubject} onChange={e => onSubChange(Number(e.target.value))} className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-zinc-200">Select Lesson</label>
                    <select value={selectedLesson} onChange={e => setSelectedLesson(Number(e.target.value))} className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
                        {lessons.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
                    </select>
                </div>
            </div>

            <table className="min-w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <thead className="bg-zinc-800 text-zinc-400">
                    <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Parts</th>
                        <th className="px-4 py-3 text-left">Audio</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {units.map(l => (
                        <tr key={l.id} className="border-t border-zinc-800 hover:bg-zinc-800 transition">
                            <td className="px-4 py-2">{l.id}</td>
                            <td className="px-4 py-2">{l.title}</td>
                            <td className="px-4 py-2">{l?.parts?.length || 0}</td>
                            <td className="px-4 py-2">{l?.parts.map(p => {
                                return p.audio.split('/').reverse()[0];
                            }).join(', ') || '-'}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button onClick={() => onDelete(l.id)} className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition">
                                    <Trash2 size={16} /> Delete
                                </button>
                                <button onClick={() => nav(ROUTES.unitAddEdit+`?id=${l.id}`)} className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm transition">
                                    <Edit2 size={16} /> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Comps.Pagination total={pageObj.total} page={pageObj.page} perPage={perPage} setPage={page => setPageObj(pre => ({ ...pre, page }))} />
        </div>

    )
}
