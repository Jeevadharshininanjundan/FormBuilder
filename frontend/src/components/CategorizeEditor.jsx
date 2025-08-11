/*// frontend/src/components/CategorizeEditor.jsx
import React from 'react';

export default function CategorizeEditor({ question, onChange }) {
  function addCategory() {
    const name = prompt('Category name');
    if (!name) return;
    onChange({ ...question, categories: [...(question.categories || []), name] });
  }

  function addOption() {
    const name = prompt('Option text');
    if (!name) return;
    onChange({ ...question, options: [...(question.options || []), name] });
  }

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <button onClick={addCategory} className="px-2 py-1 border rounded">Add category</button>
        <button onClick={addOption} className="px-2 py-1 border rounded">Add option</button>
      </div>

      <div className="flex gap-6">
        <div>
          <h4 className="font-medium">Categories</h4>
          <ul className="mt-1 text-sm">
            {(question.categories || []).map((c, i) => <li key={i} className="py-0.5">{c}</li>)}
          </ul>
        </div>

        <div>
          <h4 className="font-medium">Options</h4>
          <ul className="mt-1 text-sm">
            {(question.options || []).map((o, i) => <li key={i} className="py-0.5">{o}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
*/
/*
import React, { useState } from 'react';

export default function CategorizeEditor({ question, onChange }) {
  const [newCategory, setNewCategory] = useState('');
  const [newOption, setNewOption] = useState('');

  function addCategory() {
    if (newCategory.trim() === '') return;
    onChange({ ...question, categories: [...(question.categories || []), newCategory.trim()] });
    setNewCategory('');
  }

  function removeCategory(index) {
    const categories = [...(question.categories || [])];
    categories.splice(index, 1);
    onChange({ ...question, categories });
  }

  function addOption() {
    if (newOption.trim() === '') return;
    onChange({ ...question, options: [...(question.options || []), newOption.trim()] });
    setNewOption('');
  }

  function removeOption(index) {
    const options = [...(question.options || [])];
    options.splice(index, 1);
    onChange({ ...question, options });
  }

  return (
    <div className="mt-3">
      <div className="flex flex-col md:flex-row gap-6">
       
        <div className="flex-1">
          <h4 className="text-[#116466] font-semibold mb-2">Categories</h4>
          <ul className="list-disc list-inside text-sm max-h-48 overflow-auto border border-[#116466]/40 rounded p-3 bg-[#FFE8D6]">
            {(question.categories || []).map((cat, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{cat}</span>
                <button
                  onClick={() => removeCategory(i)}
                  className="text-[#FF6F91] font-bold hover:text-[#d25273] ml-2"
                  aria-label={`Remove category ${cat}`}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
            />
            <button
              onClick={addCategory}
              className="bg-[#116466] hover:bg-[#0e4f48] text-white px-4 rounded font-semibold transition"
              aria-label="Add category"
            >
              Add
            </button>
          </div>
        </div>

     
        <div className="flex-1">
          <h4 className="text-[#116466] font-semibold mb-2">Options</h4>
          <ul className="list-disc list-inside text-sm max-h-48 overflow-auto border border-[#116466]/40 rounded p-3 bg-[#FFE8D6]">
            {(question.options || []).map((opt, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{opt}</span>
                <button
                  onClick={() => removeOption(i)}
                  className="text-[#FF6F91] font-bold hover:text-[#d25273] ml-2"
                  aria-label={`Remove option ${opt}`}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="New option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
            />
            <button
              onClick={addOption}
              className="bg-[#FF6F91] hover:bg-[#e55f7d] text-white px-4 rounded font-semibold transition"
              aria-label="Add option"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
*/
/*
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function CategorizeEditor({ question, onChange }) {
  const [newCategory, setNewCategory] = useState('');
  const [newOption, setNewOption] = useState('');

  function addCategory() {
    if (newCategory.trim() === '') return;
    onChange({ ...question, categories: [...(question.categories || []), newCategory.trim()] });
    setNewCategory('');
  }

  function addOption() {
    if (newOption.trim() === '') return;
    onChange({ ...question, options: [...(question.options || []), newOption.trim()] });
    setNewOption('');
  }

  function removeCategory(index) {
    const categories = [...(question.categories || [])];
    categories.splice(index, 1);
    onChange({ ...question, categories });
  }

  function removeOption(index) {
    const options = [...(question.options || [])];
    options.splice(index, 1);
    onChange({ ...question, options });
  }

  function onDragEnd(result) {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'category') {
      const items = Array.from(question.categories || []);
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);
      onChange({ ...question, categories: items });
    } else if (type === 'option') {
      const items = Array.from(question.options || []);
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);
      onChange({ ...question, options: items });
    }
  }

  return (
    <div className="mt-3">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6">
         
          <Droppable droppableId="categories" type="category">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex-1"
              >
                <h4 className="text-[#116466] font-semibold mb-2">Categories</h4>
                <ul className="max-h-48 overflow-auto rounded border border-[#116466]/40 bg-[#FFE8D6] p-3 list-disc list-inside text-sm shadow-md">
                  {(question.categories || []).map((cat, i) => (
                    <Draggable draggableId={`cat-${i}`} index={i} key={`cat-${i}`}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex justify-between items-center mb-1 rounded p-2 ${
                            snapshot.isDragging ? 'bg-[#FF6F91]/40' : ''
                          }`}
                        >
                          <span>{cat}</span>
                          <button
                            onClick={() => removeCategory(i)}
                            className="text-[#FF6F91] font-bold hover:text-[#d25273] ml-2"
                            aria-label={`Remove category ${cat}`}
                          >
                            &times;
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="New category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
                  />
                  <button
                    onClick={addCategory}
                    className="bg-[#116466] hover:bg-[#0e4f48] text-white px-4 rounded font-semibold transition"
                    aria-label="Add category"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </Droppable>

          
          <Droppable droppableId="options" type="option">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex-1"
              >
                <h4 className="text-[#116466] font-semibold mb-2">Options</h4>
                <ul className="max-h-48 overflow-auto rounded border border-[#116466]/40 bg-[#FFE8D6] p-3 list-disc list-inside text-sm shadow-md">
                  {(question.options || []).map((opt, i) => (
                    <Draggable draggableId={`opt-${i}`} index={i} key={`opt-${i}`}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex justify-between items-center mb-1 rounded p-2 ${
                            snapshot.isDragging ? 'bg-[#FF6F91]/40' : ''
                          }`}
                        >
                          <span>{opt}</span>
                          <button
                            onClick={() => removeOption(i)}
                            className="text-[#FF6F91] font-bold hover:text-[#d25273] ml-2"
                            aria-label={`Remove option ${opt}`}
                          >
                            &times;
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="New option"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
                  />
                  <button
                    onClick={addOption}
                    className="bg-[#FF6F91] hover:bg-[#e55f7d] text-white px-4 rounded font-semibold transition"
                    aria-label="Add option"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}
*/
/*
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function CategorizeEditor({ question, onChange }) {
  const [newCategory, setNewCategory] = useState('');
  const [newOption, setNewOption] = useState('');
  const [optionCategoryMap, setOptionCategoryMap] = useState(
    question.optionCategoryMap || {}
  );

  // Update parent with new structure
  function updateAll(categories, options, optionCategoryMap) {
    onChange({
      ...question,
      categories,
      options,
      optionCategoryMap,
    });
  }

  function addCategory() {
    if (!newCategory.trim()) return;
    const newCategories = [...(question.categories || []), newCategory.trim()];
    updateAll(newCategories, question.options || [], optionCategoryMap);
    setNewCategory('');
  }

  function addOption() {
    if (!newOption.trim()) return;
    const newOptions = [...(question.options || []), newOption.trim()];
    updateAll(question.categories || [], newOptions, optionCategoryMap);
    setNewOption('');
  }

  function removeCategory(index) {
    const categories = [...(question.categories || [])];
    const removed = categories.splice(index, 1)[0];

    // Remove category from optionCategoryMap
    const newOptionCategoryMap = { ...optionCategoryMap };
    for (const opt in newOptionCategoryMap) {
      if (newOptionCategoryMap[opt] === removed) {
        newOptionCategoryMap[opt] = '';
      }
    }

    updateAll(categories, question.options || [], newOptionCategoryMap);
  }

  function removeOption(index) {
    const options = [...(question.options || [])];
    const removedOption = options.splice(index, 1)[0];

    // Remove from optionCategoryMap
    const newOptionCategoryMap = { ...optionCategoryMap };
    delete newOptionCategoryMap[removedOption];

    updateAll(question.categories || [], options, newOptionCategoryMap);
  }

  function onDragEnd(result) {
    if (!result.destination) return;

    if (result.type === 'CATEGORY') {
      const newCategories = Array.from(question.categories || []);
      const [moved] = newCategories.splice(result.source.index, 1);
      newCategories.splice(result.destination.index, 0, moved);
      updateAll(newCategories, question.options || [], optionCategoryMap);
    } else if (result.type === 'OPTION') {
      const newOptions = Array.from(question.options || []);
      const [moved] = newOptions.splice(result.source.index, 1);
      newOptions.splice(result.destination.index, 0, moved);
      updateAll(question.categories || [], newOptions, optionCategoryMap);
    }
  }

  function onOptionCategoryChange(option, category) {
    const newMap = { ...optionCategoryMap, [option]: category };
    setOptionCategoryMap(newMap);
    onChange({ ...question, optionCategoryMap: newMap });
  }

  return (
    <div className="mt-3">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6">
    
          <Droppable droppableId="categories" type="CATEGORY">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex-1"
              >
                <h4 className="text-[#116466] font-semibold mb-2">Categories</h4>
                <ul className="list-disc list-inside text-sm max-h-48 overflow-auto border border-[#116466]/40 rounded p-3 bg-[#FFE8D6]">
                  {(question.categories || []).map((cat, i) => (
                    <Draggable draggableId={`cat-${cat}`} index={i} key={cat}>
                      {(prov) => (
                        <li
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="flex justify-between items-center"
                        >
                          <span>{cat}</span>
                          <button
                            onClick={() => removeCategory(i)}
                            className="text-[#FF6F91] font-bold hover:text-[#d25273] ml-2"
                            aria-label={`Remove category ${cat}`}
                            type="button"
                          >
                            &times;
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="New category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
                  />
                  <button
                    onClick={addCategory}
                    className="bg-[#116466] hover:bg-[#0e4f48] text-white px-4 rounded font-semibold transition"
                    aria-label="Add category"
                    type="button"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </Droppable>

          <Droppable droppableId="options" type="OPTION">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex-1"
              >
                <h4 className="text-[#116466] font-semibold mb-2">Options</h4>
                <ul className="list-disc list-inside text-sm max-h-48 overflow-auto border border-[#116466]/40 rounded p-3 bg-[#FFE8D6]">
                  {(question.options || []).map((opt, i) => (
                    <Draggable draggableId={`opt-${opt}`} index={i} key={opt}>
                      {(prov) => (
                        <li
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="flex justify-between items-center"
                        >
                          <span>{opt}</span>

                        
                          <select
                            value={optionCategoryMap[opt] || ''}
                            onChange={(e) =>
                              onOptionCategoryChange(opt, e.target.value)
                            }
                            className="ml-2 border border-[#116466] rounded px-1 text-sm"
                          >
                            <option value="">--Select Category--</option>
                            {(question.categories || []).map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => removeOption(i)}
                            className="text-[#FF6F91] font-bold hover:text-[#d25273] ml-2"
                            aria-label={`Remove option ${opt}`}
                            type="button"
                          >
                            &times;
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="New option"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
                  />
                  <button
                    onClick={addOption}
                    className="bg-[#FF6F91] hover:bg-[#e55f7d] text-white px-4 rounded font-semibold transition"
                    aria-label="Add option"
                    type="button"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}
*/
/*
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function CategorizeEditor({ question, onChange }) {
  // For internal editing state
  const [categories, setCategories] = useState(question.categories || []);
  const [options, setOptions] = useState(question.options || []);
  const [optionCategoryMap, setOptionCategoryMap] = useState(question.optionCategoryMap || {});
  const [newCategory, setNewCategory] = useState('');
  const [newOption, setNewOption] = useState('');

  // Sync props updates
  useEffect(() => {
    setCategories(question.categories || []);
    setOptions(question.options || []);
    setOptionCategoryMap(question.optionCategoryMap || {});
  }, [question]);

  // When any data changes, notify parent
  function updateParent(updatedCategories, updatedOptions, updatedMap) {
    onChange({
      ...question,
      categories: updatedCategories,
      options: updatedOptions,
      optionCategoryMap: updatedMap,
    });
  }

  function addCategory() {
  if (!newCategory.trim()) return;
  const newCatObj = { id: `cat-${Date.now()}`, name: newCategory.trim() };
  const updatedCategories = [...categories, newCatObj];
  setCategories(updatedCategories);
  updateParent(updatedCategories, options, optionCategoryMap);
  setNewCategory('');
}

function addOption() {
  if (!newOption.trim()) return;
  const newOptObj = { id: `opt-${Date.now()}`, name: newOption.trim() };
  const updatedOptions = [...options, newOptObj];
  setOptions(updatedOptions);
  updateParent(categories, updatedOptions, optionCategoryMap);
  setNewOption('');
}


  function removeCategory(index) {
    const removed = categories[index];
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);

    // Remove category from mapping if assigned
    const updatedMap = { ...optionCategoryMap };
    Object.keys(updatedMap).forEach((opt) => {
      if (updatedMap[opt] === removed) {
        updatedMap[opt] = '';
      }
    });

    setCategories(updatedCategories);
    setOptionCategoryMap(updatedMap);
    updateParent(updatedCategories, options, updatedMap);
  }

  function removeOption(index) {
    const removedOption = options[index];
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);

    const updatedMap = { ...optionCategoryMap };
    delete updatedMap[removedOption];

    setOptions(updatedOptions);
    setOptionCategoryMap(updatedMap);
    updateParent(categories, updatedOptions, updatedMap);
  }

  function onDragEnd(result) {
    if (!result.destination) return;

    const { source, destination, type } = result;

     if (type === 'category') {
      const newCategories = Array.from(categories);
      const [moved] = newCategories.splice(source.index, 1);
      newCategories.splice(destination.index, 0, moved);
      setCategories(newCategories);
      onChange({ ...question, categories: newCategories, options, optionCategoryMap });
    } else if (type === 'option') {
      const newOptions = Array.from(options);
      const [moved] = newOptions.splice(source.index, 1);
      newOptions.splice(destination.index, 0, moved);
      setOptions(newOptions);
      onChange({ ...question, categories, options: newOptions, optionCategoryMap });
    }
  }
  function onOptionCategoryChange(option, category) {
    const updatedMap = { ...optionCategoryMap, [option]: category };
    setOptionCategoryMap(updatedMap);
    updateParent(categories, options, updatedMap);
  }

  return (
    <div className="mt-3">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-8">
         
          <div className="flex-1">
            <h4 className="text-[#116466] font-semibold mb-2">Categories</h4>
            <Droppable droppableId="categories" type="category">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="border border-[#116466]/40 rounded p-3 min-h-[150px] bg-[#FFE8D6] max-h-60 overflow-auto"
                >
                  {categories.map((cat, idx) => (
                    <Draggable draggableId={`cat-${cat}`} index={idx} key={cat}>
                      {(prov) => (
                        <li
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="flex justify-between items-center p-2 mb-2 bg-white rounded shadow cursor-move"
                        >
                          <span>{cat}</span>
                          <button
                            type="button"
                            onClick={() => removeCategory(idx)}
                            className="text-[#FF6F91] font-bold hover:text-[#d25273]"
                            aria-label={`Remove category ${cat}`}
                          >
                            &times;
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
              />
              <button
                type="button"
                onClick={addCategory}
                className="bg-[#116466] hover:bg-[#0e4f48] text-white px-4 rounded font-semibold transition"
                aria-label="Add category"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-[#116466] font-semibold mb-2">Options</h4>
            <Droppable droppableId="options" type="option">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="border border-[#116466]/40 rounded p-3 min-h-[150px] bg-[#FFE8D6] max-h-60 overflow-auto"
                >
                  {options.map((opt, idx) => (
                    <Draggable draggableId={`opt-${opt}`} index={idx} key={opt}>
                      {(prov) => (
                        <li
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="flex justify-between items-center p-2 mb-2 bg-white rounded shadow cursor-move"
                        >
                          <span>{opt}</span>
                          <select
                            value={optionCategoryMap[opt] || ''}
                            onChange={(e) => onOptionCategoryChange(opt, e.target.value)}
                            className="ml-3 border border-[#116466] rounded px-1 text-sm"
                          >
                            <option value="">--Select Category--</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeOption(idx)}
                            className="text-[#FF6F91] font-bold hover:text-[#d25273] ml-2"
                            aria-label={`Remove option ${opt}`}
                          >
                            &times;
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="New option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
              />
              <button
                type="button"
                onClick={addOption}
                className="bg-[#FF6F91] hover:bg-[#e55f7d] text-white px-4 rounded font-semibold transition"
                aria-label="Add option"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
  */
