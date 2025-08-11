import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- API Client Setup ---
const BASE_URL = 'https://formbuilder-xbl5.onrender.com';

const apiClient = {
  get: async (url) => {
    try {
      const response = await fetch(`${BASE_URL}${url}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      return { data: await response.json() };
    } catch (error) {
      console.error("API GET error:", error);
      throw error;
    }
  },
  post: async (url, data) => {
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const errorMessage = errorData.errors ? errorData.errors.join('\n') : errorData.message || response.statusText;
        throw new Error(`HTTP error! status: ${response.status} - ${errorMessage}`);
      }
      return { data: await response.json() };
    } catch (error) {
      console.error("API POST error:", error);
      throw error;
    }
  },
};

const uploadImageToBackend = async (file, uploadUrl) => {
  console.log(`Uploading image to: ${uploadUrl}`, file);
  return `https://placehold.co/150x100/A7DBD8/116466?text=Uploaded+Image`;
};


// --- DraggableItem Component ---
function DraggableItem({ id, children, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: 'grab',
    userSelect: 'none',
    padding: '0.5rem 1rem',
    margin: '0.25rem',
    backgroundColor: '#FF6F91',
    color: 'white',
    borderRadius: '6px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    minWidth: '80px',
    textAlign: 'center',
    flexShrink: 0,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
      {children}
    </div>
  );
}

// --- DroppableCategory Component ---
import { useDroppable } from '@dnd-kit/core';

function DroppableCategory({ id, children, itemsInThisCategory, onItemClick }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const style = {
    minHeight: '80px',
    border: `2px dashed ${isOver ? '#FF6F91' : '#116466'}`,
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: isOver ? '#ffe8d6' : '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease-in-out',
    width: 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <h4 className="font-semibold text-[#116466] mb-2">{children}</h4>
      <div className="flex flex-wrap justify-start gap-2">
        {itemsInThisCategory.map((item) => (
          <DraggableItem key={item.id} id={item.id} onClick={() => onItemClick(id, item.id)}>
            {item.name || item.text}
          </DraggableItem>
        ))}
      </div>
      {itemsInThisCategory.length === 0 && (
        <p className="text-[#666] italic text-sm">Drag items here</p>
      )}
    </div>
  );
}


// --- ClozeBlank Component ---
function ClozeBlank({ id, content, onBlankClick, isFilled, placeholder }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const style = {
    display: 'inline-block',
    minWidth: '80px',
    minHeight: '30px',
    borderBottom: `2px solid ${isOver ? '#FF6F91' : '#116466'}`,
    padding: '0 5px',
    margin: '0 2px',
    backgroundColor: isOver ? '#ffe8d6' : (isFilled ? '#D4F1F4' : 'transparent'),
    borderRadius: '4px',
    verticalAlign: 'middle',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    textAlign: 'center',
    color: '#116466',
    fontWeight: 'bold',
    userSelect: 'none',
  };

  return (
    <span
      ref={setNodeRef}
      style={style}
      onClick={() => isFilled && onBlankClick(id)}
      className="inline-flex items-center justify-center"
    >
      {isFilled ? content : placeholder}
    </span>
  );
}

// --- PreviewFill Component ---
export default function PreviewFill() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [categorizeAnswers, setCategorizeAnswers] = useState({});
  const [clozeAnswers, setClozeAnswers] = useState({});
  const [clozeOptionTexts, setClozeOptionTexts] = useState({});
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState({ type: '', text: '' });
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [showForm, setShowForm] = useState(true); // New state to control form visibility


  const handleClozeBlankClickToClear = (qIdx, blankId) => {
    setClozeAnswers(prev => {
      const newClozeAns = { ...prev };
      if (newClozeAns[qIdx] && newClozeAns[qIdx][blankId]) {
        const optionIdToReturn = newClozeAns[qIdx][blankId];
        delete newClozeAns[qIdx][blankId];
      }
      return newClozeAns;
    });
    setAnswers(prev => {
      const newAns = { ...prev };
      if (newAns[qIdx]) {
        delete newAns[qIdx][blankId];
      }
      return newAns;
    });
  };


  useEffect(() => {
    if (!id) return;

    apiClient.get(`/api/forms/${id}`)
      .then((res) => {
        setForm(res.data);
        const initialAnswers = {};
        const initialCategorizeAnswers = {};
        const initialClozeAnswers = {};
        const initialClozeOptionTexts = {};

        const questionsToProcess = res.data.questions && Array.isArray(res.data.questions) ? res.data.questions : [];

        questionsToProcess.forEach((q, qIdx) => {
          if (q.type === 'categorize') {
            initialCategorizeAnswers[qIdx] = {};
            initialAnswers[qIdx] = {};
          } else if (q.type === 'cloze') {
            initialClozeAnswers[qIdx] = {};
            const optMap = {};

            const parser = new DOMParser();
            const doc = parser.parseFromString(q.clozeText || '', 'text/html');
            const uElements = Array.from(doc.querySelectorAll('u'));

            uElements.forEach((u, blankIndex) => {
              const originalText = u.getAttribute('data-original-text');
              if (originalText) {
                const optionId = `cloze-opt-${qIdx}-${blankIndex}`;
                optMap[optionId] = originalText;
              }
            });

            initialClozeOptionTexts[qIdx] = optMap;
            initialAnswers[qIdx] = {};
          } else if (q.type === 'comprehension') {
            initialAnswers[qIdx] = {};
          }
        });
        setCategorizeAnswers(initialCategorizeAnswers);
        setClozeAnswers(initialClozeAnswers);
        setClozeOptionTexts(initialClozeOptionTexts);
        setAnswers(initialAnswers);
      })
      .catch((error) => {
        console.error("Failed to load form:", error);
        setForm(null);
      });
  }, [id]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );


  function handleCategorizeDragEnd(event, qIdx) {
    const { active, over } = event;
    setActiveDragItemId(null);

    const optionId = active.id;

    if (!over || over.id === 'unassigned-pool') {
      setCategorizeAnswers(prev => {
        const newCatAns = { ...prev };
        const updatedCatAnswers = Object.entries(newCatAns[qIdx] || {}).reduce((acc, [optId, catId]) => {
          if (optId !== optionId) {
            acc[optId] = catId;
          }
          return acc;
        }, {});
        newCatAns[qIdx] = updatedCatAnswers;
        return newCatAns;
      });
      setAnswers(prev => {
        const newAns = { ...prev };
        const currentQAnswers = { ...newAns[qIdx] } || {};
        const optionObject = form.questions[qIdx].options.find(o => o.id === optionId);
        if (optionObject) {
          delete currentQAnswers[optionObject.name];
        }
        newAns[qIdx] = currentQAnswers;
        return newAns;
      });
      return;
    }

    const categoryId = over.id;

    setCategorizeAnswers(prev => {
      const newCatAns = { ...prev };
      const updatedCatAnswers = Object.entries(newCatAns[qIdx] || {}).reduce((acc, [optId, catId]) => {
        if (optId !== optionId) {
          acc[optId] = catId;
        }
        return acc;
      }, {});
      updatedCatAnswers[optionId] = categoryId;
      newCatAns[qIdx] = updatedCatAnswers;
      return newCatAns;
    });

    setAnswers(prev => {
      const newAns = { ...prev };
      const currentQAnswers = { ...newAns[qIdx] } || {};
      const optionObject = form.questions[qIdx].options.find(o => o.id === optionId);
      if (optionObject) {
        currentQAnswers[optionObject.name] = categoryId;
      }
      newAns[qIdx] = currentQAnswers;
      return newAns;
    });
  }

  const handleCategorizedItemClick = (qIdx, optionId) => {
    setCategorizeAnswers(prev => {
      const newCatAns = { ...prev };
      const updatedCatAnswers = Object.entries(newCatAns[qIdx] || {}).reduce((acc, [optId, catId]) => {
        if (optId !== optionId) {
          acc[optId] = catId;
        }
        return acc;
      }, {});
      newCatAns[qIdx] = updatedCatAnswers;
      return newCatAns;
    });
    setAnswers(prev => {
      const newAns = { ...prev };
      const currentQAnswers = { ...newAns[qIdx] } || {};
      const optionObject = form.questions[qIdx].options.find(o => o.id === optionId);
      if (optionObject) {
        delete currentQAnswers[optionObject.name];
      }
      newAns[qIdx] = currentQAnswers;
      return newAns;
    });
  };


  function handleClozeDragEnd(event, qIdx) {
    const { active, over } = event;
    setActiveDragItemId(null);

    if (!over) {
      setClozeAnswers(prev => {
        const newClozeAns = { ...prev };
        for (const blankId in newClozeAns[qIdx]) {
          if (newClozeAns[qIdx][blankId] === active.id) {
            delete newClozeAns[qIdx][blankId];
            break;
          }
        }
        return newClozeAns;
      });
      setAnswers(prev => {
        const newAns = { ...prev };
        for (const blankId in newAns[qIdx]) {
          if (newAns[qIdx][blankId] === clozeOptionTexts[qIdx]?.[active.id]) {
            delete newAns[qIdx][blankId];
            break;
          }
        }
        return newAns;
      });
      return;
    }

    const optionId = active.id;
    const blankId = over.id;

    setClozeAnswers(prev => {
      const newClozeAns = { ...prev };
      newClozeAns[qIdx] = { ...newClozeAns[qIdx], [blankId]: optionId };
      return newClozeAns;
    });

    setAnswers(prev => {
      const newAns = { ...prev };
      const currentQAnswers = { ...newAns[qIdx] } || {};
      const optionText = clozeOptionTexts[qIdx]?.[optionId];
      currentQAnswers[blankId] = optionText;
      newAns[qIdx] = currentQAnswers;
      return newAns;
    });
  }


  const handleDragStart = (event) => {
    setActiveDragItemId(event.active.id);
  };


  function handleComprehensionMCQChange(qIdx, pqIdx, selectedOptionIndex) {
    setAnswers(a => {
      const currentQAnswers = a[qIdx] && typeof a[qIdx] === 'object' ? { ...a[qIdx] } : {};
      currentQAnswers[pqIdx] = selectedOptionIndex;
      return { ...a, [qIdx]: currentQAnswers };
    });
  }


  async function submitForm() {
    if (!form) {
      setSubmissionMessage({ type: 'error', text: 'No form to submit.' });
      return;
    }
    setSubmissionStatus('submitting');

    const payload = {
      answers: form.questions.map((q, idx) => ({
        questionIndex: idx,
        answer: answers[idx] ?? null,
      })),
    };

    try {
      await apiClient.post(`/api/responses/${id}`, payload);

      setSubmissionMessage({ type: 'success', text: 'Form submitted successfully!' });
      setSubmissionStatus('idle');
      setShowForm(false); // Hide the form on successful submission

    } catch (err) {
      console.error('Submission failed:', err);
      setSubmissionMessage({ type: 'error', text: 'Failed to submit form. Please try again. Check console for details.' });
      setSubmissionStatus('idle');
    }
  }

  // New function to handle the "Fill Again" action
  const handleFillAgain = () => {
    // Reset all states to their initial values to clear the form
    setAnswers({});
    setCategorizeAnswers({});
    setClozeAnswers({});
    setClozeOptionTexts({});
    setSubmissionMessage({ type: '', text: '' });
    setShowForm(true); // Show the form again
  };


  if (!form) return (
    <div className="min-h-screen bg-[#D4F1F4] pt-[100px] p-8 flex items-center justify-center">
      <div className="text-[#116466] text-xl font-semibold">Loading form...</div>
    </div>
  );
  
  return (
    <div className="max-w-4xl mx-auto bg-[#D4F1F4] min-h-screen pt-[100px] p-8 font-inter">
      {/* Display header and submission messages regardless of whether the form is shown */}
      {form.headerImage && (
        <img
          src={form.headerImage}
          alt="Form Header"
          className="mb-6 w-full max-h-48 object-cover rounded-lg shadow-md border border-[#116466]/30"
        />
      )}
      <h1 className="text-4xl font-extrabold text-[#116466] text-center mb-8">
        {form.title}
      </h1>
      
      {submissionMessage.type === 'success' && (
        <div className="p-4 mb-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {submissionMessage.text}
        </div>
      )}
      
      {submissionMessage.type === 'error' && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {submissionMessage.text}
        </div>
      )}

      {/* Conditional rendering based on showForm state */}
      {showForm ? (
        // Renders the form content
        <>
          <div className="space-y-8">
            {form.questions
              .filter(q => q && typeof q === 'object' && typeof q.type === 'string')
              .map((q, idx) => {
                const currentQIdx = idx;

                const typeColor = {
                  categorize: 'bg-green-100 text-green-700 border-green-300',
                  cloze: 'bg-blue-100 text-blue-700 border-blue-300',
                  comprehension: 'bg-purple-100 text-purple-700 border-purple-300',
                }[q.type] || 'bg-gray-100 text-gray-700 border-gray-300';

                return (
                  <div className="border border-[#116466]/30 p-6 rounded-xl bg-white shadow-lg" key={q.id || currentQIdx}>
                    <h3 className="font-bold text-[#FF6F91] text-xl mb-4">
                      Q{currentQIdx + 1} — {q.type.charAt(0).toUpperCase() + q.type.slice(1)}
                    </h3>

                    {q.questionText && <p className="mt-2 text-lg text-[#333]">{q.questionText}</p>}
                    {q.imageUrl && (
                      <img src={q.imageUrl} className="h-40 w-full mt-4 rounded-lg object-contain shadow-sm border border-[#FFE8D6]" alt="Question visual" />
                    )}

                    {/* Categorize Question */}
                    {q.type === 'categorize' && (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => handleCategorizeDragEnd(event, currentQIdx)}
                        onDragStart={handleDragStart}
                      >
                        <div className="mt-5 flex flex-col md:flex-row gap-6">
                          <div className="flex-1 flex flex-col gap-4">
                            {q.categories.map((cat) => (
                              <DroppableCategory
                                key={cat.id}
                                id={cat.id}
                                itemsInThisCategory={q.options.filter(
                                  (opt) => categorizeAnswers[currentQIdx]?.[opt.id] === cat.id
                                )}
                                onItemClick={(categoryId, optionId) => handleCategorizedItemClick(currentQIdx, optionId)}
                              >
                                {cat.name}
                              </DroppableCategory>
                            ))}
                          </div>

                          <div className="flex-1 border-dashed border-2 border-[#FFB6B3] rounded-xl p-4 bg-[#FFE8D6] min-h-[120px]">
                            <h4 className="font-semibold text-[#116466] mb-3">Items to Categorize:</h4>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <SortableContext
                                items={
                                  q.options
                                    .filter((opt) => !Object.keys(categorizeAnswers[currentQIdx] || {}).includes(opt.id))
                                    .map((opt) => opt.id)
                                }
                                strategy={verticalListSortingStrategy}
                              >
                                {q.options
                                  .filter((opt) => !Object.keys(categorizeAnswers[currentQIdx] || {}).includes(opt.id))
                                  .map((opt) => (
                                    <DraggableItem key={opt.id} id={opt.id}>
                                      {opt.name}
                                    </DraggableItem>
                                  ))}
                              </SortableContext>
                              {q.options.filter((opt) => !Object.keys(categorizeAnswers[currentQIdx] || {}).includes(opt.id)).length === 0 && (
                                <p className="text-[#666] italic text-sm">All items categorized!</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </DndContext>
                    )}


                    {/* Cloze Question */}
                    {q.type === 'cloze' && (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => handleClozeDragEnd(event, currentQIdx)}
                        onDragStart={handleDragStart}
                      >
                        <div className="mt-5 flex flex-col md:flex-row gap-6">
                          <div className="flex-1 bg-[#fefefe] p-4 rounded-lg border border-[#FFE8D6]">
                            <h4 className="font-semibold text-[#116466] mb-3">Fill in the Blanks:</h4>
                            <p className="text-lg text-[#333] leading-relaxed">
                              {q.clozeText.split(/(<u[^>]*data-original-text="[^"]*"[^>]*>.*?<\/u>)/g).map((part, i) => {
                                if (part.startsWith('<u') && part.endsWith('</u>')) {
                                  const blankId = `blank-${currentQIdx}-${i}`;
                                  const assignedOptionId = clozeAnswers[currentQIdx]?.[blankId];
                                  const assignedOptionText = assignedOptionId ? clozeOptionTexts[currentQIdx]?.[assignedOptionId] : '';

                                  return (
                                    <ClozeBlank
                                      key={blankId}
                                      id={blankId}
                                      content={assignedOptionText}
                                      isFilled={!!assignedOptionText}
                                      placeholder={'_____'}
                                      onBlankClick={(blankIdToClear) => handleClozeBlankClickToClear(currentQIdx, blankIdToClear)}
                                    />
                                  );
                                }
                                return <span key={`text-part-${currentQIdx}-${i}`} dangerouslySetInnerHTML={{ __html: part }} />;
                              })}
                            </p>
                          </div>

                          <div className="flex-1 border-2 border-dashed border-[#FFB6B3] rounded-xl p-4 bg-[#FFE8D6] min-h-[120px]">
                            <h4 className="font-semibold text-[#116466] mb-3">Word Bank:</h4>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <SortableContext
                                items={Object.keys(clozeOptionTexts[currentQIdx] || {}).filter(
                                  (optId) => !Object.values(clozeAnswers[currentQIdx] || {}).includes(optId)
                                )}
                                strategy={verticalListSortingStrategy}
                              >
                                {Object.entries(clozeOptionTexts[currentQIdx] || {}).filter(
                                  ([optId]) => !Object.values(clozeAnswers[currentQIdx] || {}).includes(optId)
                                ).map(([optId, text]) => (
                                  <DraggableItem key={optId} id={optId}>
                                    {text}
                                  </DraggableItem>
                                ))}
                              </SortableContext>
                              {Object.keys(clozeOptionTexts[currentQIdx] || {}).filter(
                                (optId) => !Object.values(clozeAnswers[currentQIdx] || {}).includes(optId)
                              ).length === 0 && (
                                <p className="text-[#666] italic text-sm">All blanks filled!</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </DndContext>
                    )}


                    {/* Comprehension Question */}
                    {q.type === 'comprehension' && (
                      <div className="mt-5">
                        <div className="bg-[#FFE8D6] p-4 rounded-lg border border-[#FFB6B3] text-lg leading-relaxed text-[#333] mb-5 shadow-sm">
                          <h4 className="font-semibold text-[#116466] mb-3">Passage:</h4>
                          <p>{q.passage}</p>
                        </div>
                        <div className="space-y-5">
                          {q.passageQuestions?.map((pq, pqIdx) => (
                            <div className="p-4 bg-[#fefefe] rounded-lg border border-[#FFE8D6] shadow-sm" key={pqIdx}>
                              <p className="font-medium text-lg text-[#116466] mb-3">{pq.questionText}</p>
                              <div className="space-y-2">
                                {pq.options.map((opt, optIdx) => (
                                  <label key={optIdx} className="flex items-center text-[#333] cursor-pointer hover:bg-gray-50 p-2 rounded-md transition">
                                    <input
                                      type="radio"
                                      name={`q${currentQIdx}-pq${pqIdx}`}
                                      value={optIdx}
                                      checked={answers[currentQIdx]?.[pqIdx] === optIdx}
                                      onChange={() => handleComprehensionMCQChange(currentQIdx, pqIdx, optIdx)}
                                      className="mr-2 text-[#FF6F91] focus:ring-[#FF6F91] h-4 w-4 border-gray-300"
                                    />
                                    {opt}
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>


          <div className="mt-10 text-center">
            <button
              onClick={submitForm}
              className="bg-[#116466] hover:bg-[#0e4f48] transition px-8 py-4 rounded-lg text-white text-xl font-bold shadow-xl tracking-wide uppercase"
            >
              Submit Form
            </button>
          </div>
        </>
      ) : (
        // Renders the confirmation message and button to fill again
        <div className="mt-10 text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-[#116466] mb-4">Thank you for your submission!</h2>
          <p className="text-lg text-[#333] mb-6">Your responses have been successfully recorded. Would you like to fill out the form again?</p>
          <button
            onClick={handleFillAgain}
            className="bg-[#FF6F91] hover:bg-[#d85873] transition px-8 py-4 rounded-lg text-white text-xl font-bold shadow-xl tracking-wide uppercase"
          >
            Fill Again
          </button>
        </div>
      )}
    </div>
  );
}