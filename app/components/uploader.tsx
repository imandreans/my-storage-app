"use client";

import { useState } from "react";
import { uploadFile } from "../actions/upload";

export default function Uploader() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await uploadFile(formData);
      alert("Upload berhasil!");
      e.currentTarget.reset();
    } catch (error) {
      alert("Upload gagal: " + error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Upload File</h3>

      <input
        type="file"
        name="file"
        required
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      <button
        type="submit"
        disabled={uploading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </form>
  );
}
