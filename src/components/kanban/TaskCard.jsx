import {
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  UsersIcon,
  UserCircleIcon,
  TruckIcon,
} from "@heroicons/react/24/solid";


const TaskCard = ({ task, onEdit, onDeleteTask }) => {
  const funcionarios = Array.isArray(task.employees)
    ? task.employees.map((f) =>
      typeof f === "string" ? f : f.full_name || f.username || ""
    )
    : [];

  const equipeNome = task.team?.name || "";
  const obraNome = task.work?.name || "";
  const vehicleInfo = task.vehicle ? String(task.vehicle) : "";
  const prazo = task.estimated_deadline
    ? new Date(task.estimated_deadline).toLocaleDateString("pt-BR")
    : "Sem prazo";

  const statusColors = {
    em_andamento: "bg-yellow-200 text-yellow-900",
    concluida: "bg-green-200 text-green-900",
    cancelada: "bg-red-200 text-red-900",
    a_fazer: "bg-gray-200 text-gray-900",
  };

  const statusText = {
    em_andamento: "Em Andamento",
    concluida: "Concluída",
    cancelada: "Cancelada",
    a_fazer: "A Fazer",
  };

  const statusBadgeClass =
    statusColors[task.status] || "bg-gray-200 text-gray-900";
  const statusLabel = statusText[task.status] || task.status;

  return (
    <div className="relative bg-white border border-gray-300 rounded-md shadow-md p-3 pt-6
                transition-all duration-200 ease-in-out
                hover:border-blue-600 hover:shadow-lg hover:z-20 transform hover:scale-[1.02]">
      {/* ID + Equipe no topo */}
      <div className="absolute top-1 left-2 text-[11px] text-gray-700 font-semibold bg-blue-50 px-2 py-0.5 rounded shadow-sm border border-gray-200 flex items-center">
        <span className="font-bold">#{task.id}</span>
        {equipeNome && (
          <span className="ml-1 text-gray-800 font-bold flex items-center">
            <UsersIcon className="w-3 h-3 mr-1 text-gray-600" />
            {equipeNome}
          </span>
        )}
      </div>

      {/* Ações (botões de editar e excluir) */}
      <div className="absolute top-1 right-1 flex">
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
          title="Editar Obra"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
          title="Excluir Obra"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Descrição da Tarefa */}
      <h3 className="font-semibold text-gray-900 mt-5">{task.description}</h3>

      {/* Prazo */}
      <p className="text-sm text-gray-800 flex items-center mt-1">
        <CalendarDaysIcon className="w-4 h-4 mr-1 text-gray-600" />
        <span className="font-semibold">Prazo:</span> {prazo}
      </p>

      {/* Seção de Status e Obra */}
      <div className="flex flex-wrap items-center gap-2 mt-2 mb-1">
        <div
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-semibold ${statusBadgeClass}`}
        >
          {statusLabel}
        </div>

        {obraNome && (
          <div className="inline-flex items-center px-2 py-0.5 bg-blue-200 text-blue-900 text-[12px] rounded-full font-medium">
            <BuildingOffice2Icon className="w-3 h-3 mr-1" />
            Obra: {obraNome}
          </div>
        )}

        {/* --- ADIÇÃO DO VEÍCULO AQUI --- */}
        {vehicleInfo && (
          <div className="inline-flex items-center px-2 py-0.5 bg-indigo-200 text-indigo-900 text-[12px] rounded-full font-medium">
            <TruckIcon className="w-3 h-3 mr-1" />
            {vehicleInfo}
          </div>
        )}
        {/* --- FIM DA ADIÇÃO DO VEÍCULO --- */}
      </div>

      {/* Seção de Funcionários (com ícones de usuário) */}
      {funcionarios.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {funcionarios.map((nome, idx) => (
            <span
              key={idx}
              className="bg-gray-300 text-gray-900 text-[12px] px-2 py-0.5 rounded-full flex items-center font-medium"
            >
              <UserCircleIcon className="w-4 h-4 mr-1 text-gray-600" />
              {nome}
            </span>
          ))}
        </div>
      )}

      {/* Observações */}
      {task.observations && (
        <p className="text-xs text-gray-800 mt-2">
          <strong className="text-gray-900">Obs:</strong> {task.observations}
        </p>
      )}
    </div>
  );
};

export default TaskCard;
