import { useEffect, useState } from "react";
import api from "@/services/api";

const CreateTaskModal = ({ isOpen, onClose, onSave, status, task, isEditing }) => {
  const [description, setDescription] = useState("");
  const [estimated_deadline, setEstimatedDeadline] = useState("");
  const [team, setTeam] = useState("");
  const [work, setWork] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [employee, setEmployee] = useState([]);
  const [observations, setObservations] = useState("");
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [teamsOptions, setTeamsOptions] = useState([]);
  const [worksOptions, setWorksOptions] = useState([]);
  const [employeesOptions, setEmployeesOptions] = useState([]);
  const [vehiclesOptions, setVehiclesOptions] = useState([]);

  const normalizeString = (str) => String(str || '').trim().toLowerCase();

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        api.get("/teams/"),
        api.get("/works/"),
        api.get("/users/"),
        api.get("/logistics/"),
        api.get("/users/profile/")
      ])
        .then(([teamsRes, worksRes, usersRes, vehiclesRes, meRes]) => {
          setTeamsOptions(teamsRes.data);
          setWorksOptions(worksRes.data);
          setEmployeesOptions(usersRes.data);
          setVehiclesOptions(vehiclesRes.data);
          setIsSuperUser(meRes.data?.is_superuser || false);
        })
        .catch(error => {
          console.error("Erro ao carregar opções:", error);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    const resetForm = () => {
      setDescription("");
      setEstimatedDeadline("");
      setTeam("");
      setWork("");
      setVehicle("");
      setEmployee([]);
      setObservations("");
    };

    if (isOpen && !isEditing) {
      resetForm();
    } else if (!isOpen) {
      resetForm();
    }
  }, [isOpen, isEditing]);

  useEffect(() => {
    if (!isOpen || !isEditing || !task) return;

    setDescription(task.description || "");
    setEstimatedDeadline(task.estimated_deadline?.slice(0, 10) || "");
    setObservations(task.observations || "");
    setTeam(String(task.team?.id || ""));
    setWork(String(task.work?.id || ""));

    if (Array.isArray(task.employee)) {
      setEmployee(task.employee.map(String));
    } else if (Array.isArray(task.employees)) {
      if (typeof task.employees[0] === "object") {
        setEmployee(task.employees.map(e => String(e.id)));
      } else {
        const matched = employeesOptions
          .filter(emp => task.employees.includes(emp.username))
          .map(emp => String(emp.id));
        setEmployee(matched);
      }
    } else if (task.employee) {
      setEmployee([String(task.employee?.id || task.employee)]);
    } else {
      setEmployee([]);
    }
  }, [isOpen, isEditing, task, employeesOptions]);

  useEffect(() => {
    if (!isOpen || !isEditing || !task || vehiclesOptions.length === 0) return;

    if (task.vehicle && typeof task.vehicle === 'string') {
      const normalized = normalizeString(task.vehicle);
      const found = vehiclesOptions.find(v => normalizeString(v.model) === normalized);
      setVehicle(found ? String(found.id) : "");
    } else {
      setVehicle("");
    }
  }, [isOpen, isEditing, task, vehiclesOptions]);

  useEffect(() => {
    if (isOpen && !isEditing && team && teamsOptions.length > 0) {
      const selectedTeam = teamsOptions.find(t => String(t.id) === String(team));
      setEmployee(selectedTeam?.employees?.map(e => String(e.id)) || []);
    }
  }, [team, teamsOptions, isOpen, isEditing]);

  const handleEmployeesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
    setEmployee(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSuperUser) {
      if (!description.trim()) return alert("Por favor, preencha a descrição da tarefa.");
      if (!team) return alert("Por favor, selecione uma equipe.");
      if (!work) return alert("Por favor, selecione uma obra.");
    }

    const payload = {
      observations,
      status,
    };

    if (isSuperUser) {
      payload.description = description;
      payload.estimated_deadline = estimated_deadline;
      payload.team = Number(team);
      payload.work = Number(work);
      payload.vehicle_id = vehicle ? Number(vehicle) : null;
      payload.employee = employee.map(Number);
    }

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Editar Tarefa" : "Nova Tarefa"} – {status?.toUpperCase()}
        </h2>

        {isSuperUser && (
          <>
            <label className="block mb-2 text-sm font-medium">Descrição</label>
            <input
              type="text"
              className="w-full mb-3 border rounded px-2 py-1"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descrição da tarefa"
              required
            />

            <label className="block mb-2 text-sm font-medium">Prazo estimado</label>
            <input
              type="date"
              className="w-full mb-3 border rounded px-2 py-1"
              value={estimated_deadline}
              onChange={e => setEstimatedDeadline(e.target.value)}
              required
            />

            <label className="block mb-2 text-sm font-medium">Equipe</label>
            <select
              className="w-full mb-3 border rounded px-2 py-1"
              value={team}
              onChange={e => setTeam(e.target.value)}
              required
            >
              <option value="">Selecione a equipe</option>
              {teamsOptions.map(t => (
                <option key={t.id} value={String(t.id)}>{t.name}</option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium">Obra</label>
            <select
              className="w-full mb-3 border rounded px-2 py-1"
              value={work}
              onChange={e => setWork(e.target.value)}
              required
            >
              <option value="">Selecione a obra</option>
              {worksOptions.map(w => (
                <option key={w.id} value={String(w.id)}>{w.name}</option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium">Funcionários</label>
            <select
              multiple
              className="w-full mb-3 border rounded px-2 py-1"
              value={employee}
              onChange={handleEmployeesChange}
            >
              {employeesOptions.map(emp => (
                <option key={emp.id} value={String(emp.id)}>{emp.username}</option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium">Veículo</label>
            <select
              className="w-full mb-3 border rounded px-2 py-1"
              value={vehicle}
              onChange={e => setVehicle(e.target.value)}
            >
              <option value="">Nenhum veículo</option>
              {vehiclesOptions.map(vei => (
                <option key={vei.id} value={String(vei.id)}>{vei.model}</option>
              ))}
            </select>
          </>
        )}

        <label className="block mb-2 text-sm font-medium">Observações</label>
        <textarea
          className="w-full mb-3 border rounded px-2 py-1"
          value={observations}
          onChange={e => setObservations(e.target.value)}
          placeholder="Observações adicionais"
        />

        <div className="flex justify-end gap-2">
          <button type="button" className="px-4 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            {isEditing ? "Salvar" : "Criar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskModal;
