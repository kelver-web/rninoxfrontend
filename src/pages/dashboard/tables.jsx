import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  Progress,
} from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  UserIcon,
  CubeTransparentIcon,
  ClipboardDocumentListIcon, // Para Measurements/Reports
  BuildingOffice2Icon, // Para Works/Addresses
  UsersIcon, // Para Teams
  TagIcon, // Para Users
} from "@heroicons/react/24/outline";
import api from "@/services/api";
import { toast } from "react-toastify";

export function Tables() {
  const [tasks, setTasks] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [reports, setReports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [works, setWorks] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // --- Funções de Fetch para cada Endpoint ---

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

  // --- Cabeçalhos das Tabelas ---
  const taskTableHeaders = [
    "Tarefa", "Equipe", "Obra", "Veículo", "Funcionários", "Status", "Prazo Estimado", "Ações"
  ];
  const vehicleTableHeaders = ["Marca", "Modelo", "Placa", "Status", "Ações"]; // Ajustado para incluir Status
  const measurementTableHeaders = ["Medição", "Valor", "Unidade", "Tarefa", "Data", "Ações"];
  const reportTableHeaders = ["Relatório", "Tipo", "Obra", "Funcionário", "Data", "Ações"];
  const teamTableHeaders = ["Equipe", "Funcionários", "Descrição", "Ações"]; // Ajustado para "Funcionários"
  const userTableHeaders = ["Usuário", "Email", "Ativo?", "Ações"];
  const workTableHeaders = ["Obra", "Endereço", "Cliente", "Telefone", "Status", "Ações"];
  const addressTableHeaders = ["Endereço", "Cidade", "Estado", "CEP", "Ações"];

  // --- Funções Auxiliares para Cores de Chips ---
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
              {tasks.map((task, key) => {
                const className = `py-3 px-5 ${key === tasks.length - 1 ? "" : "border-b border-blue-gray-50"}`;
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
              {vehicles.map((vehicle, key) => {
                const className = `py-3 px-5 ${key === vehicles.length - 1 ? "" : "border-b border-blue-gray-50"}`;
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
              {measurements.map((measurement, key) => {
                const className = `py-3 px-5 ${key === measurements.length - 1 ? "" : "border-b border-blue-gray-50"}`;
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
              {reports.map((report, key) => {
                const className = `py-3 px-5 ${key === reports.length - 1 ? "" : "border-b border-blue-gray-50"}`;
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
              {teams.map((team, key) => {
                const className = `py-3 px-5 ${key === teams.length - 1 ? "" : "border-b border-blue-gray-50"}`;
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
                      {/* CORREÇÃO AQUI para exibir os membros */}
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
              {users.map((user, key) => {
                const className = `py-3 px-5 ${key === users.length - 1 ? "" : "border-b border-blue-gray-50"}`;
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
              {works.map((work, key) => {
                const className = `py-3 px-5 ${key === works.length - 1 ? "" : "border-b border-blue-gray-50"}`;
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
                      {/* Corrigido para address.street */}
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
              {addresses.map((address, key) => {
                const className = `py-3 px-5 ${key === addresses.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={address.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <BuildingOffice2Icon className="h-5 w-5 text-blue-gray-500" />
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {address.street || "N/A"}, {address.number || "S/N"}
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
      </Card>
    </div>
  );
}

export default Tables;
