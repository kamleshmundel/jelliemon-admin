import { useState } from "react";

export default function DragDropImage({onFileSelect}: any) {
  // const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    // setFile(f);
    onFileSelect(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`relative w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
        dragOver ? "border-indigo-500 bg-indigo-50" : "border-zinc-600 bg-zinc-800"
      }`}
    >
      <input type="file" onChange={handleChange} className="absolute w-full h-full opacity-0 cursor-pointer" />
      {!preview ? (
        <div className="text-center z-10">
          <p className="text-white font-medium">Drag & Drop your file here</p>
          <p className="text-xs text-zinc-400">or click to browse</p>
        </div>
      ) : (
        <img src={preview} alt="preview" className="w-full h-48 object-contain rounded" />
      )}
    </div>
  );
}
