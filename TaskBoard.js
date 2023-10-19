// TaskBoard.js
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskBoard = ({ tasks, newTask, setNewTask, addTask }) => {
  const onDragEnd = (result) => {
    // Handle task reordering logic here
  };

  return (
    <div>
      <h2>Task Board</h2>
      <div>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Create columns for each task status (e.g., To Do, In Progress, Done) */}
        {['To Do', 'In Progress', 'Done'].map((status, index) => (
          <div key={index}>
            <h3>{status}</h3>
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                    padding: 4,
                    width: 250,
                    minHeight: 500,
                  }}
                >
                  {/* Create draggable tasks within each column */}
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: 'none',
                              padding: 16,
                              margin: '0 0 8px 0',
                              minHeight: '50px',
                              backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                              color: 'white',
                              ...provided.draggableProps.style,
                            }}
                          >
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;