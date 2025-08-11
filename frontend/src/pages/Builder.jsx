// src/pages/Builder.jsx
import React, { useState } from 'react';
import { apiClient, uploadImageToBackend } from '../api'; // Use the corrected api.js
import QuestionEditor from '../components/QuestionEditor';

const QUESTION_TYPES = [
    { type: 'categorize', title: 'Categorize', description: 'Sort items into categories' },
    { type: 'cloze', title: 'Cloze', description: 'Fill in the blank spaces' },
    { type: 'comprehension', title: 'Comprehension', description: 'Answer questions about a text' },
];

export default function Builder() {
    const [title, setTitle] = useState('');
    const [headerImage, setHeaderImage] = useState(null);
    const [headerUploadStatus, setHeaderUploadStatus] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [formLink, setFormLink] = useState('');

    const [questionUploadStatuses, setQuestionUploadStatuses] = useState({});

    const resetForm = () => {
        setTitle('');
        setHeaderImage(null);
        setHeaderUploadStatus(null);
        setQuestions([]);
        setSelectedIndex(null);
        setSubmissionStatus(null);
        setFormLink('');
        setQuestionUploadStatuses({});
    };

    const handleUploadHeader = async (file) => {
        setHeaderUploadStatus('loading');
        const previewUrl = URL.createObjectURL(file);
        setHeaderImage(previewUrl);

        try {
            // Call the specific header upload endpoint
            const uploadedUrl = await uploadImageToBackend(file, '/api/upload/header');
            setHeaderImage(uploadedUrl);
            setHeaderUploadStatus('success');
        } catch (err) {
            console.error('Header upload error:', err);
            setHeaderUploadStatus('error');
            setHeaderImage(null);
        } finally {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        }
    };

    const handleUploadQuestionImage = async (qIdx, file) => {
        const previewUrl = URL.createObjectURL(file);

        setQuestionUploadStatuses(prev => ({ ...prev, [qIdx]: 'loading' }));
        const newQuestions = [...questions];
        newQuestions[qIdx].imageUrl = previewUrl;
        setQuestions(newQuestions);

        try {
            // Call the specific question upload endpoint
            const uploadedUrl = await uploadImageToBackend(file, '/api/upload/question');
            const updatedQuestions = [...questions];
            updatedQuestions[qIdx].imageUrl = uploadedUrl;
            setQuestions(updatedQuestions);

            setQuestionUploadStatuses(prev => ({ ...prev, [qIdx]: 'success' }));
        } catch (err) {
            console.error(`Question ${qIdx + 1} image upload error:`, err);
            const updatedQuestions = [...questions];
            updatedQuestions[qIdx].imageUrl = '';
            setQuestions(updatedQuestions);
            setQuestionUploadStatuses(prev => ({ ...prev, [qIdx]: 'error' }));
        } finally {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        }
    };

    function addQuestion(type) {
        const newQuestion = {
            type,
            questionText: '',
            imageUrl: '',
            categories: [],
            options: [],
            optionCategoryMap: {},
            clozeText: '',
            passage: '',
            passageQuestions: [],
        };
        setQuestions((prev) => [...prev, newQuestion]);
        setSelectedIndex(questions.length);
    }

    function updateQuestion(idx, updated) {
        setQuestions((prev) => {
            const copy = [...prev];
            copy[idx] = updated;
            return copy;
        });
    }

    function removeQuestion(idx) {
        setQuestions((prev) => prev.filter((_, i) => i !== idx));
        if (selectedIndex === idx) setSelectedIndex(null);
        else if (selectedIndex > idx) setSelectedIndex((i) => i - 1);
    }

    async function saveForm() {
        if (!title.trim()) {
            alert('Please enter a form title.');
            return;
        }
        if (questions.length === 0) {
            alert('Please add at least one question.');
            return;
        }

        const sanitizedQuestions = questions.map(q => {
            const sanitizedQ = {
                type: q.type,
                questionText: q.questionText || '',
                imageUrl: q.imageUrl || '',
            };
            if (q.type === 'categorize') {
                sanitizedQ.categories = q.categories;
                sanitizedQ.options = q.options;
                sanitizedQ.optionCategoryMap = q.optionCategoryMap;
            } else if (q.type === 'cloze') {
                sanitizedQ.clozeText = q.clozeText;
                sanitizedQ.options = q.options;
            } else if (q.type === 'comprehension') {
                sanitizedQ.passage = q.passage;
                sanitizedQ.passageQuestions = q.passageQuestions;
            }
            return sanitizedQ;
        });

        const payload = { title, headerImage, questions: sanitizedQuestions };
        
        try {
            const res = await apiClient.post('/api/forms', payload);
            setSubmissionStatus('success');
            setFormLink(`${window.location.origin}/forms/${res.data._id}`);
        } catch (err) {
            console.error(err);
            setSubmissionStatus('error');
            setFormLink('');
        }
    }

    return (
        <div className="max-w-full min-h-screen bg-[#D4F1F4] pt-[100px] p-8 flex mx-auto gap-8">
            <div className="w-60 bg-[#FFE8D6] rounded-xl p-4 flex flex-col gap-4 overflow-auto max-h-[calc(100vh-120px)] border border-[#FF6F91]/50 shadow-lg">
                {questions.length === 0 && (
                    <p className="text-[#116466]/70 text-lg font-light italic px-4">
                        No questions added yet. Select a question type from the right.
                    </p>
                )}
                {questions.map((q, idx) => {
                    const typeColor = {
                        categorize: 'bg-green-100 text-green-700 border-green-300',
                        cloze: 'bg-blue-100 text-blue-700 border-blue-300',
                        comprehension: 'bg-purple-100 text-purple-700 border-purple-300',
                    }[q.type] || 'bg-gray-100 text-gray-700 border-gray-300';

                    return (
                        <div
                            key={idx}
                            className={`relative group border border-[#116466]/30 rounded p-4 bg-white shadow cursor-pointer flex items-start ${
                                selectedIndex === idx ? 'ring-2 ring-[#FF6F91]' : ''
                            }`}
                            onClick={() => setSelectedIndex(idx)}
                            aria-label={`Select question ${idx + 1}`}
                        >
                            <div className="font-bold text-[#116466] text-lg min-w-[40px]">
                                Q{idx + 1}
                            </div>
                            <div className="flex-1">
                                <span
                                    className={`inline-block px-2 py-1 text-xs font-bold rounded-full border ${typeColor}`}
                                >
                                    {q.type.charAt(0).toUpperCase() + q.type.slice(1)}
                                </span>
                                {q.questionText && (
                                    <p className="text-sm text-gray-600 mt-1 truncate">
                                        {q.questionText.length > 50 ? q.questionText.substring(0, 47) + '...' : q.questionText}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeQuestion(idx);
                                }}
                                className="text-[#FF6F91] font-bold hover:text-[#d25273] ml-2"
                                aria-label={`Delete question ${idx + 1}`}
                            >
                                &#10005;
                            </button>
                        </div>
                    );
                })}
                <button
                    onClick={() => addQuestion(QUESTION_TYPES[0].type)}
                    className="mt-4 w-full rounded-lg bg-[#FFB6B3] hover:bg-[#ff9e9b] flex items-center justify-center text-white font-bold text-xl py-2"
                >
                    + Add Question
                </button>
            </div>

            <div className="flex-1 flex flex-col gap-6">
                <h1 className="text-[#116466] font-bold text-3xl">Create a Form</h1>
                <div>
                    <label className="block mb-2 font-bold text-[#116466]">Form Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter form title"
                        className="border border-[#116466] rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
                    />
                </div>
                <div
                    className="border border-[#116466] rounded-lg p-6 flex flex-col items-center gap-4 cursor-pointer hover:bg-[#f0f9f9]"
                    onClick={() => document.getElementById('headerUpload').click()}
                    aria-label="Add a header image"
                >
                    {headerImage ? (
                        <>
                            <img
                                src={headerImage}
                                alt="Header"
                                className="w-full max-h-48 object-cover rounded-lg border border-[#116466]"
                            />
                            {headerUploadStatus === 'loading' && (
                                <span className="text-blue-600 font-semibold">⏳ Uploading...</span>
                            )}
                            {headerUploadStatus === 'success' && (
                                <span className="text-green-600 font-semibold">✅ Image uploaded successfully</span>
                            )}
                            {headerUploadStatus === 'error' && (
                                <span className="text-red-600 font-semibold">❌ Upload failed</span>
                            )}
                        </>
                    ) : (
                        <>
                            {headerUploadStatus === 'loading' && (
                                <span className="text-blue-600 font-semibold">⏳ Uploading...</span>
                            )}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 text-[#116466]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l4-4m10 0l4 4M7 10l2 2 4-4 5 5"
                                />
                            </svg>
                            <span className="text-[#116466] font-semibold text-lg">Add a header image</span>
                        </>
                    )}
                    <input
                        id="headerUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                handleUploadHeader(e.target.files[0]);
                            }
                        }}
                    />
                </div>
                {selectedIndex !== null && questions[selectedIndex] && (
                    <div className="border border-[#116466] rounded-lg p-6 bg-white shadow-md mt-4">
                        <h2 className="text-[#116466] font-bold text-xl mb-4">
                            Editing Q{selectedIndex + 1} -{' '}
                            {questions[selectedIndex].type.charAt(0).toUpperCase() + questions[selectedIndex].type.slice(1)}
                        </h2>
                        <QuestionEditor
                            index={selectedIndex}
                            question={questions[selectedIndex]}
                            onChange={(updated) => updateQuestion(selectedIndex, updated)}
                            onUploadImage={(file) => handleUploadQuestionImage(selectedIndex, file)}
                            uploadStatus={questionUploadStatuses[selectedIndex]}
                        />
                    </div>
                )}
                
                {submissionStatus === 'success' && (
                    <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-md text-center">
                        <p className="font-semibold text-lg">✅ Form created successfully!</p>
                        <p className="mt-2 text-md">
                            You can view and share your form here:
                        </p>
                        <a 
                            href={formLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block mt-2 text-blue-600 hover:underline font-mono break-all"
                        >
                            {formLink}
                        </a>
                        <button
                            onClick={resetForm} 
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                            Create Another
                        </button>
                    </div>
                )}

                {submissionStatus === 'error' && (
                    <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center">
                        <p className="font-semibold text-lg">❌ Failed to save form.</p>
                        <p className="mt-2">Please check the console for more details and try again.</p>
                    </div>
                )}

                <div className="mt-10 flex justify-center">
                    <button
                        onClick={saveForm}
                        className="bg-[#116466] hover:bg-[#0e4f48] transition px-8 py-3 rounded-lg text-white text-xl font-bold shadow-lg"
                    >
                        Save Form
                    </button>
                </div>
            </div>

            <aside className="w-72 bg-[#FFE8D6] rounded-xl p-6 flex flex-col gap-6 shadow-lg border border-[#FF6F91]/50">
                <h2 className="text-[#FF6F91] font-extrabold text-xl tracking-wide uppercase">Question Type</h2>
                {QUESTION_TYPES.map(({ type, title, description }) => (
                    <button
                        key={type}
                        onClick={() => addQuestion(type)}
                        className="text-left rounded-md p-4 border bg-[#fff3eb] border-[#FFB6B3] text-[#333] font-semibold hover:bg-[#FF6F91] hover:text-white transition"
                    >
                        <span className="block text-lg">{title}</span>
                        <small className="block mt-1 font-normal text-[#666]">{description}</small>
                    </button>
                ))}
            </aside>
        </div>
    );
}