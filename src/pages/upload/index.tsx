import { useState } from "react";
import UploadSection from "./UploadSection";

const FileUploader: React.FC = () => {
  const tabs = ["subjects", "lessons", "units", "questions"];
  const [active, setActive] = useState("subjects");

  return (
    <div className="p-4 min-h-screen text-zinc-200">
      <div className="flex border-b border-zinc-700 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-6 py-2 text-sm font-medium capitalize border-b-2 transition ${
              active === t
                ? "border-indigo-500 text-white"
                : "border-transparent text-zinc-400 hover:text-white hover:border-zinc-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <UploadSection title={active} type={active} />
    </div>
  );
};

export default FileUploader;
