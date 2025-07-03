// src/components/kanban/Kanban.jsx

import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TaskColumn from "@/components/kanban/TaskColumn";
import CreateTaskModal from "@/components/kanban/CreateTaskModal";
import DeleteConfirmationModal from "@/components/kanban/DeleteConfirmationModal";
import api from "@/services/api";
import { toast } from "react-toastify";


const Kanban = () => {
  const [columns, setColumns] = useState({
    a_fazer: [],
    em_andamento: [],
    concluida: [],
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [modalStatus, setModalStatus] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Abrir modal para criar/editar nova tarefa
  const openCreateEditModal = (status, task = null) => {
    setModalStatus(status);
    if (task) {
      setEditMode(true);
      setTaskToEdit(task);
    } else {
      setEditMode(false);
      setTaskToEdit(null);
    }
    setCreateModalOpen(true);
  };

  // Fechar modal de criação/edição
  const closeCreateEditModal = () => {
    setCreateModalOpen(false);
    setModalStatus(null);
    setTaskToEdit(null);
    setEditMode(false);
  };

  // Fechar modal de deleção
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  // Salvar tarefa (criar ou editar)
  const handleSaveTask = async ({
    description,
    estimated_deadline,
    status,
    team,
    work,
    employee,
    observations,
    vehicle_id,
  }) => {
    try {
      // Pegando o token do localStorage (assumindo que é onde você salva)
      const token = localStorage.getItem("token");

      // Decodificando o token para saber se é superuser
      const isAdmin = (() => {
        try {
          if (!token) return false;
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload?.is_superuser || false;
        } catch (err) {
          console.warn("Erro ao decodificar token:", err);
          return false;
        }
      })();

      // Define o que será enviado conforme o tipo de usuário
      let dataToSend;
      if (editMode && !isAdmin) {
        // Usuário comum só pode atualizar status e observations
        dataToSend = {
          status,
          observations,
        };
      } else {
        // Admin pode enviar todos os campos
        dataToSend = {
          description,
          estimated_deadline,
          status,
          team_id: team,
          work_id: work,
          employee_ids: employee,
          observations,
          vehicle_id,
        };
      }

      console.log("DEBUG KANBAN - Payload final enviado para a API:", dataToSend);

      if (editMode && taskToEdit) {
        await api.patch(`/tasks/${taskToEdit.id}/`, dataToSend);
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        await api.post("/tasks/", dataToSend);
        toast.success("Tarefa criada com sucesso!");
      }

      await fetchTask();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error.response?.data || error.message);
      let errorMessage = "Erro ao salvar tarefa. Verifique os campos.";
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'object') {
          errorMessage = Object.entries(error.response.data)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(', ')}`;
              }
              return `${field}: ${messages}`;
            })
            .join('\n');
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      toast.error(`Erro ao salvar tarefa!\n${errorMessage}`);
    }

    closeCreateEditModal();
  };



  const handleOpenDeleteModal = (taskId) => {
    let foundTask = null;
    for (const columnKey in columns) {
      const tasksInColumn = columns[columnKey];
      foundTask = tasksInColumn.find(t => t.id === taskId);
      if (foundTask) {
        break;
      }
    }

    if (foundTask) {
      setTaskToDelete(foundTask);
      setDeleteModalOpen(true);
    } else {
      console.error(`Tarefa com ID ${taskId} não encontrada nas colunas.`);
      toast.error("Erro: Tarefa não encontrada para exclusão.");
    }
  };

  // Função de callback após a deleção bem-sucedida (chamada pelo DeleteConfirmationModal)
  const handleDeleteSuccess = (deletedId, originalStatus) => {
    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };
      // Remove a tarefa da coluna onde ela estava originalmente
      if (newColumns[originalStatus]) {
        newColumns[originalStatus] = newColumns[originalStatus].filter(
          (t) => t.id !== deletedId
        );
      }
      return newColumns;
    });
    closeDeleteModal();
  };

  // Drag and drop
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // Se não houver destino ou a tarefa foi solta no mesmo lugar, não faz nada
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    // Identifica as colunas de origem e destino
    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;

    // Cria cópias dos arrays de tarefas para manipulação segura do estado
    const newSourceTasks = Array.from(columns[sourceColumnId]);
    const newDestTasks = Array.from(columns[destinationColumnId]);

    // Remove a tarefa da coluna de origem
    const [movedTask] = newSourceTasks.splice(source.index, 1);

    // Lógica para mover na mesma coluna (sem chamada à API)
    if (sourceColumnId === destinationColumnId) {
      newSourceTasks.splice(destination.index, 0, movedTask); // Insere na nova posição
      setColumns({
        ...columns,
        [sourceColumnId]: newSourceTasks,
      });
    } else {
      // --- INÍCIO DA ATUALIZAÇÃO OTIMISTA E LÓGICA DE ROLLBACK ---

      const originalStatus = movedTask.status; // Guarda o status original para um possível rollback

      // 1. Atualiza o status da tarefa no frontend imediatamente
      movedTask.status = destinationColumnId;
      newDestTasks.splice(destination.index, 0, movedTask); // Insere na nova coluna

      // 2. Atualiza o estado das colunas no frontend (UI) IMEDIATAMENTE
      setColumns({
        ...columns,
        [sourceColumnId]: newSourceTasks,
        [destinationColumnId]: newDestTasks,
      });

      // 3. Envia a requisição PATCH para o backend
      api.patch(`/tasks/${movedTask.id}/`, { status: destinationColumnId })
        .then(response => {
          console.log("Status da tarefa atualizado no backend:", response.data);
          toast.success("Status da tarefa atualizado!");
          // Não é necessário `setColumns` aqui novamente, pois a atualização otimista já foi feita.
        })
        .catch(error => {
          console.error("Erro ao atualizar status da tarefa no backend:", error);
          toast.error("Erro ao mover tarefa. Revertendo...");

          // 4. ROLLBACK em caso de erro: reverte o estado do frontend
          setColumns(prevColumns => {
            const revertedColumns = { ...prevColumns };

            // Remove a tarefa da coluna de destino otimista
            const taskToRevertIndex = revertedColumns[destinationColumnId].findIndex(
              (task) => task.id === movedTask.id
            );
            if (taskToRevertIndex > -1) {
              const [revertedTask] = revertedColumns[destinationColumnId].splice(taskToRevertIndex, 1);
              revertedTask.status = originalStatus; // Restaura o status original

              // Coloca a tarefa de volta na coluna de origem
              revertedColumns[sourceColumnId].splice(source.index, 0, revertedTask);
            }
            return revertedColumns;
          });

        });
    }
  };

  // Buscar tarefas do backend
  const fetchTask = async () => {
    try {
      const response = await api.get("/tasks");
      const tasks = response.data;
      const grouped = {
        a_fazer: [],
        em_andamento: [],
        concluida: [],
        cancelada: [],
      };
      tasks.forEach((task) => {
        if (grouped[task.status]) {
          grouped[task.status].push(task);
        }
      });
      setColumns(grouped);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      toast.error("Erro ao carregar tarefas. Por favor, tente novamente.");
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  return (
    <>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.entries(columns).map(([columnName, tasks]) => (
            <Droppable key={columnName} droppableId={columnName}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <TaskColumn
                    title={columnName.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                    tasks={tasks}
                    status={columnName}
                    onAdd={() => openCreateEditModal(columnName)}
                    onEditTask={(task) => openCreateEditModal(columnName, task)}
                    onDeleteTask={handleOpenDeleteModal} // Passa o ID da tarefa
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>

      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={closeCreateEditModal}
        onSave={handleSaveTask}
        status={modalStatus}
        task={taskToEdit}
        isEditing={editMode}
      />

      {taskToDelete && ( // taskToDelete agora é o OBJETO da tarefa
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          itemId={taskToDelete.id} // taskToDelete.id agora será o ID correto
          itemDescription={`Tarefa "${taskToDelete.description}"`}
          deleteEndpoint="/tasks/"
          onDeleteSuccess={(deletedId) => handleDeleteSuccess(deletedId, taskToDelete.status)}
        />
      )}
    </>
  );
};

export default Kanban;
