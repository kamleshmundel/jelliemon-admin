import { useState } from "react";
import { Upload, Trash2, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { notify } from "../../utils/helpers";
import uploadServices from "./service";

interface UploadSectionProps {
  title: string;
  type: string;
}

const UploadSection: React.FC<UploadSectionProps> = ({ title, type }) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: any) => {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith(".xlsx")) {
      setFile(f);
      setError(null);
    } else {
      setFile(null);
      setError("Please upload a valid .xlsx sheet file");
    }
  };

  const handleDelete = () => {
    setFile(null);
    setData([]);
    setError(null);
  };

  const handleLoadData = async () => {
    if (!file) return;
    setError(null);
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (type === "subjects") {
      const validBoards = ["RBSE", "CBSE", "IBSE"];
      const requiredCols = ["Name", "Board"];
      const keys = Object.keys(json[0] || {});

      if (keys.length !== 2 || !requiredCols.every((k) => keys.includes(k))) {
        setError(
          "Invalid structure: Sheet must contain exactly 2 columns — Name and Board."
        );
        setData([]);
        return;
      }

      const invalidRows = (json as any[]).filter(
        (r) => !r.Name || !validBoards.includes(r.Board)
      );

      if (invalidRows.length) {
        setError(
          `Invalid data: Board must be one of ${validBoards.join(
            ", "
          )} and Name cannot be empty.`
        );
        setData([]);
        return;
      }
    } else if (type === "lessons") {
      const requiredCols = ["SubjectID", "Name"];
      const keys = Object.keys(json[0] || {});

      if (keys.length !== 2 || !requiredCols.every((k) => keys.includes(k))) {
        setError(
          "Invalid structure: Sheet must contain exactly 2 columns — SubjectID and Name."
        );
        setData([]);
        return;
      }

      const invalidRows = (json as any[]).filter(
        (r) => !r.SubjectID || !r.Name
      );
      if (invalidRows.length) {
        setError(
          "Invalid data: Both SubjectID and Name are required for all rows."
        );
        setData([]);
        return;
      }
    } else if (type === "units") {
      const requiredCols = [
        "Title",
        "SubjectID",
        "LessonId",
        "PartTitle",
        "PartContent",
      ];
      const keys = Object.keys(json[0] || {});

      if (
        keys.length !== requiredCols.length ||
        !requiredCols.every((k) => keys.includes(k))
      ) {
        setError(
          "Invalid structure: Sheet must contain exactly 5 columns — Title, SubjectID, LessonId, PartTitle, and PartContent."
        );
        setData([]);
        return;
      }

      const invalidRows = (json as any[]).filter(
        (r) =>
          !r.Title ||
          !r.SubjectID ||
          !r.LessonId ||
          !r.PartTitle ||
          !r.PartContent
      );
      if (invalidRows.length) {
        setError(
          "Invalid data: All columns (Title, SubjectID, LessonId, PartTitle, PartContent) are required for each row."
        );
        setData([]);
        return;
      }
    }

    setData(json);
  };

  const uploadData = async () => {
    try {
      if (!data.length) return;

      if (type === "subjects")
        data.forEach(async (d) => {
          const reqObj = { name: d?.Name, board: d?.Board };
          await uploadServices.addSubjects(reqObj);
        });
      else if (type === "lessons")
        data.forEach(async (d) => {
          const reqObj = { subjectId: d?.SubjectID, title: d?.Name };
          await uploadServices.addLessons(reqObj);
        });
      else if (type === "units") {
        const grouped = data.reduce((acc, d) => {
          const key = `${d.Title}-${d.SubjectID}-${d.LessonId}`;
          if (!acc[key]) {
            acc[key] = {
              title: d.Title,
              subjectId: d.SubjectID,
              lessonId: d.LessonId,
              parts: [],
            };
          }
          acc[key].parts.push({
            title: d.PartTitle,
            content: d.PartContent,
          });
          return acc;
        }, {});

        const reqObj = Object.values(grouped);

        reqObj.forEach(async (obj: any) => {
          const formData = new FormData();
          formData.append("title", obj.title);
          formData.append("lessonId", obj.lessonId);
          formData.append("subjectId", obj.subjectId);

          obj.parts.forEach((part: any, index: number) => {
            formData.append(`parts[${index}].title`, part.title);
            formData.append(`parts[${index}].content`, part.content);
          });
          await uploadServices.addUnits(formData);
        });

      }

      handleDelete();
    } catch (err: any) {
      notify.error(err?.message || "Upload failed");
    }
  };

const handleSampleDownload = () => {
  let data: Record<string, any>[] = [];

  switch (type) {
    case "subjects":
      data = [{ Name: "Mathematics", Board: "CBSE" }];
      break;
    case "lessons":
      data = [{ SubjectID: "1", Name: "Algebra Basics" }];
      break;
    case "units":
      data = [{
        Title: "Unit 1",
        SubjectID: "1",
        LessonId: "1",
        PartTitle: "Introduction",
        PartContent: "Basic concepts of algebra"
      }];
      break;
    default:
      return;
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sample");
  XLSX.writeFile(wb, `${type}-sample.xlsx`);
};

  return (
    <div className="p-6 bg-zinc-800 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white capitalize">{title}</h2>
        {file ? (
          <button
            onClick={data?.length ? uploadData : handleLoadData}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition"
          >
            {data?.length ? "Upload" : "Load Data"}
          </button>
        ) : (
          <button
            onClick={handleSampleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md text-zinc-200 transition"
          >
            <Download className="w-4 h-4" />
            Sample File
          </button>
        )}
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-zinc-600 rounded-xl cursor-pointer hover:bg-zinc-700 transition">
          <Upload className="w-8 h-8 text-zinc-400" />
          <p className="mt-2 text-sm text-zinc-300">
            Click or drag Excel sheet (.xlsx)
          </p>
          <input
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 bg-zinc-700 rounded-xl border border-zinc-600">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{file.name}</span>
            <span className="text-xs text-zinc-400">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <button
            onClick={handleDelete}
            className="p-2 text-red-400 hover:text-red-500 hover:bg-zinc-600 rounded-lg transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-700/40 border border-red-600 text-sm text-red-200">
          {error}
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-6 bg-zinc-700 rounded-xl p-4 overflow-auto max-h-64">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    className="border-b border-zinc-600 px-2 py-1 text-zinc-300 font-medium"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-zinc-600">
                  {Object.values(row).map((val, j) => (
                    <td
                      key={j}
                      className="px-2 py-1 border-b border-zinc-700 text-zinc-200 truncate"
                    >
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
