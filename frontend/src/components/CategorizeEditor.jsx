
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
