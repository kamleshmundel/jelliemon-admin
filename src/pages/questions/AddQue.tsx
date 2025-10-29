import { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
// import * as Yup from "yup";
import DragDropImage from "./DragDrop";
import { Trash2 } from "lucide-react";
import { notify } from "../../utils/helpers";
import subjectsServices from "../subjects/service";
import unitsServices from "../units/service";
import lessonsServices from "../lessons/service";
import questionsServices from "./service";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

// const schema = Yup.object({
//   subject: Yup.string().required(),
//   unit: Yup.string().required(),
//   lesson: Yup.string().required(),
//   title: Yup.string().required(),
//   type: Yup.string().required(),
//   content: Yup.string().required(),
//   options: Yup.array().of(Yup.object({ text: Yup.string().required() })),
//   correct: Yup.array().min(1).required(),
// });

const initFiltersData: InitFiltersData = { subjects: [], units: [], lessons: [] };
const initSelectedFilters = { subjectId: 0, unitId: 0, lessonId: 0 };

type Answer = { text: string; is_correct: boolean; image: string; }

const QuesForm = () => {
  const [optionImage, setOptionImage] = useState(false);

  const [filtersData, setFiltersData] = useState(initFiltersData);
  const [selectedFilters, setSelectedFilters] = useState(initSelectedFilters);

  const nav = useNavigate();

  // useEffect(() => { getSubjects(); }, []);

  useEffect(() => { getSubjects(); }, []);
  useEffect(() => { if (selectedFilters.subjectId) getLessons(selectedFilters.subjectId); }, [selectedFilters.subjectId]);
  useEffect(() => { if (selectedFilters.lessonId) getUnits(selectedFilters.lessonId); }, [selectedFilters.lessonId]);

  const getSubjects = async () => {
    try {
      const { data } = await subjectsServices.getSubjects({ no_pagination: true });
      if (data.length) {
        setFiltersData(pre => ({ ...pre, subjects: data }));
        setSelectedFilters(pre => ({ ...pre, subjectId: data[0]?.id }));
      }
    } catch (err: any) {
      notify.error(err?.message)
    }
  }

  const getLessons = async (subjectId: number) => {
    try {
      if (!subjectId) return;
      const { data } = await lessonsServices.getLessons({ no_pagination: true, subject: subjectId });
      if (data.length) {
        setFiltersData(pre => ({ ...pre, lessons: data.map((d: Lesson) => ({ ...d, name: d.title })) }));
        setSelectedFilters(pre => ({ ...pre, lessonId: data[0]?.id }));
      }
    } catch (err: any) {
      notify.error(err?.message)
    }
  }

  const getUnits = async (lessonId: number) => {
    try {
      if (!lessonId) return;
      const { data } = await unitsServices.getUnits({ no_pagination: true, lessonId });
      if (data.length) {
        setFiltersData(pre => ({ ...pre, units: data.map((d: Unit) => ({ ...d, name: d.title })) }));
        setSelectedFilters(pre => ({ ...pre, unitId: data[0]?.id }));
        // await getLessons(data[0].id);
      }
    } catch (err: any) {
      notify.error(err?.message)
    }
  }

  const onSubmit = async (values: any) => {
    try {

      const formatedValues = {
        ...values,
        options: values?.options?.map((v: QueOption) => {
          if (!optionImage) v.image = null
          return v
        }),
        optionImage
      }


const formData = new FormData()

formData.append('unit', values.unit)
formData.append('title', values.title)
formData.append('content', values.content)
formData.append('type', values.type)
if (values.asset) formData.append('asset', values.asset)
formData.append('optionImage', formatedValues.optionImage)
formData.append('hint', values.hint)

formatedValues.options.forEach((opt: Answer, i: number) => {
  formData.append(`options[${i}][text]`, opt.text || '')
  formData.append(`options[${i}][is_correct]`, opt.is_correct ? 'true' : 'false')
  if (opt.image) formData.append(`options[${i}][image]`, opt.image)
})




      

      const { message }: any = await questionsServices.addQuestion(formatedValues);
      notify.success(message)
      nav(ROUTES.questions)

    } catch (err: any) {
      notify.error(err?.message);
    }
  }

  const filtersList = [
    { label: "Subject", name: "subject", dVal: selectedFilters.subjectId, data: filtersData.subjects, onGet: (v: number) => setSelectedFilters(pre => ({...pre, subjectId: v})) },
    { label: "Lesson", name: "lesson", dVal: selectedFilters.lessonId, data: filtersData.lessons, onGet: (v: number) => setSelectedFilters(pre => ({...pre, lessonId: v})) },
    { label: "Unit", name: "unit", dVal: selectedFilters.unitId, data: filtersData.units, onGet: (v: number) => setSelectedFilters(pre => ({...pre, unitId: v})) },
  ];

  return (
    <Formik
      initialValues={{
        subject: selectedFilters.subjectId,
        unit: selectedFilters.unitId,
        lesson: selectedFilters.lessonId,
        title: "",
        type: "ssl",
        content: "",
        asset: null,
        options: [{ text: "", is_correct: false, image: null }],
        correct: [],
        hint: "",
      }}
      // validationSchema={schema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-4 bg-zinc-900 p-6 rounded-lg text-zinc-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtersList.map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium mb-1">{f.label}</label>
                <select value={f.dVal} onChange={(e) => f.onGet(+e.target.value)} name={f.name} className="w-full border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
                  <option value="">Select</option>
                  {f.data.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Question Title</label>
            <Field name="title" className="w-full border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter question title" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Question Type</label>
            <Field as="select" name="type" className="w-full border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
              <option value="ssl">Single Selection</option>
              <option value="mcq">Multiple Selection</option>
              <option value="true_false">True/False</option>
            </Field>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Question Content</label>
            <Field as="textarea" name="content" rows={3} className="w-full border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500" />
          </div>

          <DragDropImage onFileSelect={(file: any) => setFieldValue("asset", file)} />

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Option Image</label>
            <input type="checkbox" checked={optionImage} onChange={() => setOptionImage(!optionImage)} />
          </div>

          <FieldArray name="options">
            {({ push, remove }) => (
              <div className="space-y-4">
                {values.options.map((opt, i) => (
                  <div key={i} className="flex flex-col items-start gap-2">
                    <div className="flex gap-3 w-full">
                      <input
                        type={values.type === "ssl" ? "radio" : "checkbox"}
                        name={`options[${i}].is_correct`}
                        checked={opt.is_correct}
                        onChange={() => {
                          if (values.type === "ssl")
                            values.options.forEach((_, idx) => setFieldValue(`options[${idx}].is_correct`, idx === i));
                          else setFieldValue(`options[${i}].is_correct`, !opt.is_correct);
                        }}
                        className="accent-indigo-500 mt-2 w-6 h-6"
                      />

                      <Field
                        name={`options[${i}].text`}
                        placeholder={`Option ${i + 1}`}
                        className="flex-1 border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                      />

                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="px-2 py-1 hover:bg-zinc-800 transition mt-2 md:mt-0"
                      >
                        <Trash2 />
                      </button>
                    </div>

                    {optionImage && (
                      <div className="w-full px-9">
                        <DragDropImage onFileSelect={(file: File) => setFieldValue(`options[${i}].image`, file)} />
                        {opt.image && (
                          <div className="mt-1 text-xs text-zinc-400 truncate">
                            {(opt.image as File).name}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => push({ text: "", is_correct: false, image: null })}
                  className="px-3 py-1 border rounded hover:bg-zinc-800 transition"
                >
                  + Add Option
                </button>
              </div>
            )}
          </FieldArray>



          <div>
            <label className="block text-sm font-medium mb-1">Hint</label>
            <Field name="hint" className="w-full border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Optional hint" />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white transition">Save Question</button>
          </div>
        </Form>
      )}
    </Formik>

  );
}

export default QuesForm