/*
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function CategorizeEditor({ question, onChange }) {
  // keep objects with stable ids
  const [categories, setCategories] = useState(question.categories || []); // [{id, name}, ...]
  const [options, setOptions] = useState(question.options || []);         // [{id, name}, ...]
  const [optionCategoryMap, setOptionCategoryMap] = useState(question.optionCategoryMap || {}); // { optionId: categoryId }
  const [newCategory, setNewCategory] = useState('');
  const [newOption, setNewOption] = useState('');

  // sync parent -> local when parent question changes
  useEffect(() => {
    setCategories(question.categories || []);
    setOptions(question.options || []);
    setOptionCategoryMap(question.optionCategoryMap || {});
  }, [question]);

  // helper to notify parent - parent expects the same shapes
  function updateParent(updatedCategories, updatedOptions, updatedMap) {
    onChange({
      ...question,
      categories: updatedCategories,
      options: updatedOptions,
      optionCategoryMap: updatedMap,
    });
  }

  // generate stable-ish id (ok for client-side only). Replace with uuid if you like.
  const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  function addCategory() {
    if (!newCategory.trim()) return;
    const newCat = { id: makeId('cat'), name: newCategory.trim() };
    const updated = [...categories, newCat];
    setCategories(updated);
    updateParent(updated, options, optionCategoryMap);
    setNewCategory('');
  }

  function addOption() {
    if (!newOption.trim()) return;
    const newOpt = { id: makeId('opt'), name: newOption.trim() };
    const updated = [...options, newOpt];
    setOptions(updated);
    updateParent(categories, updated, optionCategoryMap);
    setNewOption('');
  }

  function removeCategory(index) {
    const removed = categories[index];
    const updatedCats = [...categories];
    updatedCats.splice(index, 1);

    // remove mapping entries that pointed to this category
    const updatedMap = { ...optionCategoryMap };
    Object.keys(updatedMap).forEach((optId) => {
      if (updatedMap[optId] === removed.id) {
        delete updatedMap[optId];
      }
    });

    setCategories(updatedCats);
    setOptionCategoryMap(updatedMap);
    updateParent(updatedCats, options, updatedMap);
  }

  function removeOption(index) {
    const removed = options[index];
    const updatedOpts = [...options];
    updatedOpts.splice(index, 1);

    const updatedMap = { ...optionCategoryMap };
    delete updatedMap[removed.id];

    setOptions(updatedOpts);
    setOptionCategoryMap(updatedMap);
    updateParent(categories, updatedOpts, updatedMap);
  }

  function onOptionCategoryChange(optionId, categoryId) {
    const updatedMap = { ...optionCategoryMap };
    if (!categoryId) delete updatedMap[optionId];
    else updatedMap[optionId] = categoryId;
    setOptionCategoryMap(updatedMap);
    updateParent(categories, options, updatedMap);
  }

  // IMPORTANT: droppableId values are constant strings
  function onDragEnd(result) {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'category') {
      // reorder categories
      const newCats = Array.from(categories);
      const [moved] = newCats.splice(source.index, 1);
      newCats.splice(destination.index, 0, moved);
      setCategories(newCats);
      updateParent(newCats, options, optionCategoryMap);
    } else if (type === 'option') {
      // reorder options
      const newOpts = Array.from(options);
      const [moved] = newOpts.splice(source.index, 1);
      newOpts.splice(destination.index, 0, moved);
      setOptions(newOpts);
      updateParent(categories, newOpts, optionCategoryMap);
    }
  }

  return (
    <div className="mt-3">
      <DragDropContext onDragEnd={onDragEnd} ignoreContainerClipping={false}>
  <div className="flex flex-col md:flex-row gap-8">
   
    <div className="flex-1">
      <h4 className="text-[#116466] font-semibold mb-2">Categories</h4>

      <Droppable droppableId="categories" type="category" isDropDisabled={false} isCombineEnabled={false}>
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="border border-[#116466]/40 rounded p-3 min-h-[150px] bg-[#FFE8D6] max-h-60 overflow-auto"
          >
            {categories.length === 0 && (
              <li className="text-[#666] italic p-2">No categories yet</li>
            )}

            {categories.map((cat, idx) => (
              <Draggable draggableId={cat.id} index={idx} key={cat.id}>
                {(prov) => (
                  <li
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                    className="flex justify-between items-center p-2 mb-2 bg-white rounded shadow cursor-move"
                  >
                    <span>{cat.name}</span>
                    <button
                      type="button"
                      onClick={() => removeCategory(idx)}
                      className="text-[#FF6F91] font-bold hover:text-[#d25273]"
                      aria-label={`Remove category ${cat.name}`}
                    >
                      &times;
                    </button>
                  </li>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </ul>
        )}
      </Droppable>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
        />
        <button
          type="button"
          onClick={addCategory}
          className="bg-[#116466] hover:bg-[#0e4f48] text-white px-4 rounded font-semibold transition"
        >
          Add
        </button>
      </div>
    </div>

   
    <div className="flex-1">
      <h4 className="text-[#116466] font-semibold mb-2">Options</h4>

      <Droppable droppableId="options" type="option" isDropDisabled={false} isCombineEnabled={false}>
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="border border-[#116466]/40 rounded p-3 min-h-[150px] bg-[#FFE8D6] max-h-60 overflow-auto"
          >
            {options.length === 0 && (
              <li className="text-[#666] italic p-2">No options yet</li>
            )}

            {options.map((opt, idx) => (
              <Draggable draggableId={opt.id} index={idx} key={opt.id}>
                {(prov) => (
                  <li
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                    className="flex items-center justify-between p-2 mb-2 bg-white rounded shadow cursor-move"
                  >
                    <div className="flex items-center gap-3">
                      <span>{opt.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={optionCategoryMap[opt.id] || ''}
                        onChange={(e) => onOptionCategoryChange(opt.id, e.target.value)}
                        className="border border-[#116466] rounded px-2 py-1 text-sm"
                      >
                        <option value="">--Select Category--</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="text-[#FF6F91] font-bold hover:text-[#d25273]"
                        aria-label={`Remove option ${opt.name}`}
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </ul>
        )}
      </Droppable>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          placeholder="New option"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
        />
        <button
          type="button"
          onClick={addOption}
          className="bg-[#FF6F91] hover:bg-[#e55f7d] text-white px-4 rounded font-semibold transition"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</DragDropContext>

    </div>
  );
}
*/
/*
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function CategorizeEditor({ question, onChange }) {
  // keep objects with stable ids
  const [categories, setCategories] = useState(question.categories || []); // [{id, name}, ...]
  const [options, setOptions] = useState(question.options || []);         // [{id, name}, ...]
  const [optionCategoryMap, setOptionCategoryMap] = useState(question.optionCategoryMap || {}); // { optionId: categoryId }
  const [newCategory, setNewCategory] = useState('');
  const [newOption, setNewOption] = useState('');

  // sync parent -> local when parent question changes
  useEffect(() => {
    setCategories(question.categories || []);
    setOptions(question.options || []);
    setOptionCategoryMap(question.optionCategoryMap || {});
  }, [question]);

  // helper to notify parent - parent expects the same shapes
  function updateParent(updatedCategories, updatedOptions, updatedMap) {
    onChange({
      ...question,
      categories: updatedCategories,
      options: updatedOptions,
      optionCategoryMap: updatedMap,
    });
  }

  // generate stable-ish id (ok for client-side only). Replace with uuid if you like.
  const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  function addCategory() {
    if (!newCategory.trim()) return;
    const newCat = { id: makeId('cat'), name: newCategory.trim() };
    const updated = [...categories, newCat];
    setCategories(updated);
    updateParent(updated, options, optionCategoryMap);
    setNewCategory('');
  }

  function addOption() {
    if (!newOption.trim()) return;
    const newOpt = { id: makeId('opt'), name: newOption.trim() };
    const updated = [...options, newOpt];
    setOptions(updated);
    updateParent(categories, updated, optionCategoryMap);
    setNewOption('');
  }

  function removeCategory(index) {
    const removed = categories[index];
    const updatedCats = [...categories];
    updatedCats.splice(index, 1);

    // remove mapping entries that pointed to this category
    const updatedMap = { ...optionCategoryMap };
    Object.keys(updatedMap).forEach((optId) => {
      if (updatedMap[optId] === removed.id) {
        delete updatedMap[optId];
      }
    });

    setCategories(updatedCats);
    setOptionCategoryMap(updatedMap);
    updateParent(updatedCats, options, updatedMap);
  }

  function removeOption(index) {
    const removed = options[index];
    const updatedOpts = [...options];
    updatedOpts.splice(index, 1);

    const updatedMap = { ...optionCategoryMap };
    delete updatedMap[removed.id];

    setOptions(updatedOpts);
    setOptionCategoryMap(updatedMap);
    updateParent(categories, updatedOpts, updatedMap);
  }

  function onOptionCategoryChange(optionId, categoryId) {
    const updatedMap = { ...optionCategoryMap };
    if (!categoryId) delete updatedMap[optionId];
    else updatedMap[optionId] = categoryId;
    setOptionCategoryMap(updatedMap);
    updateParent(categories, options, updatedMap);
  }

  // IMPORTANT: droppableId values are constant strings
  function onDragEnd(result) {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'category') {
      // reorder categories
      const newCats = Array.from(categories);
      const [moved] = newCats.splice(source.index, 1);
      newCats.splice(destination.index, 0, moved);
      setCategories(newCats);
      updateParent(newCats, options, optionCategoryMap);
    } else if (type === 'option') {
      // reorder options
      const newOpts = Array.from(options);
      const [moved] = newOpts.splice(source.index, 1);
      newOpts.splice(destination.index, 0, moved);
      setOptions(newOpts);
      updateParent(categories, newOpts, optionCategoryMap);
    }
  }

  return (
    <div className="mt-3">
      <DragDropContext onDragEnd={onDragEnd} ignoreContainerClipping={false}>
        <div className="flex flex-col md:flex-row gap-8">
         
          <div className="flex-1">
            <h4 className="text-[#116466] font-semibold mb-2">Categories</h4>

            <Droppable droppableId="categories" type="category" isDropDisabled={false} isCombineEnabled={false}>
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="border border-[#116466]/40 rounded p-3 min-h-[150px] bg-[#FFE8D6] max-h-60 overflow-auto"
                >
                  {categories.length === 0 && (
                    <li className="text-[#666] italic p-2">No categories yet</li>
                  )}

                  {categories.map((cat, idx) => (
                    <Draggable draggableId={cat.id} index={idx} key={cat.id}>
                      {(prov) => (
                        <li
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="flex justify-between items-center p-2 mb-2 bg-white rounded shadow cursor-move"
                        >
                          <span>{cat.name}</span>
                          <button
                            type="button"
                            onClick={() => removeCategory(idx)}
                            className="text-[#FF6F91] font-bold hover:text-[#d25273]"
                            aria-label={`Remove category ${cat.name}`}
                          >
                            &times;
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </ul>
              )}
            </Droppable>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
              />
              <button
                type="button"
                onClick={addCategory}
                className="bg-[#116466] hover:bg-[#0e4f48] text-white px-4 rounded font-semibold transition"
              >
                Add
              </button>
            </div>
          </div>

       
          <div className="flex-1">
            <h4 className="text-[#116466] font-semibold mb-2">Options</h4>

            <Droppable droppableId="options" type="option" isDropDisabled={false} isCombineEnabled={false}>
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="border border-[#116466]/40 rounded p-3 min-h-[150px] bg-[#FFE8D6] max-h-60 overflow-auto"
                >
                  {options.length === 0 && (
                    <li className="text-[#666] italic p-2">No options yet</li>
                  )}

                  {options.map((opt, idx) => (
                    <Draggable draggableId={opt.id} index={idx} key={opt.id}>
                      {(prov) => (
                        <li
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="flex items-center justify-between p-2 mb-2 bg-white rounded shadow cursor-move"
                        >
                          <div className="flex items-center gap-3">
                            <span>{opt.name}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={optionCategoryMap[opt.id] || ''}
                              onChange={(e) => onOptionCategoryChange(opt.id, e.target.value)}
                              className="border border-[#116466] rounded px-2 py-1 text-sm"
                            >
                              <option value="">--Select Category--</option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() => removeOption(idx)}
                              className="text-[#FF6F91] font-bold hover:text-[#d25273]"
                              aria-label={`Remove option ${opt.name}`}
                            >
                              &times;
                            </button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </ul>
              )}
            </Droppable>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="New option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
              />
              <button
                type="button"
                onClick={addOption}
                className="bg-[#FF6F91] hover:bg-[#e55f7d] text-white px-4 rounded font-semibold transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

*/
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
 
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Item for both Categories and Options
function SortableItem({ id, children, onRemove, dragHandleLabel }) {
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
    cursor: "grab",
    userSelect: "none",
    padding: "0.5rem 1rem",
    marginBottom: "0.5rem",
    backgroundColor: "#fff",
    borderRadius: "6px",
    boxShadow: "0 1px 4px rgb(0 0 0 / 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners} aria-label={dragHandleLabel} style={{ flexGrow: 1 }}>
        {children}
      </div>
      <button
        onClick={onRemove}
        className="text-[#FF6F91] font-bold hover:text-[#d25273] ml-4"
        aria-label={`Remove ${children}`}
        type="button"
      >
        &times;
      </button>
    </li>
  );
}

