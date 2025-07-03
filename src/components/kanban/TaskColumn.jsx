import { Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";


const TaskColumn = ({ title, tasks, onAdd, onEditTask, onDeleteTask, status }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[400px] flex flex-col justify-start relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <button
          className="text-white bg-blue-500 px-2 py-1 rounded text-sm"
          onClick={onAdd}
        >
          +
        </button>
      </div>

      <div className="relative" style={{ height: `${tasks.length * 50 + 60}px` }}>
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={String(task.id)} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="absolute w-full transition-all"
                style={{
                  top: `${index * 40}px`,
                  zIndex: index,
                  ...provided.draggableProps.style,
                }}
              >
                <TaskCard
                  task={task}
                  onEdit={() => onEditTask(task, status)}
                  onDeleteTask={onDeleteTask}
                />
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
