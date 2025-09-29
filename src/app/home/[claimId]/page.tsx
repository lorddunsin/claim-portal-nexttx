"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import claims from "@/data/claims.json";
import { Claim } from "@/types/claim";

export default function Home() {
  const router = useRouter();
  const params = useParams<{ claimId: string }>();
  const claimID = params.claimId;

  // ✅ Case-insensitive lookup
  const claim: Claim | undefined = claims.find(
    (item) => item.claimID.toLowerCase() === claimID.toLowerCase()
  );

  // ✅ If claim not found
  if (!claim) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">❌ Claim not found</h1>
      </div>
    );
  }

  // ✅ Chat state
  const [messages, setMessages] = useState([
    { sender: "insurer", text: "Hello, please upload your supporting documents." },
    { sender: "user", text: "Okay, I’ll upload them soon." },
    { sender: "insurer", text: "Please provide the documents as soon as possible." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // ✅ File upload state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { sender: "user", text: newMessage }]);
    setNewMessage("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="flex flex-col sm:flex-row justify-between items-center bg-red-600 px-6 sm:px-10 py-4 gap-3 sm:gap-0">
        <div className="text-center sm:text-left">
          <h1 className="font-bold text-white text-xl">Claim Portal</h1>
          <p className="mt-1 text-sm text-red-100">Claim ID: {claim.claimID}</p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="bg-red-500 hover:bg-red-700 px-4 py-2 text-sm text-white rounded-lg shadow w-full sm:w-auto"
        >
          Logout
        </button>
      </nav>

      {/* Main Section */}
      <div className="bg-gray-100 px-4 sm:px-10 py-8 min-h-screen">
        <p className="text-gray-700 font-medium text-center sm:text-left">
          {claim.Device} • Submitted {claim.date} at {claim.time}
        </p>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-6">
          {/* Device Details */}
          <div className="bg-white rounded-lg p-5 shadow">
            <h2 className="font-bold text-lg mb-5 text-gray-800">Device Details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400">Value</p>
                <p className="font-medium">{claim.value}</p>
              </div>
              <div>
                <p className="text-gray-400">Device</p>
                <p className="font-medium">{claim.Device}</p>
              </div>
              <div>
                <p className="text-gray-400">Purchase Date</p>
                <p className="font-medium">{claim.puchasedate}</p>
              </div>
              <div>
                <p className="text-gray-400">Type</p>
                <p className="font-medium">{claim.type}</p>
              </div>
              <div>
                <p className="text-gray-400">Serial Number</p>
                <p className="font-medium">{claim.serial}</p>
              </div>
            </div>
          </div>

          {/* Actions + Incident */}
          <div className="bg-white rounded-lg p-5 shadow">
            <h2 className="font-bold text-lg text-gray-800">Actions</h2>
            <input
              type="file"
              multiple
              className="hidden"
              id="fileUpload"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="fileUpload"
              className="bg-red-500 text-white px-4 py-2 rounded mt-3 cursor-pointer inline-block hover:bg-red-600"
            >
              Upload Document
            </label>

            <div className="mt-5">
              <p className="text-sm text-gray-400">Uploaded Documents</p>
              {uploadedFiles.length === 0 ? (
                <p className="bg-gray-100 p-2 mt-2 rounded">No document uploaded</p>
              ) : (
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="text-gray-700">
                      📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <h3 className="font-bold text-lg mt-8 text-gray-800">Incident Details</h3>
            <div className="space-y-4 text-sm mt-3">
              <div>
                <p className="text-gray-400">Issue</p>
                <p className="bg-gray-100 p-2 mt-1 rounded">{claim.issue}</p>
              </div>
              <div>
                <p className="text-gray-400">Cause</p>
                <p className="bg-gray-100 p-2 mt-1 rounded">{claim.cause}</p>
              </div>
              <div>
                <p className="text-gray-400">Date of Incident</p>
                <p className="bg-gray-100 p-2 mt-1 rounded">{claim.date}</p>
              </div>
            </div>
          </div>

          {/* Status + Chat */}
          <div className="bg-white rounded-lg p-5 shadow flex flex-col">
            <h2 className="font-bold text-lg mb-3 text-gray-800">Status</h2>
            <p className="bg-red-500 text-white font-semibold px-3 py-2 rounded-lg inline-block w-fit mb-6 shadow-sm">
              {claim.status}
            </p>

            <h2 className="font-bold text-lg mb-2 text-gray-800">Chat</h2>
            <div className="flex-1 border border-gray-200 p-3 rounded-lg bg-gray-50 mb-4 max-h-[300px] overflow-y-auto space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold mb-1 ${
                      msg.sender === "user" ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {msg.sender === "user" ? "You" : "Insurer"}
                  </span>
                  <div
                    className={`p-2 rounded-lg shadow-sm ${
                      msg.sender === "user"
                        ? "bg-red-100 text-right text-red-800"
                        : "bg-gray-200 text-left text-gray-800"
                    }`}
                  >
                    <span className="text-sm">{msg.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-red-200"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={handleSend}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow text-sm w-full sm:w-auto"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
