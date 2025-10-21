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

const QuesForm = () => {
  const [optionImage, setOptionImage] = useState(false);

  const [filtersData, setFiltersData] = useState(initFiltersData);
  const [selectedDilters, setSelectedDilters] = useState(initSelectedFilters);

  const nav = useNavigate();

  useEffect(() => {
    getSubjects();
  }, []);

  const getSubjects = async () => {
    try {
      const { data } = await subjectsServices.getSubjects({ no_pagination: true });
      if (data.length) {
        setFiltersData(pre => ({ ...pre, subjects: data }));
        setSelectedDilters(pre => ({ ...pre, subjectId: data[0]?.id }));
        await getUnits(data[0]?.id);
      }
    } catch (err: any) {
      notify.error(err?.message)
    }
  }

  const getUnits = async (subjectId: number) => {
    try {
      if (!subjectId) return;
      const { data } = await unitsServices.getUnits({ no_pagination: true });
      if (data.length) {
        setFiltersData(pre => ({ ...pre, units: data.map((d: Unit) => ({ ...d, name: d.title })) }));
        setSelectedDilters(pre => ({ ...pre, unitId: data[0]?.id }));
        await getLessons(data[0].id);
      }
    } catch (err: any) {
      notify.error(err?.message)
    }
  }

  const getLessons = async (unitId: number) => {
    try {
      if (!unitId) return;
      const { data } = await lessonsServices.getLessons({ no_pagination: true });
      if (data.length) {
        setFiltersData(pre => ({ ...pre, lessons: data.map((d: Lesson) => ({ ...d, name: d.title })) }));
        setSelectedDilters(pre => ({ ...pre, lessonId: data[0]?.id }));
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

      const { message }: any = await questionsServices.addQuestion(formatedValues);
      notify.success(message)
      nav(ROUTES.questions)

    } catch (err: any) {
      notify.error(err?.message);
    }
  }

  const filtersList = [
    { label: "Subject", name: "subject", data: filtersData.subjects, onGet: () => { } },
    { label: "Unit", name: "unit", data: filtersData.units, onGet: () => { } },
    { label: "Lesson", name: "lesson", data: filtersData.lessons, onGet: () => { } }
  ];

  return (
    <Formik
      initialValues={{
        subject: selectedDilters.subjectId,
        unit: selectedDilters.unitId,
        lesson: selectedDilters.lessonId,
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
                <Field as="select" name={f.name} className="w-full border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring focus:ring-indigo-500">
                  <option value="">Select</option>
                  {f.data.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </Field>
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