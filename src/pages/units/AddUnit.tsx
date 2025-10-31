import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import * as Yup from "yup";
import { notify } from "../../utils/helpers";
import subjectsServices from "../subjects/service";
import lessonsServices from "../lessons/service";
import { Trash2 } from "lucide-react";
import unitsServices from "./service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { Comps } from "../../components";

const schema = Yup.object({
    title: Yup.string().required("Title is required"),
    lessonId: Yup.string().required("Lesson ID is required"),
    subjectId: Yup.string().required("Subject ID is required"),
    parts: Yup.array()
        .of(
            Yup.object({
                id: Yup.mixed().nullable(),
                title: Yup.string().optional(),
                content: Yup.string().required("Part content is required"),
                // audio: Yup.mixed().nullable().test(
                //     "fileSize",
                //     "The file is too large",
                //     value => {
                //         console.log(value, typeof value != 'string');

                //         return !value || (value && typeof value != 'string' && (value as any)?.size <= 10485760) // Max file size: 10MB
                //     }
                // ),
            })
        )
        .min(1, "At least one part is required"),
})

const initForm = {
    title: "", subjectId: null, lessonId: null, parts: [
        { id: null, title: "", content: "", audio: null }
    ]
}

const AddUnit = () => {
    const [selectedSubject, setSelectedSubject] = useState(0);
    const [formData, setFormData] = useState(initForm);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [deletedAudio, setDeletedAudio] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const loader = {
        set: () => setLoading(true),
        remove: () => setLoading(false),
    }

    const nav = useNavigate();
    let [searchParams] = useSearchParams();
    const unitId = searchParams.get("id") || null;

    useEffect(() => { getSubjects(); }, []);

    useEffect(() => { if (unitId) getUnitData(+unitId) }, []);

    const getUnitData = async (unitId: number) => {
        try {
            loader.set();
            const { data } = await unitsServices.getUnits({ no_pagination: true, unitId });
            if (data?.length) {
                const unit = data[0];
                setFormData(pre => ({ ...pre, title: unit?.title, audio: unit?.audio, parts: unit?.parts || [], lessonId:unit.lesson_id}));
            }
        } catch (err: any) {
            notify.error(err?.message);
        } finally {
            loader.remove();
        }
    }

    const getSubjects = async () => {
        try {
            loader.set();
            const { data } = await subjectsServices.getSubjects({ no_pagination: true });
            setSubjects(data || []);
            if (data.length) {
                const cur = data[0]?.id;
                setSelectedSubject(cur);
                setFormData(pre => ({ ...pre, subjectId: cur }));
                await getLessons(cur);
            }
        } catch (err: any) {
            notify.error(err?.message);
        } finally {
            loader.remove();
        }
    }

    const getLessons = async (subjectId: number) => {
        try {
            loader.set();
            if (!subjectId) { setLessons([]); return; }
            const { data } = await lessonsServices.getLessons({ no_pagination: true, subject: subjectId });
            setLessons(data);
            if (data.length && !unitId) {
                const cur = data[0]?.id;
                setFormData(pre => ({ ...pre, lessonId: cur }));
            }
        } catch (err: any) {
            notify.error(err?.message);
        } finally {
            loader.remove();
        }
    }

    const onSubmit = async (values: any) => {
        try {
            loader.set();
            const reqObj = { ...values };

            // Create FormData to handle the file upload
            const formData = new FormData();
            if (+unitId!) formData.append('id', unitId!);
            formData.append('title', reqObj.title);
            formData.append('lessonId', reqObj.lessonId);
            formData.append('subjectId', reqObj.subjectId);

            if (deletedAudio.length) {
                formData.append('deletedAudio', deletedAudio.join(','))
            }

            // Append parts and their respective audio files
            reqObj.parts.forEach((part: any, index: number) => {
                formData.append(`parts[${index}].title`, part.title);
                formData.append(`parts[${index}].content`, part.content);
                if (part.audio) {
                    formData.append(`parts[${index}].audio`, part.audio);
                }
            });

            // Send the form data to the backend
            const { message }: any = await unitsServices.addUnits(formData);  // Make sure your backend can handle FormData
            notify.success(message);
            nav(ROUTES.units);
        } catch (err: any) {
            notify.error(err?.message);
        } finally {
            loader.remove();
        }
    }

    return (
        <>
            {loading && <Comps.Loader />}
            <Formik
                initialValues={formData}
                validationSchema={schema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue }) => (
                    <Form className="space-y-4 bg-zinc-900 p-6 rounded-lg text-zinc-200">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1 text-zinc-200">Subject</label>
                                <select defaultValue={selectedSubject} onChange={(v) => getLessons(+v.target.value)} name="subjectId" className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
                                    {subjects.map(s => <option key={s.id} value={s.id} >{s.name}</option>)}
                                </select>
                                <ErrorMessage name="subjectId" component="div" className="text-xs text-red-500 mt-1" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1 text-zinc-200">Lesson</label>
                                <Field as="select" name="lessonId" className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
                                    {lessons.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                </Field>
                                <ErrorMessage name="lessonId" component="div" className="text-xs text-red-500 mt-1" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1 text-zinc-200">Unit Name</label>
                                <Field name="title" className="w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500" placeholder="eg. Noun" />
                                <ErrorMessage name="title" component="div" className="text-xs text-red-500 mt-1" />
                            </div>
                        </div>

                        <FieldArray name="parts">
                            {({ push, remove }) => (
                                <div className="space-y-4">
                                    {values.parts.map((_part, i) => (
                                        <div key={i} className="flex flex-col items-start gap-2">
                                            <div className="flex gap-3 w-full">
                                                <div className="flex-1">
                                                    <Field
                                                        name={`parts[${i}].title`}
                                                        placeholder={`Part ${i + 1} Title`}
                                                        className="w-full flex-1 border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                                                    />
                                                    <ErrorMessage
                                                        name={`parts[${i}].title`}
                                                        component="div"
                                                        className="text-red-500 text-sm mt-1"
                                                    />
                                                </div>
                                                {
                                                    i !== 0 &&
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(i)}
                                                        className="px-2 py-1 hover:bg-zinc-800 transition mt-2 md:mt-0"
                                                    >
                                                        <Trash2 />
                                                    </button>
                                                }
                                            </div>

                                            <Field
                                                as="textarea"
                                                name={`parts[${i}].content`}
                                                placeholder="Content"
                                                rows={3}
                                                className="w-full border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                                            />
                                            <ErrorMessage
                                                name={`parts[${i}].content`}
                                                component="div"
                                                className="text-red-500 text-sm mt-1"
                                            />

                                            {/* File Upload for Audio */}
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-zinc-200">Audio (optional)</label>
                                                {
                                                    !values.parts[i].audio ?
                                                        <input
                                                            type="file"
                                                            accept="audio/mp3, audio/wav, audio/ogg"
                                                            name={`parts[${i}].audio`}
                                                            onChange={(e) => {
                                                                const file = e.target.files ? e.target.files[0] : null;
                                                                setFieldValue(`parts[${i}].audio`, file);
                                                            }}
                                                            className="mt-2 w-full border border-zinc-700 rounded-md px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                                                        /> : <div className="mt-2 flex gap-2">
                                                            <p className="bg-zinc-800 p-2 rounded px-3">{
                                                                typeof values.parts[i].audio === 'string' ?
                                                                    (values.parts[i].audio as unknown as string)?.split("/").reverse()[0] :
                                                                    (values?.parts[i]?.audio as unknown as File)?.name
                                                            }</p>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setDeletedAudio(pre => ([...pre, values?.parts[i]?.audio as unknown as string]))
                                                                    setFieldValue(`parts[${i}].audio`, null);
                                                                }}
                                                                className="px-2 py-1 hover:bg-zinc-800 transition mt-2 md:mt-0"
                                                            >
                                                                <Trash2 />
                                                            </button>
                                                        </div>
                                                }
                                                <ErrorMessage
                                                    name={`parts[${i}].audio`}
                                                    component="div"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => push({ id: null, title: "", content: "", audio: null })}
                                        className="px-3 py-1 border rounded hover:bg-zinc-800 transition"
                                    >
                                        + Add Part
                                    </button>
                                </div>
                            )}
                        </FieldArray>

                        <div className="flex justify-end gap-3 mt-3">
                            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white transition">
                                Save
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default AddUnit
