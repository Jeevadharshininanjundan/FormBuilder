
import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, // Import arrayMove for reordering logic
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable option component for drag & drop
function SortableOption({ id, value }) {
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
    cursor: 'grab',
    userSelect: 'none',
    padding: '0.4rem 0.75rem',
    marginBottom: '0.25rem',
    backgroundColor: '#FFE8D6',
    border: '1px solid #116466',
    borderRadius: '6px',
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-label={`Option: ${value}`}
    >
      {value}
    </li>
  );
}

export default function ClozeEditor({ question, onChange }) {
  // Ensure question and onChange have default values to prevent errors
  question = question || { clozeText: '', options: [] };
  onChange = onChange || (() => {});

  const editorRef = useRef(null);
  // `currentHtml` will be the source of truth for the HTML content in React state
  const [currentHtml, setCurrentHtml] = useState(question.clozeText || '');
  const [options, setOptions] = useState([]); // Manage options extracted from HTML

  
  const extractOptionsFromHtml = (content) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const uElements = Array.from(div.querySelectorAll('u'));


    const newOptions = uElements.map((el, i) => {
      
      const originalText = el.getAttribute('data-original-text') || el.textContent.trim();
      return {
        id: `opt-${i}`, // Ensure unique ID for Dnd-kit
        text: originalText,
      };
    }).filter(option => option.text !== ''); // Only keep options with actual text

    return newOptions;
  };

  useEffect(() => {
    
    if (editorRef.current && editorRef.current.innerHTML !== question.clozeText) {
      editorRef.current.innerHTML = question.clozeText || '';
    }
    setCurrentHtml(question.clozeText || ''); 
    setOptions(extractOptionsFromHtml(question.clozeText || '')); 
  }, [question.clozeText]); 

 
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );


  const syncContentToState = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML; 
    setCurrentHtml(content); 
    const newOptions = extractOptionsFromHtml(content);
    setOptions(newOptions); 

    onChange({
      ...question,
      clozeText: content,
      options: newOptions.map((o) => o.text), 
    });
  };


  function toggleUnderline() {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();

    if (selectedText.length === 0) {
      alert('Please select some text to underline.');
      return;
    }

   
    const uElement = document.createElement('u');
    
    uElement.setAttribute('data-original-text', selectedText);
    
    uElement.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'; 

   
    range.deleteContents();
    range.insertNode(uElement);
    syncContentToState();

    
    const newRange = document.createRange();
    const newSelection = window.getSelection();
    newRange.setStartAfter(uElement);
    newRange.collapse(true);
    newSelection.removeAllRanges();
    newSelection.addRange(newRange);
    editorRef.current.focus();
  }

  
  function handleDragEnd(event) {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = options.findIndex((o) => o.id === active.id);
    const newIndex = options.findIndex((o) => o.id === over.id);

    const newOpts = arrayMove(options, oldIndex, newIndex);

    setOptions(newOpts); // Update local options state

    onChange({
      ...question,
      clozeText: currentHtml, // Use currentHtml from state, as the DOM content wasn't directly changed by drag
      options: newOpts.map((o) => o.text), // Send only the text of options to parent
    });
  }

  const getPreviewHtml = () => {
    if (!currentHtml) return 'No content yet. Type something and underline to create blanks.';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentHtml; // Use the current HTML content

    // Find all <u> elements in the temporary div
    const uElements = Array.from(tempDiv.querySelectorAll('u'));

    // Replace the content of each <u> with a visual blank placeholder
    uElements.forEach(u => {
      u.innerHTML = '_____'; 
      u.style.textDecoration = 'none'; 
      u.style.borderBottom = '1px solid #116466'; 
      u.style.padding = '0 5px';
      u.style.display = 'inline-block';
      u.style.minWidth = '50px';
      u.style.textAlign = 'center';
      u.style.borderRadius = '2px';
    });

    return tempDiv.innerHTML;
  };

  return (
    <div className="mt-3 max-w-xl mx-auto">
      <label className="block text-[#116466] font-semibold mb-2">Cloze Editor</label>

      {/* Button to underline selected text */}
      <button
        type="button"
        onClick={toggleUnderline}
        className="mb-2 px-3 py-1 bg-[#116466] text-white rounded hover:bg-[#0e4f48]"
      >
        U
      </button>

      {/* Content editable div for the cloze text */}
      <div
        ref={editorRef}
        contentEditable={true} // Explicitly set to true
        onInput={syncContentToState} // Call sync function on every input change
        onBlur={syncContentToState} // Call sync function when the div loses focus
        className="min-h-[140px] border border-[#116466] rounded p-3 outline-none whitespace-pre-wrap"
        spellCheck={false} // Disable browser spell check
        aria-multiline="true" // Accessibility attribute
        role="textbox" // Accessibility role
        
        style={{ cursor: 'text', direction: 'ltr', unicodeBidi: 'plaintext', textAlign: 'left' }}
      />

      <p className="mt-1 text-sm text-[#116466]/70 italic">
        Select text and click <b>U</b> to underline blanks.
      </p>

      {/* Live Preview Section */}
      <div className="mt-6 p-4 border border-[#FF6F91] rounded-lg bg-[#FFE8D6] shadow-inner">
        <h4 className="text-[#FF6F91] font-semibold mb-2">Live Preview:</h4>
        <div
          className="text-lg text-[#333] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
        />
      </div>


      {/* Section to display and reorder extracted options */}
      <div className="mt-4">
        <h4 className="text-[#116466] font-semibold mb-2">Options (Drag to reorder)</h4>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={options.map((o) => o.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="list-none p-0 max-h-40 overflow-auto border border-[#116466] rounded-md">
              {options.length === 0 && (
                <li className="p-2 text-sm text-[#116466]/50 italic">
                  No blanks detected yet.
                </li>
              )}
              {options.map(({ id, text }) => (
                <SortableOption key={id} id={id} value={text} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
