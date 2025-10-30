import { useEffect, useState } from "react";
import { Trash2, Edit2 } from "lucide-react";
import subjectsServices from "../subjects/service";
import unitsServices from "../units/service";
import { notify } from "../../utils/helpers";
import { Comps } from "../../components";
import { useNavigate } from "react-router-dom";
import { quetype, ROUTES } from "../../utils/constants";
import lessonsServices from "../lessons/service";
import questionsServices from "./service";

const initPageObj = { page: 1, total: 0 };

export default function LessonsTab() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  const [selectedSubject, setSelectedSubject] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<number>(0);
  const [selectedLesson, setSelectedLesson] = useState<number>(0);

  const [questions, setQuestions] = useState<Question[]>([]);

  const [pageObj, setPageObj] = useState(initPageObj);
  const perPage = 10;

  const [loading, setLoading] = useState(false);
  const loader = {
    set: () => setLoading(true),
    remove: () => setLoading(false),
  }

  const nav = useNavigate();

  useEffect(() => { getSubjects(); }, []);
  useEffect(() => { if (selectedSubject) getLessons(selectedSubject); }, [selectedSubject]);
  useEffect(() => { if (selectedLesson) getUnits(selectedLesson); }, [selectedLesson]);
  useEffect(() => { if (selectedUnit) getQuestions(selectedUnit, pageObj.page); }, [selectedUnit, pageObj.page]);

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

  const getUnits = async (lessonId: number) => {
    try {
      loader.set();
      const { data } = await unitsServices.getUnits({ lessonId, no_pagination: true });
      setUnits(data);
      if (data.length) setSelectedUnit(data[0].id);
    } catch (err: any) { notify.error(err?.message); } finally {
      loader.remove();
    }
  };

  const getLessons = async (selectedSubject: number) => {
    try {
      loader.set();
      const { data } = await lessonsServices.getLessons({ no_pagination: true, subject: selectedSubject });
      setLessons(data);
      if (data.length) setSelectedLesson(data[0].id);
    } catch (err: any) { notify.error(err?.message); } finally {
      loader.remove();
    }
  };

  const getQuestions = async (unit_id: number, page: number = 1) => {
    try {
      loader.set();
      const reqObj = { unit_id, page, page_size: perPage };
      const { data } = await questionsServices.getQuestions(reqObj);
      setQuestions(data?.results || [])
      setPageObj(pre => ({ ...pre, total: data.count }));
    } catch (err: any) {
      notify.error(err?.message)
    } finally {
      loader.remove();
    }
  }

  const onDelete = async (id: number) => {
    try {
      if (confirm("Are you sure?")) {
        loader.set();
        const { message }: any = await questionsServices.deleteQuestion({ id });
        notify.success(message);

        if(pageObj.page === 1) getQuestions(selectedUnit);
        else setPageObj(initPageObj);
      }
    } catch (err: any) {
      notify.error(err?.message);
    } finally {
      loader.remove();
    }
  }

  const onAddEdit = (id?: number) => {
    nav(ROUTES.queAddEdit + `${id ? `?id=${id}` : ""}`)
  }

  return (
    <>
      {loading && <Comps.Loader />}
      <div className="p-4 min-h-screen text-zinc-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Questions</h2>
          <button onClick={() => onAddEdit()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition">
            Add Question
          </button>
        </div>

        <div className="grid grid-cols-3  gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium text-zinc-200">Select Subject</label>
            <select value={selectedSubject} onChange={e => { setSelectedSubject(Number(e.target.value)); setSelectedLesson(0); }} className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-zinc-200">Select Lesson</label>
            <select value={selectedLesson} onChange={e => setSelectedLesson(Number(e.target.value))} className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
              {lessons.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-zinc-200">Select Unit</label>
            <select value={selectedUnit} onChange={e => setSelectedUnit(Number(e.target.value))} className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
              {units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
            </select>
          </div>
        </div>

        <table className="min-w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <thead className="bg-zinc-800 text-zinc-400">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Content</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(l => (
              <tr key={l.id} className="border-t border-zinc-800 hover:bg-zinc-800 transition">
                <td className="px-4 py-2">{l.id}</td>
                <td className="px-4 py-2">{l.title}</td>
                <td className="px-4 py-2">{quetype[l.type] || "-"}</td>
                <td className="px-4 py-2">{l.content || "-"}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => onDelete(l.id)} className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition">
                    <Trash2 size={16} /> Delete
                  </button>
                  <button onClick={() => onAddEdit(l.id)} className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm transition">
                    <Edit2 size={16} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Comps.Pagination total={pageObj.total} page={pageObj.page} perPage={perPage} setPage={p => setPageObj(pre => ({ ...pre, page: p }))} />
      </div>
    </>

  );
}
