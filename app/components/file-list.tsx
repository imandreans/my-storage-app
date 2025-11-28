import { useState } from "react";
import { deleteFile } from "../actions/upload";
import Image from "next/image";

type File = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: Date;
};

export default function FileList({ files }: { files: File[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (fileId: string) => {
    if (!confirm("Hapus file ini?")) return;

    setDeleting(fileId);
    try {
      await deleteFile(fileId);
      alert("File dihapus!");
    } catch (error) {
      alert("Gagal hapus: " + error);
    } finally {
      setDeleting(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (files.length === 0) {
    return <p className="text-gray-500 text-center py-8">Belum ada file</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-white rounded-lg shadow p-4">
          {file.type.startsWith("image/") ? (
            <div className="relative h-40 mb-3 bg-gray-100 rounded overflow-hidden">
              <Image
                src={file.url}
                alt={file.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-40 mb-3 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-4xl">📄</span>
            </div>
          )}

          <h4 className="font-semibold text-sm truncate mb-1">{file.name}</h4>
          <p className="text-xs text-gray-500 mb-3">{formatBytes(file.size)}</p>

          <div className="flex gap-2">
            <a
              href={file.url}
              target="_blank"
              className="flex-1 text-center bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
              Download
            </a>
            <button
              onClick={() => handleDelete(file.id)}
              disabled={deleting === file.id}
              className="px-4 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