export default function CategorizeEditor({ question, onChange }) {
  const [categories, setCategories] = useState(question.categories || []);
  const [options, setOptions] = useState(question.options || []);
  const [optionCategoryMap, setOptionCategoryMap] = useState(
    question.optionCategoryMap || {}
  );
  const [newCategory, setNewCategory] = useState("");
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    setCategories(question.categories || []);
    setOptions(question.options || []);
    setOptionCategoryMap(question.optionCategoryMap || {});
  }, [question]);

  function updateParent(updatedCategories, updatedOptions, updatedMap) {
    onChange({
      ...question,
      categories: updatedCategories,
      options: updatedOptions,
      optionCategoryMap: updatedMap,
    });
  }

  const makeId = (prefix) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  function addCategory() {
    if (!newCategory.trim()) return;
    const newCat = { id: makeId("cat"), name: newCategory.trim() };
    const updated = [...categories, newCat];
    setCategories(updated);
    updateParent(updated, options, optionCategoryMap);
    setNewCategory("");
  }

  function addOption() {
    if (!newOption.trim()) return;
    const newOpt = { id: makeId("opt"), name: newOption.trim() };
    const updated = [...options, newOpt];
    setOptions(updated);
    updateParent(categories, updated, optionCategoryMap);
    setNewOption("");
  }

  function removeCategory(index) {
    const removed = categories[index];
    const updatedCats = [...categories];
    updatedCats.splice(index, 1);

    // Remove mappings pointing to this category
    const updatedMap = { ...optionCategoryMap };
    Object.keys(updatedMap).forEach((optId) => {
      if (updatedMap[optId] === removed.id) {
        delete updatedMap[optId];
      }
    });

    setCategories(updatedCats);
    setOptionCategoryMap(updatedMap);
    updateParent(updatedCats, options, updatedMap);
  }

  function removeOption(index) {
    const removed = options[index];
    const updatedOpts = [...options];
    updatedOpts.splice(index, 1);

    const updatedMap = { ...optionCategoryMap };
    delete updatedMap[removed.id];

    setOptions(updatedOpts);
    setOptionCategoryMap(updatedMap);
    updateParent(categories, updatedOpts, updatedMap);
  }

  function onOptionCategoryChange(optionId, categoryId) {
    const updatedMap = { ...optionCategoryMap };
    if (!categoryId) delete updatedMap[optionId];
    else updatedMap[optionId] = categoryId;
    setOptionCategoryMap(updatedMap);
    updateParent(categories, options, updatedMap);
  }

  // DnD sensors
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Handle drag end for categories and options
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    // Dragging categories
    if (categories.find((cat) => cat.id === active.id)) {
      if (active.id !== over.id) {
        const oldIndex = categories.findIndex((cat) => cat.id === active.id);
        const newIndex = categories.findIndex((cat) => cat.id === over.id);
        const newCats = arrayMove(categories, oldIndex, newIndex);
        setCategories(newCats);
        updateParent(newCats, options, optionCategoryMap);
      }
    }

    // Dragging options
    else if (options.find((opt) => opt.id === active.id)) {
      if (active.id !== over.id) {
        const oldIndex = options.findIndex((opt) => opt.id === active.id);
        const newIndex = options.findIndex((opt) => opt.id === over.id);
        const newOpts = arrayMove(options, oldIndex, newIndex);
        setOptions(newOpts);
        updateParent(categories, newOpts, optionCategoryMap);
      }
    }
  }

  return (
    <div className="mt-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Categories Section */}
          <div className="flex-1">
            <h4 className="text-[#116466] font-semibold mb-2">Categories</h4>

            <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <ul className="border border-[#116466]/40 rounded p-3 min-h-[150px] bg-[#FFE8D6] max-h-60 overflow-auto">
                {categories.length === 0 && (
                  <li className="text-[#666] italic p-2">No categories yet</li>
                )}
                {categories.map((cat, idx) => (
                  <SortableItem
                    key={cat.id}
                    id={cat.id}
                    onRemove={() => removeCategory(idx)}
                    dragHandleLabel={`Drag category ${cat.name}`}
                  >
                    {cat.name}
                  </SortableItem>
                ))}
              </ul>
            </SortableContext>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
              />
              <button
                type="button"
                onClick={addCategory}
                className="bg-[#116466] hover:bg-[#0e4f48] text-white px-4 rounded font-semibold transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Options Section */}
          <div className="flex-1">
            <h4 className="text-[#116466] font-semibold mb-2">Options</h4>

            <SortableContext items={options.map((o) => o.id)} strategy={verticalListSortingStrategy}>
              <ul className="border border-[#116466]/40 rounded p-3 min-h-[150px] bg-[#FFE8D6] max-h-60 overflow-auto">
                {options.length === 0 && (
                  <li className="text-[#666] italic p-2">No options yet</li>
                )}
                {options.map((opt, idx) => (
                  <SortableItem
                    key={opt.id}
                    id={opt.id}
                    onRemove={() => removeOption(idx)}
                    dragHandleLabel={`Drag option ${opt.name}`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{opt.name}</span>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <select
                        value={optionCategoryMap[opt.id] || ""}
                        onChange={(e) => onOptionCategoryChange(opt.id, e.target.value)}
                        className="border border-[#116466] rounded px-2 py-1 text-sm"
                      >
                        <option value="">--Select Category--</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </SortableItem>
                ))}
              </ul>
            </SortableContext>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="New option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                className="border border-[#116466] rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
              />
              <button
                type="button"
                onClick={addOption}
                className="bg-[#FF6F91] hover:bg-[#e55f7d] text-white px-4 rounded font-semibold transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
