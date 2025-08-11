
 import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


function SortableOption({ id, value, onChange, placeholder }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className="flex items-center mb-1"
    >
      {/* Input without drag listeners, so typing works */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-[#116466] rounded p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
      />
      
      {/* Drag handle with listeners */}
      <button
        type="button"
        {...listeners}
        className="ml-2 cursor-grab text-[#116466] hover:text-[#FF6F91]"
        aria-label="Drag handle"
      >
        &#x2630; {/* Hamburger icon as drag handle */}
      </button>
    </div>
  );
}


export default function ComprehensionEditor({ question, onChange }) {
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']);
  const [newCorrectIndex, setNewCorrectIndex] = useState(null);

  // When question changes from parent, sync state
  useEffect(() => {
    setNewOptions(['', '']);
    setNewCorrectIndex(null);
    setNewQuestionText('');
  }, [question]);



  function addMCQ() {
   if (!newQuestionText.trim()) {
    alert("Please enter question text.");
    return;
  }
  if (newOptions.some((opt) => !opt.trim())) {
    alert("Please fill in all options.");
    return;
  }
  if (newCorrectIndex === null) {
    alert("Please select the correct answer.");
    return;
  }

    const mcq = {
      questionText: newQuestionText.trim(),
      options: newOptions.map((o) => o.trim()),
      correctIndex: newCorrectIndex,
    };

    onChange({
      ...question,
      passageQuestions: [...(question.passageQuestions || []), mcq],
    });

    setNewQuestionText('');
    setNewOptions(['', '']);
    setNewCorrectIndex(null);
  }

  function removeMCQ(idx) {
    const newList = [...(question.passageQuestions || [])];
    newList.splice(idx, 1);
    onChange({ ...question, passageQuestions: newList });
  }

  function updateMCQOption(mIndex, oIndex, value) {
    const newList = [...(question.passageQuestions || [])];
    newList[mIndex].options[oIndex] = value;
    onChange({ ...question, passageQuestions: newList });
  }

  // Sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Handle drag end event to reorder options inside the current "new MCQ"
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = newOptions.findIndex((_, i) => i.toString() === active.id);
      const newIndex = newOptions.findIndex((_, i) => i.toString() === over.id);

      const newOpts = arrayMove(newOptions, oldIndex, newIndex);
      setNewOptions(newOpts);

      // If correct answer is affected by reorder, update index accordingly
      if (newCorrectIndex === oldIndex) {
        setNewCorrectIndex(newIndex);
      } else if (oldIndex < newCorrectIndex && newIndex >= newCorrectIndex) {
        setNewCorrectIndex((i) => i - 1);
      } else if (oldIndex > newCorrectIndex && newIndex <= newCorrectIndex) {
        setNewCorrectIndex((i) => i + 1);
      }
    }
  }

  return (
    <div className="mt-3">
      <label className="block text-[#116466] font-semibold mb-2">Passage</label>
      <textarea
        value={question.passage || ''}
        onChange={(e) => onChange({ ...question, passage: e.target.value })}
        className="border border-[#116466] rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
        rows={6}
        placeholder="Enter passage text here"
      />

      <div className="mt-4">
        <label className="block text-[#116466] font-semibold mb-1">Add MCQ question</label>
        <input
          type="text"
          placeholder="Question text"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          className="border border-[#116466] rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#FF6F91] mb-2"
        />

        {/* Dnd Context for options */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={newOptions.map((_, i) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            {newOptions.map((opt, i) => (
              <SortableOption
                key={i}
                id={i.toString()}
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...newOptions];
                  newOpts[i] = e.target.value;
                  setNewOptions(newOpts);
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        <button
          type="button"
          onClick={() => setNewOptions([...newOptions, ''])}
          className="text-[#116466] underline mb-2"
        >
          Add Option
        </button>

        <div className="mb-2">
          <label className="font-semibold mr-2 text-[#116466]">Correct Answer: </label>
          <select
            onChange={(e) => {
  const val = e.target.value;
  setNewCorrectIndex(val === '' ? null : parseInt(val));
}}

            className="border border-[#116466] rounded p-1 focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
          >
            <option value="" disabled>
              Select correct option
            </option>
            {newOptions.map((opt, i) => (
              <option key={i} value={i}>
                {opt || `Option ${i + 1}`}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={addMCQ}
          className="bg-[#116466] hover:bg-[#0e4f48] text-white px-4 py-2 rounded font-semibold transition"
        >
          Add MCQ
        </button>
      </div>

      {/* List of added MCQs */}
      <ul className="mt-4 max-h-48 overflow-auto border border-[#116466]/40 rounded p-3 bg-[#FFE8D6]">
        {(question.passageQuestions || []).map((pq, i) => (
          <li key={i} className="mb-3">
            <div className="flex justify-between items-center">
              <strong>{pq.questionText}</strong>
              <button
                type="button"
                onClick={() => removeMCQ(i)}
                className="text-[#FF6F91] font-bold hover:text-[#d25273]"
                aria-label={`Remove question ${i + 1}`}
              >
                &times;
              </button>
            </div>
            <ul className="list-disc list-inside ml-4">
              {pq.options.map((opt, idx) => (
                <li key={idx}>
                  {opt}{' '}
                  {pq.correctIndex === idx && (
                    <span className="font-bold text-green-600">(Correct)</span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

