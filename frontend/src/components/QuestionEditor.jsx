/*// src/components/QuestionEditor.jsx
import React from 'react';
import CategorizeEditor from './CategorizeEditor';
import ClozeEditor from './ClozeEditor';
import ComprehensionEditor from './ComprehensionEditor';

export default function QuestionEditor({ question, onChange, index, onUploadImage, uploadStatus }) {
    
    function handleImage(e) {
        if (!e.target.files?.[0]) return;
        onUploadImage(e.target.files[0]);
    }

    const displayType =
        question.type.charAt(0).toUpperCase() + question.type.slice(1);

    return (
        <div className="bg-white rounded-lg shadow-md border border-[#116466]/30 p-6">
            <header className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#116466] text-lg">
                    Q{index + 1} — {displayType}
                </h3>
            </header>

            
            <div className="mt-4">
                <label className="block text-[#116466] font-semibold mb-2">
                    Attach Image (optional)
                </label>

               
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#116466] text-white font-medium rounded-lg shadow hover:bg-[#0e4f48] transition">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5V21h4.5M21 8.25V3h-4.5m-13.5 8.25l6 6 9-9"
                        />
                    </svg>
                    {question.imageUrl ? 'Change Image' : 'Upload Image'}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        className="hidden"
                    />
                </label>

              
                <div className="mt-2 text-sm">
                    {uploadStatus === 'loading' && (
                        <span className="text-blue-500">Uploading...</span>
                    )}
                    {uploadStatus === 'success' && (
                        <span className="text-green-600">✅ Uploaded successfully</span>
                    )}
                    {uploadStatus === 'error' && (
                        <span className="text-red-500">❌ Upload failed</span>
                    )}
                </div>

                
                <div className="mt-4">
                    {question.imageUrl ? (
                        <div className="relative group w-fit">
                            <img
                                src={question.imageUrl}
                                alt="Uploaded Preview"
                                className="h-32 w-32 rounded-lg border border-[#116466]/40 object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
                            />
                         
                            <button
                                type="button"
                                onClick={() => onChange({ ...question, imageUrl: '' })}
                                className="absolute top-1 right-1 bg-[#FF6F91] hover:bg-[#d25273] text-white rounded-full p-1 shadow"
                            >
                                &times;
                            </button>
                        </div>
                    ) : (
                        <div className="h-32 w-32 flex flex-col items-center justify-center border-2 border-dashed border-[#116466]/40 rounded-lg text-sm text-gray-500">
                            No image uploaded
                        </div>
                    )}
                </div>
            </div>

          
            <div className="mt-5">
                {question.type === 'categorize' && (
                    <CategorizeEditor question={question} onChange={onChange} />
                )}
                {question.type === 'cloze' && (
                    <ClozeEditor question={question} onChange={onChange} />
                )}
                {question.type === 'comprehension' && (
                    <ComprehensionEditor question={question} onChange={onChange} />
                )}
            </div>
        </div>
    );
}
    */
   // src/components/QuestionEditor.jsx
import React from 'react';
import CategorizeEditor from './CategorizeEditor';
import ClozeEditor from './ClozeEditor';
import ComprehensionEditor from './ComprehensionEditor';

export default function QuestionEditor({ question, onChange, index, onUploadImage, uploadStatus }) {
    
    function handleImage(e) {
        if (!e.target.files?.[0]) return;
        onUploadImage(e.target.files[0]);
    }

    const displayType =
        question.type.charAt(0).toUpperCase() + question.type.slice(1);

    return (
        <div className="bg-white rounded-lg shadow-md border border-[#116466]/30 p-6">
            <header className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#116466] text-lg">
                    Q{index + 1} — {displayType}
                </h3>
            </header>

            {/* Image Upload Section */}
            <div className="mt-4">
                <label className="block text-[#116466] font-semibold mb-2">
                    Attach Image (optional)
                </label>

                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#116466] text-white font-medium rounded-lg shadow hover:bg-[#0e4f48] transition">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5V21h4.5M21 8.25V3h-4.5m-13.5 8.25l6 6 9-9"
                        />
                    </svg>
                    {question.imageUrl ? 'Change Image' : 'Upload Image'}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        className="hidden"
                    />
                </label>

                <div className="mt-2 text-sm">
                    {uploadStatus === 'loading' && (
                        <span className="text-blue-500">Uploading...</span>
                    )}
                    {uploadStatus === 'success' && (
                        <span className="text-green-600">✅ Uploaded successfully</span>
                    )}
                    {uploadStatus === 'error' && (
                        <span className="text-red-500">❌ Upload failed</span>
                    )}
                </div>

                {/* --- CORRECTED SECTION BELOW --- */}
                {question.imageUrl && (
                    <div className="mt-4">
                        <div className="relative group w-fit">
                            <img
                                src={question.imageUrl}
                                alt="Uploaded Preview"
                                className="h-32 w-32 rounded-lg border border-[#116466]/40 object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
                            />
                            <button
                                type="button"
                                onClick={() => onChange({ ...question, imageUrl: '' })}
                                className="absolute top-1 right-1 bg-[#FF6F91] hover:bg-[#d25273] text-white rounded-full p-1 shadow"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}
                {/* --- END OF CORRECTED SECTION --- */}

            </div>

            {/* Editor for question type */}
            <div className="mt-5">
                {question.type === 'categorize' && (
                    <CategorizeEditor question={question} onChange={onChange} />
                )}
                {question.type === 'cloze' && (
                    <ClozeEditor question={question} onChange={onChange} />
                )}
                {question.type === 'comprehension' && (
                    <ComprehensionEditor question={question} onChange={onChange} />
                )}
            </div>
        </div>
    );
}