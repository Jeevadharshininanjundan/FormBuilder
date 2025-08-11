/*
import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
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
  question = question || { clozeText: '', options: [] };
  onChange = onChange || (() => {});

  const editorRef = useRef(null);
  const [html, setHtml] = useState(question.clozeText || '');
  const [options, setOptions] = useState(
    (question.options || []).map((text, i) => ({ id: `opt-${i}`, text }))
  );

  // Sync props changes
  useEffect(() => {
    setHtml(question.clozeText || '');
    setOptions(
      (question.options || []).map((text, i) => ({ id: `opt-${i}`, text }))
    );
  }, [question.clozeText, question.options]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Toggle underline on selected text
  function toggleUnderline() {
    document.execCommand('underline');
    updateHtml();
  }

  // Update html state and extract options
  function updateHtml() {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;
    setHtml(content);

    // Extract underlined <u> blanks
    const div = document.createElement('div');
    div.innerHTML = content;
    const uElements = Array.from(div.querySelectorAll('u')).filter(
      (el) => el.textContent.trim() !== ''
    );
    const newOptions = uElements.map((el, i) => ({
      id: `opt-${i}`,
      text: el.textContent,
    }));

    setOptions(newOptions);
    onChange({
      ...question,
      clozeText: content,
      options: newOptions.map((o) => o.text),
    });
  }
  
  // Handle typing/input in contentEditable
  function handleInput() {
    updateHtml();
  }

  // Handle drag end to reorder options
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = options.findIndex((o) => o.id === active.id);
    const newIndex = options.findIndex((o) => o.id === over.id);

    const newOpts = Array.from(options);
    const [moved] = newOpts.splice(oldIndex, 1);
    newOpts.splice(newIndex, 0, moved);

    setOptions(newOpts);

    onChange({
      ...question,
      clozeText: html,
      options: newOpts.map((o) => o.text),
    });
  }

  return (
    <div className="mt-3 max-w-xl mx-auto">
      <label className="block text-[#116466] font-semibold mb-2">Cloze Editor</label>

      <button
        type="button"
        onClick={toggleUnderline}
        className="mb-2 px-3 py-1 bg-[#116466] text-white rounded hover:bg-[#0e4f48]"
      >
        U
      </button>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: html }}
        className="min-h-[140px] border border-[#116466] rounded p-3 outline-none whitespace-pre-wrap"
        spellCheck={false}
        aria-multiline="true"
        role="textbox"
        style={{ cursor: 'text', direction: 'ltr', unicodeBidi: 'plaintext' }}
      />

      <p className="mt-1 text-sm text-[#116466]/70 italic">
        Select text and click <b>U</b> to underline blanks.
      </p>

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
*/
/*
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

  // Helper function to extract underlined options from HTML content
  const extractOptionsFromHtml = (content) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const uElements = Array.from(div.querySelectorAll('u')).filter(
      (el) => el.textContent.trim() !== '' // Only consider non-empty underlines
    );
    // Map underlined elements to new option objects with unique IDs
    return uElements.map((el, i) => ({
      id: `opt-${i}`, // Ensure unique ID for Dnd-kit
      text: el.textContent,
    }));
  };

  // --- useEffect to sync external changes and initial load ---
  useEffect(() => {
    // Only update the DOM if the prop `question.clozeText` actually differs
    // from what's currently in the contentEditable div. This prevents unnecessary
    // DOM manipulations that could disrupt typing.
    if (editorRef.current && editorRef.current.innerHTML !== question.clozeText) {
      editorRef.current.innerHTML = question.clozeText || '';
    }
    setCurrentHtml(question.clozeText || ''); // Update React state
    setOptions(extractOptionsFromHtml(question.clozeText || '')); // Extract options from initial/updated text
  }, [question.clozeText]); // Dependency on question.clozeText ensures it runs when parent changes

  // Dnd Kit sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // --- Function to sync contentEditable DOM with React state and parent ---
  // This function is called when the content changes, or on blur, or after execCommand
  const syncContentToState = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML; // Read current content directly from DOM
    setCurrentHtml(content); // Update React state with DOM's latest HTML

    const newOptions = extractOptionsFromHtml(content);
    setOptions(newOptions); // Update extracted options state

    // Propagate changes up to the parent component
    onChange({
      ...question,
      clozeText: content,
      options: newOptions.map((o) => o.text), // Send only the text of options to parent
    });
  };

  // Toggles underline formatting on selected text in the contentEditable div
  function toggleUnderline() {
    document.execCommand('underline');
    // After executing command, manually sync content to state
    syncContentToState();
    // Re-focus the editor if it lost focus (common after execCommand)
    if (editorRef.current) {
        editorRef.current.focus();
    }
  }

  // Handles the end of a drag operation for reordering options
  function handleDragEnd(event) {
    const { active, over } = event;
    // If an item was dragged but not dropped over a valid target, or if dropped on itself, do nothing
    if (!over || active.id === over.id) return;

    const oldIndex = options.findIndex((o) => o.id === active.id);
    const newIndex = options.findIndex((o) => o.id === over.id);

    // Reorder the options array using arrayMove from dnd-kit/sortable
    const newOpts = arrayMove(options, oldIndex, newIndex);

    setOptions(newOpts); // Update local options state

    // Propagate reordered options to the parent
    onChange({
      ...question,
      clozeText: currentHtml, // Use currentHtml from state, as the DOM content wasn't directly changed
      options: newOpts.map((o) => o.text), // Send only the text of options to parent
    });
  }

  return (
    <div className="mt-3 max-w-xl mx-auto">
      <label className="block text-[#116466] font-semibold mb-2">Cloze Editor</label>

     
      <button
        type="button"
        onClick={toggleUnderline}
        className="mb-2 px-3 py-1 bg-[#116466] text-white rounded hover:bg-[#0e4f48]"
      >
        U
      </button>

    
      <div
        ref={editorRef}
        contentEditable={true} // Explicitly set to true
        onInput={syncContentToState} // Call sync function on every input change
        onBlur={syncContentToState} // Call sync function when the div loses focus
        // IMPORTANT: We REMOVE dangerouslySetInnerHTML here.
        // The HTML content is set directly via editorRef.current.innerHTML in useEffect.
        // This allows the browser to handle direct text input more smoothly.
        className="min-h-[140px] border border-[#116466] rounded p-3 outline-none whitespace-pre-wrap"
        spellCheck={false} // Disable browser spell check
        aria-multiline="true" // Accessibility attribute
        role="textbox" // Accessibility role
        // Explicit styles for cursor and text direction/alignment
        style={{ cursor: 'text', direction: 'ltr', unicodeBidi: 'plaintext', textAlign: 'left' }}
      />

      <p className="mt-1 text-sm text-[#116466]/70 italic">
        Select text and click <b>U</b> to underline blanks.
      </p>


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
*/
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

  // Helper function to extract underlined options from HTML content
  const extractOptionsFromHtml = (content) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const uElements = Array.from(div.querySelectorAll('u'));

    // Filter out empty underlines and map to option objects
    const newOptions = uElements.map((el, i) => {
      // Use a custom data attribute to store the original text of the blank
      // This is crucial because the editor will display it as an empty blank
      const originalText = el.getAttribute('data-original-text') || el.textContent.trim();
      return {
        id: `opt-${i}`, // Ensure unique ID for Dnd-kit
        text: originalText,
      };
    }).filter(option => option.text !== ''); // Only keep options with actual text

    return newOptions;
  };

  // --- useEffect to sync external changes and initial load ---
  useEffect(() => {
    // Only update the DOM if the prop `question.clozeText` actually differs
    // from what's currently in the contentEditable div. This prevents unnecessary
    // DOM manipulations that could disrupt typing.
    if (editorRef.current && editorRef.current.innerHTML !== question.clozeText) {
      editorRef.current.innerHTML = question.clozeText || '';
    }
    setCurrentHtml(question.clozeText || ''); // Update React state
    setOptions(extractOptionsFromHtml(question.clozeText || '')); // Extract options from initial/updated text
  }, [question.clozeText]); // Dependency on question.clozeText ensures it runs when parent changes

  // Dnd Kit sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // --- Function to sync contentEditable DOM with React state and parent ---
  // This function is called when the content changes, or on blur, or after execCommand
  const syncContentToState = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML; // Read current content directly from DOM
    setCurrentHtml(content); // Update React state with DOM's latest HTML

    const newOptions = extractOptionsFromHtml(content);
    setOptions(newOptions); // Update extracted options state

    // Propagate changes up to the parent component
    onChange({
      ...question,
      clozeText: content,
      options: newOptions.map((o) => o.text), // Send only the text of options to parent
    });
  };

  // Manually creates an underlined blank and replaces the selected text
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

    // Create a new <u> element
    const uElement = document.createElement('u');
    // Store the original selected text as a data attribute
    uElement.setAttribute('data-original-text', selectedText);
    // Replace the content of the <u> tag with non-breaking spaces for a visual blank
    uElement.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'; // A few spaces to make it visible

    // Replace the selected content with our new <u> element
    range.deleteContents();
    range.insertNode(uElement);

    // After modifying the DOM, sync the state
    syncContentToState();

    // Re-focus the editor and restore cursor position after the inserted blank
    const newRange = document.createRange();
    const newSelection = window.getSelection();
    newRange.setStartAfter(uElement);
    newRange.collapse(true);
    newSelection.removeAllRanges();
    newSelection.addRange(newRange);
    editorRef.current.focus();
  }

  // Handles the end of a drag operation for reordering options
  function handleDragEnd(event) {
    const { active, over } = event;
    // If an item was dragged but not dropped over a valid target, or if dropped on itself, do nothing
    if (!over || active.id === over.id) return;

    const oldIndex = options.findIndex((o) => o.id === active.id);
    const newIndex = options.findIndex((o) => o.id === over.id);

    // Reorder the options array using arrayMove from dnd-kit/sortable
    const newOpts = arrayMove(options, oldIndex, newIndex);

    setOptions(newOpts); // Update local options state

    // Propagate reordered options to the parent
    onChange({
      ...question,
      clozeText: currentHtml, // Use currentHtml from state, as the DOM content wasn't directly changed by drag
      options: newOpts.map((o) => o.text), // Send only the text of options to parent
    });
  }

  // Generate the preview HTML for display
  const getPreviewHtml = () => {
    if (!currentHtml) return 'No content yet. Type something and underline to create blanks.';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentHtml; // Use the current HTML content

    // Find all <u> elements in the temporary div
    const uElements = Array.from(tempDiv.querySelectorAll('u'));

    // Replace the content of each <u> with a visual blank placeholder
    uElements.forEach(u => {
      u.innerHTML = '_____'; // A simple placeholder for the blank
      u.style.textDecoration = 'none'; // Remove underline for a cleaner blank look
      u.style.borderBottom = '1px solid #116466'; // Add a border bottom for blank look
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
        // Explicit styles for cursor and text direction/alignment
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
