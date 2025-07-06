import { useState, useEffect, useCallback } from "react"; // Adicionado useCallback
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Button, // Adicionado para os botões de paginação
} from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  UserIcon,
  CubeTransparentIcon,
  ClipboardDocumentListIcon,
  BuildingOffice2Icon,
  UsersIcon,
  TagIcon,
  ArrowLongLeftIcon, // Ícones para paginação
  ArrowLongRightIcon, // Ícones para paginação
} from "@heroicons/react/24/outline";
import api from "@/services/api";
import { toast } from "react-toastify";

// --- COMPONENTE AUXILIAR DE CONTROLES DE PAGINAÇÃO ---
function PaginationControls({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center gap-2 p-1 justify-center">
      <Button
        variant="text"
        className="flex items-center gap-1"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        color="gray"
        size="sm"
      >
        <ArrowLongLeftIcon strokeWidth={2} className="h-4 w-4" /> Anterior
      </Button>
      <div className="flex items-center gap-1">
        {pageNumbers.map((number) => (
          <IconButton
            key={number}
            variant={currentPage === number ? "filled" : "text"}
            color="gray"
            onClick={() => onPageChange(number)}
            className="w-6 h-6"
          >
            {number}
          </IconButton>
        ))}
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        color="gray"
        size="sm"
      >
        Próximo <ArrowLongRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function Tables() {
  // Estados para os dados
  const [tasks, setTasks] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [reports, setReports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [works, setWorks] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // --- Estados de Paginação para CADA TABELA ---
  const ITEMS_PER_PAGE = 5; // Você pode ajustar isso por tabela se quiser

  const [currentPageTasks, setCurrentPageTasks] = useState(1);
  const [currentPageVehicles, setCurrentPageVehicles] = useState(1);
  const [currentPageMeasurements, setCurrentPageMeasurements] = useState(1);
  const [currentPageReports, setCurrentPageReports] = useState(1);
  const [currentPageTeams, setCurrentPageTeams] = useState(1);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageWorks, setCurrentPageWorks] = useState(1);
  const [currentPageAddresses, setCurrentPageAddresses] = useState(1);

  // --- Funções de Fetch para cada Endpoint (inalteradas) ---
  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks/");
      setTasks(response.data);
      console.log("Tarefas carregadas:", response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      toast.error("Erro ao carregar tarefas.");
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/logistics/");
      setVehicles(response.data);
      console.log("Veículos carregados:", response.data);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      toast.error("Erro ao carregar veículos.");
    }
  };

  const fetchMeasurements = async () => {
    try {
      const response = await api.get("/measurements/");
      setMeasurements(response.data);
      console.log("Medições carregadas:", response.data);
    } catch (error) {
      console.error("Erro ao carregar medições:", error);
      toast.error("Erro ao carregar medições.");
    }
  };

  const fetchReports = async () => {
    try {
      const response = await api.get("/reports/");
      setReports(response.data);
      console.log("Relatórios carregados:", response.data);
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
      toast.error("Erro ao carregar relatórios.");
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get("/teams/");
      setTeams(response.data);
      console.log("Equipes carregadas:", response.data);
    } catch (error) {
      console.error("Erro ao carregar equipes:", error);
      toast.error("Erro ao carregar equipes.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
      console.log("Usuários carregados:", response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar usuários.");
    }
  };

  const fetchWorks = async () => {
    try {
      const response = await api.get("/works/");
      setWorks(response.data);
      console.log("Obras carregadas:", response.data);
    } catch (error) {
      console.error("Erro ao carregar obras:", error);
      toast.error("Erro ao carregar obras.");
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/addresses/");
      setAddresses(response.data);
      console.log("Endereços carregados:", response.data);
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      toast.error("Erro ao carregar endereços.");
    }
  };

  // --- Chamar todas as funções de fetch no useEffect ---
  useEffect(() => {
    fetchTasks();
    fetchVehicles();
    fetchMeasurements();
    fetchReports();
    fetchTeams();
    fetchUsers();
    fetchWorks();
    fetchAddresses();
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  // --- Lógica de Paginação para CADA TABELA ---

  // Tarefas
  const indexOfLastTask = currentPageTasks * ITEMS_PER_PAGE;
  const indexOfFirstTask = indexOfLastTask - ITEMS_PER_PAGE;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPagesTasks = Math.ceil(tasks.length / ITEMS_PER_PAGE);

  // Veículos
  const indexOfLastVehicle = currentPageVehicles * ITEMS_PER_PAGE;
  const indexOfFirstVehicle = indexOfLastVehicle - ITEMS_PER_PAGE;
  const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPagesVehicles = Math.ceil(vehicles.length / ITEMS_PER_PAGE);

  // Medições
  const indexOfLastMeasurement = currentPageMeasurements * ITEMS_PER_PAGE;
  const indexOfFirstMeasurement = indexOfLastMeasurement - ITEMS_PER_PAGE;
  const currentMeasurements = measurements.slice(indexOfFirstMeasurement, indexOfLastMeasurement);
  const totalPagesMeasurements = Math.ceil(measurements.length / ITEMS_PER_PAGE);

  // Relatórios
  const indexOfLastReport = currentPageReports * ITEMS_PER_PAGE;
  const indexOfFirstReport = indexOfLastReport - ITEMS_PER_PAGE;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPagesReports = Math.ceil(reports.length / ITEMS_PER_PAGE);

  // Equipes
  const indexOfLastTeam = currentPageTeams * ITEMS_PER_PAGE;
  const indexOfFirstTeam = indexOfLastTeam - ITEMS_PER_PAGE;
  const currentTeams = teams.slice(indexOfFirstTeam, indexOfLastTeam);
  const totalPagesTeams = Math.ceil(teams.length / ITEMS_PER_PAGE);

  // Usuários
  const indexOfLastUser = currentPageUsers * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPagesUsers = Math.ceil(users.length / ITEMS_PER_PAGE);

  // Obras
  const indexOfLastWork = currentPageWorks * ITEMS_PER_PAGE;
  const indexOfFirstWork = indexOfLastWork - ITEMS_PER_PAGE;
  const currentWorks = works.slice(indexOfFirstWork, indexOfLastWork);
  const totalPagesWorks = Math.ceil(works.length / ITEMS_PER_PAGE);

  // Endereços
  const indexOfLastAddress = currentPageAddresses * ITEMS_PER_PAGE;
  const indexOfFirstAddress = indexOfLastAddress - ITEMS_PER_PAGE;
  const currentAddresses = addresses.slice(indexOfFirstAddress, indexOfLastAddress);
  const totalPagesAddresses = Math.ceil(addresses.length / ITEMS_PER_PAGE);


  // --- Cabeçalhos das Tabelas (inalterados) ---
  const taskTableHeaders = [
    "Tarefa", "Equipe", "Obra", "Veículo", "Funcionários", "Status", "Prazo Estimado", "Ações"
  ];
  const vehicleTableHeaders = ["Marca", "Modelo", "Placa", "Status", "Ações"];
  const measurementTableHeaders = ["Medição", "Valor", "Unidade", "Tarefa", "Data", "Ações"];
  const reportTableHeaders = ["Relatório", "Tipo", "Obra", "Funcionário", "Data", "Ações"];
  const teamTableHeaders = ["Equipe", "Funcionários", "Descrição", "Ações"];
  const userTableHeaders = ["Usuário", "Email", "Ativo?", "Ações"];
  const workTableHeaders = ["Obra", "Endereço", "Cliente", "Telefone", "Status", "Ações"];
  const addressTableHeaders = ["Endereço", "Cidade", "Estado", "CEP", "Ações"];

  // --- Funções Auxiliares para Cores de Chips (inalteradas) ---
  const getTaskStatusColor = (status) => {
    switch (status) {
      case "concluida": return "green";
      case "em_andamento": return "blue";
      case "a_fazer": return "amber";
      default: return "gray";
    }
  };

  const getVehicleStatusColor = (status) => {
    switch (status) {
      case "disponivel": return "green";
      case "em_uso": return "orange";
      case "manutencao": return "red";
      default: return "gray";
    }
  };

  const getWorkStatusColor = (status) => {
    switch (status) {
      case "concluida": return "green";
      case "em_andamento": return "blue";
      case "a_fazer": return "amber";
      case "pausada": return "red";
      default: return "gray";
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* --- Tabela de Tarefas --- */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Tabela de Tarefas
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {taskTableHeaders.map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Usa os dados da página atual */}
              {currentTasks.map((task, key) => {
                const className = `py-3 px-5 ${key === currentTasks.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={task.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {task.description || "Sem descrição"}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            ID: {task.id}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {task.team ? task.team.name : "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        {task.work && <CubeTransparentIcon className="h-4 w-4 text-blue-gray-500" />}
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {task.work ? task.work.name : "N/A"}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {task.vehicle ? task.vehicle : "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-1">
                        {task.employees && task.employees.length > 0 ? (
                          task.employees.map((employeeName, idx) => (
                            <Tooltip key={idx} content={employeeName}>
                              <UserIcon className="h-5 w-5 text-blue-gray-500 cursor-pointer" />
                            </Tooltip>
                          ))
                        ) : (
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            Nenhum
                          </Typography>
                        )}
                      </div>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={getTaskStatusColor(task.status)}
                        value={task.status ? task.status.replace(/_/g, " ") : "Desconhecido"}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {task.estimated_deadline || "Não definido"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Editar Tarefa">
                          <IconButton variant="text" color="blue-gray" size="sm">
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Excluir Tarefa">
                          <IconButton variant="text" color="red" size="sm">
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        {/* Controles de Paginação para Tarefas */}
        <PaginationControls
          currentPage={currentPageTasks}
          totalPages={totalPagesTasks}
          onPageChange={setCurrentPageTasks}
        />
      </Card>

      {/* --- Tabela de Veículos --- */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Tabela de Veículos
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {vehicleTableHeaders.map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentVehicles.map((vehicle, key) => {
                const className = `py-3 px-5 ${key === currentVehicles.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                const vehicleStatus = vehicle.status || "desconhecido";
                return (
                  <tr key={vehicle.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {vehicle.brand || "N/A"}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {vehicle.model || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {vehicle.license_plate || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={getVehicleStatusColor(vehicleStatus)}
                        value={vehicleStatus}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Editar Veículo">
                          <IconButton variant="text" color="blue-gray" size="sm">
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Excluir Veículo">
                          <IconButton variant="text" color="red" size="sm">
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        {/* Controles de Paginação para Veículos */}
        <PaginationControls
          currentPage={currentPageVehicles}
          totalPages={totalPagesVehicles}
          onPageChange={setCurrentPageVehicles}
        />
      </Card>

      {/* --- Tabela de Medições --- */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Tabela de Medições
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {measurementTableHeaders.map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentMeasurements.map((measurement, key) => {
                const className = `py-3 px-5 ${key === currentMeasurements.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={measurement.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-blue-gray-500" />
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {measurement.description || `Medição ${measurement.id}`}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            Tarefa: {measurement.task ? measurement.task.description : "N/A"}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {measurement.value || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {measurement.unit || "N/A"}
                      </Typography>
                    </td>
                     <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {measurement.task ? measurement.task.description : "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {measurement.date ? new Date(measurement.date).toLocaleDateString() : "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Editar Medição">
                          <IconButton variant="text" color="blue-gray" size="sm">
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Excluir Medição">
                          <IconButton variant="text" color="red" size="sm">
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        {/* Controles de Paginação para Medições */}
        <PaginationControls
          currentPage={currentPageMeasurements}
          totalPages={totalPagesMeasurements}
          onPageChange={setCurrentPageMeasurements}
        />
      </Card>

      {/* --- Tabela de Relatórios --- */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Tabela de Relatórios
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {reportTableHeaders.map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report, key) => {
                const className = `py-3 px-5 ${key === currentReports.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={report.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                         <ClipboardDocumentListIcon className="h-5 w-5 text-blue-gray-500" />
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {report.description || `Relatório ${report.id}`}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {report.id}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {report.type || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {report.work ? report.work.name : "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {report.employee ? report.employee.full_name : "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {report.date ? new Date(report.date).toLocaleDateString() : "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Editar Relatório">
                          <IconButton variant="text" color="blue-gray" size="sm">
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Excluir Relatório">
                          <IconButton variant="text" color="red" size="sm">
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        {/* Controles de Paginação para Relatórios */}
        <PaginationControls
          currentPage={currentPageReports}
          totalPages={totalPagesReports}
          onPageChange={setCurrentPageReports}
        />
      </Card>

      {/* --- Tabela de Equipes --- */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Tabela de Equipes
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {teamTableHeaders.map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTeams.map((team, key) => {
                const className = `py-3 px-5 ${key === currentTeams.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={team.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <UsersIcon className="h-5 w-5 text-blue-gray-500" />
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {team.name || "N/A"}
                        </Typography>
                      </div>
                    </td>

                    <td className={className}>
                      <div className="flex flex-col gap-0.5">
                        {team.members && team.members.length > 0 ? (
                          team.members.map((member, idx) => (
                            <Typography key={idx} className="text-xs font-normal text-blue-gray-500">
                              {member.name} {member.role ? `(${member.role})` : ''}
                            </Typography>
                          ))
                        ) : (
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            Nenhum membro
                          </Typography>
                        )}
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {team.description || "Sem descrição"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Editar Equipe">
                          <IconButton variant="text" color="blue-gray" size="sm">
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Excluir Equipe">
                          <IconButton variant="text" color="red" size="sm">
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        {/* Controles de Paginação para Equipes */}
        <PaginationControls
          currentPage={currentPageTeams}
          totalPages={totalPagesTeams}
          onPageChange={setCurrentPageTeams}
        />
      </Card>

      {/* --- Tabela de Usuários --- */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Tabela de Usuários
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {userTableHeaders.map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, key) => {
                const className = `py-3 px-5 ${key === currentUsers.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={user.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <TagIcon className="h-5 w-5 text-blue-gray-500" />
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {user.username || "N/A"}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user.email || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={user.is_active ? "green" : "red"}
                        value={user.is_active ? "Ativo" : "Inativo"}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Editar Usuário">
                          <IconButton variant="text" color="blue-gray" size="sm">
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Excluir Usuário">
                          <IconButton variant="text" color="red" size="sm">
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        {/* Controles de Paginação para Usuários */}
        <PaginationControls
          currentPage={currentPageUsers}
          totalPages={totalPagesUsers}
          onPageChange={setCurrentPageUsers}
        />
      </Card>

      {/* --- Tabela de Obras --- */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Tabela de Obras
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {workTableHeaders.map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentWorks.map((work, key) => {
                const className = `py-3 px-5 ${key === currentWorks.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                const workStatus = work.status || "desconhecido";
                return (
                  <tr key={work.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <BuildingOffice2Icon className="h-5 w-5 text-blue-gray-500" />
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {work.name || "N/A"}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {work.address ? `${work.address.street || "N/A"}, ${work.address.city || "N/A"}` : "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {work.client || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {work.phone || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={getWorkStatusColor(workStatus)}
                        value={workStatus.replace(/_/g, " ")}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Editar Obra">
                          <IconButton variant="text" color="blue-gray" size="sm">
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Excluir Obra">
                          <IconButton variant="text" color="red" size="sm">
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        {/* Controles de Paginação para Obras */}
        <PaginationControls
          currentPage={currentPageWorks}
          totalPages={totalPagesWorks}
          onPageChange={setCurrentPageWorks}
        />
      </Card>

      {/* --- Tabela de Endereços --- */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Tabela de Endereços
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {addressTableHeaders.map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentAddresses.map((address, key) => {
                const className = `py-3 px-5 ${key === currentAddresses.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={address.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <BuildingOffice2Icon className="h-5 w-5 text-blue-gray-500" />
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {address.street || "N/A"}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {address.city || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {address.state || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {address.zip_code || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Editar Endereço">
                          <IconButton variant="text" color="blue-gray" size="sm">
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Excluir Endereço">
                          <IconButton variant="text" color="red" size="sm">
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        {/* Controles de Paginação para Endereços */}
        <PaginationControls
          currentPage={currentPageAddresses}
          totalPages={totalPagesAddresses}
          onPageChange={setCurrentPageAddresses}
        />
      </Card>
    </div>
  );
}
