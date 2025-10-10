"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

/**
 * Centralized, Reusable KanbanBoard Component
 *
 * This component replaces ALL old buggy Kanban implementations throughout the project.
 * It uses react-beautiful-dnd for 100% reliable drag-and-drop functionality.
 *
 * @param {Object} columns - Object containing columns and their cards { columnId: [card1, card2] }
 * @param {Function} onDragEnd - Callback when drag ends (result) => void
 * @param {Function} renderCard - Function to render each card (card, provided, snapshot) => JSX
 * @param {Function} renderColumnHeader - Function to render column header (column, cardsCount) => JSX
 * @param {String} className - Additional CSS classes
 */
export default function KanbanBoard({
  columns = {},
  onDragEnd,
  renderCard,
  renderColumnHeader,
  className = "",
}) {
  const [mounted, setMounted] = useState(false);

  // Prevent SSR issues with react-beautiful-dnd
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If no destination or dropped in same position, do nothing
    if (!destination ||
        (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // Call the parent's onDragEnd handler
    if (onDragEnd) {
      onDragEnd(result);
    }
  };

  // Don't render until mounted to avoid SSR issues
  if (!mounted) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
  }

  // Get column order
  const columnOrder = Object.keys(columns);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`flex gap-6 overflow-x-auto pb-4 min-h-screen ${className}`}>
        {columnOrder.map((columnId) => {
          const columnCards = columns[columnId] || [];

          return (
            <div key={columnId} className="flex-shrink-0 w-80">
              {/* Column Header */}
              {renderColumnHeader && renderColumnHeader(columnId, columnCards.length)}

              {/* Droppable Column */}
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] p-4 rounded-lg transition-all duration-200 ${
                      snapshot.isDraggingOver
                        ? "bg-blue-50 border-2 border-dashed border-blue-300"
                        : "bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    {/* Draggable Cards */}
                    {columnCards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              // Fix transparency and stuck card bugs
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              transform: snapshot.isDragging
                                ? `${provided.draggableProps.style?.transform} rotate(5deg)`
                                : provided.draggableProps.style?.transform,
                            }}
                            className={`mb-3 transition-all duration-200 ${
                              snapshot.isDragging ? "shadow-2xl z-50" : "hover:shadow-md"
                            }`}
                          >
                            {renderCard && renderCard(card, provided, snapshot)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}