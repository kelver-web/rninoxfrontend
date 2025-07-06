import { useEffect, useState } from "react";
import api from "@/services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from 'react-toastify';
import { ArrowDownTrayIcon, MinusCircleIcon, ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';
import DeleteConfirmationModal from "@/components/kanban/DeleteConfirmationModal";

import { Button, IconButton } from '@material-tailwind/react';


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


function PaginationControls({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 p-2">
            <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                color="gray"
                size="sm"
            >
                <ArrowLongLeftIcon strokeWidth={2} className="h-4 w-4" /> Anterior
            </Button>
            <div className="flex items-center gap-2">
                {pageNumbers.map((number) => (
                    <IconButton
                        key={number}
                        variant={currentPage === number ? "filled" : "text"}
                        color="gray"
                        onClick={() => onPageChange(number)}
                        className="w-7 h-7"
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
                Próxima <ArrowLongRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
        </div>
    );
}

const MeasurementForm = () => {
    // Estados principais
    const [works, setWorks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [measurements, setMeasurements] = useState([]);

    const [selectedWork, setSelectedWork] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [date_measurement, setDateMeasurement] = useState("");
    const [observations, setObservations] = useState("");
    const [items, setItems] = useState([
        { identifier: "", type: "", height_cm: "", width_cm: "", localization: "", observations: "" },
    ]);

    const [itemTypeOptions, setItemTypeOptions] = useState([]);
    const [itemLocalizationOptions, setItemLocalizationOptions] = useState([]);

    const [selectedWorkFilter, setSelectedWorkFilter] = useState("");
    const [selectedDateFilter, setSelectedDateFilter] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [measurementToDelete, setMeasurementToDelete] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    // PAGINAÇÃO
    const [currentPage, setCurrentPage] = useState(1);
    const measurementsPerPage = 5;

    // Sempre que filtros mudarem, volta para a página 1
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedWorkFilter, selectedDateFilter]);

    // Função para carregar medições
    const loadMeasurements = async () => {
        try {
            const res = await api.get("/measurements/");
            if (Array.isArray(res.data)) {
                setMeasurements(res.data);
            } else {
                console.error("Resposta de /measurements/ não é um array. Dados recebidos:", res.data);
                setMeasurements([]);
                toast.warn("Os dados das medições não vieram no formato esperado.");
            }
        } catch (error) {
            console.error("Erro ao carregar medições:", error);
            toast.error("Erro ao carregar medições.");
            setMeasurements([]);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [worksRes, usersRes, itemChoicesRes] = await Promise.all([
                    api.get("/works/"),
                    api.get("/users/"),
                    api.get("/item-choices/")
                ]);
                setWorks(Array.isArray(worksRes.data) ? worksRes.data : []);
                setEmployees(Array.isArray(usersRes.data) ? usersRes.data : []);
                setItemTypeOptions(Array.isArray(itemChoicesRes.data.types) ? itemChoicesRes.data.types : []);
                setItemLocalizationOptions(Array.isArray(itemChoicesRes.data.localizations) ? itemChoicesRes.data.localizations : []);
                await loadMeasurements();
            } catch (error) {
                console.error("Erro ao carregar dados iniciais:", error);
                toast.error("Erro ao carregar dados iniciais. Verifique o servidor.");
                setWorks([]);
                setEmployees([]);
                setItemTypeOptions([]);
                setItemLocalizationOptions([]);
                setMeasurements([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (employees.length > 0 && selectedEmployee) {
            if (!employees.some(emp => String(emp.id) === selectedEmployee)) {
                setSelectedEmployee("");
                console.log("selectedEmployee resetado para '' pois o ID anterior não é válido.");
            }
        }
    }, [employees, selectedEmployee]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        if (field === "height_cm" || field === "width_cm") {
            newItems[index][field] = value === "" ? "" : Number(parseFloat(value));
        } else {
            newItems[index][field] = value;
        }
        setItems(newItems);
    };

    const addItem = () => {
        setItems([
            ...items,
            { identifier: "", type: "", height_cm: "", width_cm: "", localization: "", observations: "" },
        ]);
    };

    const removeItem = (index) => {
        if (items.length === 1) {
            toast.warn("Deve haver pelo menos um item de medição.");
            return;
        }
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedWork) {
            toast.error("Por favor, selecione uma Obra.");
            return;
        }
        if (!selectedEmployee) {
            toast.error("Por favor, selecione um Funcionário.");
            return;
        }
        if (!date_measurement) {
            toast.error("Por favor, selecione uma Data.");
            return;
        }
        if (items.length === 0 || items.some(item =>
            !item.identifier ||
            !item.type ||
            item.height_cm === "" || item.height_cm === null || item.height_cm === undefined ||
            !item.width_cm || item.width_cm === "" || item.width_cm === null || item.width_cm === undefined ||
            !item.localization
        )) {
            toast.error("Por favor, preencha todos os campos obrigatórios para os Itens de Medição (Identificador, Tipo, Altura, Largura, Localização).");
            return;
        }

        const payload = {
            employee: Number(selectedEmployee),
            work: Number(selectedWork),
            date_measurement,
            observations,
            items: items.map(item => ({
                ...item,
                height_cm: item.height_cm === "" ? null : parseFloat(item.height_cm),
                width_cm: item.width_cm === "" ? null : parseFloat(item.width_cm)
            })),
        };

        try {
            const response = await api.post("/measurements/", payload);
            toast.success("Medição salva com sucesso!");
            setSelectedWork("");
            setSelectedEmployee("");
            setDateMeasurement("");
            setObservations("");
            setItems([{ identifier: "", type: "", height_cm: "", width_cm: "", localization: "", observations: "" }]);
            loadMeasurements();
        } catch (error) {
            console.error("Erro ao salvar medição:", error.response?.data || error.message);

            let errorMessage = "Erro ao salvar medição. Verifique os dados e tente novamente.";
            if (error.response && error.response.status === 400) {
                const errorData = error.response.data;
                errorMessage = "Erro de validação: ";
                if (typeof errorData === 'object' && errorData !== null) {
                    for (const key in errorData) {
                        if (Object.prototype.hasOwnProperty.call(errorData, key)) {
                            if (Array.isArray(errorData[key])) {
                                errorMessage += `${key}: ${errorData[key].join(", ")}. `;
                            } else if (typeof errorData[key] === 'string') {
                                errorMessage += `${key}: ${errorData[key]}. `;
                            } else if (typeof errorData[key] === 'object' && errorData[key] !== null) {
                                if (key === 'items' && Array.isArray(errorData[key])) {
                                    errorData[key].forEach((itemError, itemIndex) => {
                                        if (typeof itemError === 'object' && itemError !== null) {
                                            for (const itemErrKey in itemError) {
                                                errorMessage += `Item ${itemIndex + 1} - ${itemErrKey}: ${itemError[itemErrKey]}. `;
                                            }
                                        }
                                    });
                                } else {
                                    errorMessage += `${key}: ${JSON.stringify(errorData[key])}. `;
                                }
                            } else {
                                errorMessage += `${key}: ${errorData[key]}. `;
                            }
                        }
                        if (errorMessage.length > 500) {
                            errorMessage += "... (e outros erros)";
                            break;
                        }
                    }
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }
            }
            toast.error(errorMessage);
        }
    };

    const getWorkName = (workId) => {
        const work = works.find(w => w.id === workId);
        return work ? work.name : `Obra ID ${workId}`;
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees.find(emp => emp.id === employeeId);
        return employee ? (employee.full_name || employee.username || `ID: ${employee.id}`) : `Funcionário ID ${employeeId}`;
    };

    // FILTRO E PAGINAÇÃO
    const filteredMeasurements = measurements.filter((m) => {
        const workNameForFilter = getWorkName(m.work);
        const matchWork = selectedWorkFilter ? workNameForFilter === selectedWorkFilter : true;
        const matchDate = selectedDateFilter ? m.date_measurement === selectedDateFilter : true;
        return matchWork && matchDate;
    });

    const indexOfLast = currentPage * measurementsPerPage;
    const indexOfFirst = indexOfLast - measurementsPerPage;
    const currentMeasurements = filteredMeasurements.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredMeasurements.length / measurementsPerPage);

    const handleDeleteMeasurement = (id) => {
        const measurement = measurements.find(m => m.id === id);
        if (measurement) {
            setMeasurementToDelete(measurement);
            setDeleteModalOpen(true);
        }
    };

    const handleMeasurementDeletedSuccess = (deletedId) => {
        loadMeasurements();
        toast.success(`Medição #${deletedId} excluída com sucesso!`);
        closeDeleteModal();
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setMeasurementToDelete(null);
    };

    const exportSingleMeasurementToExcel = (measurement) => {
        const exportData = [];
        if (Array.isArray(measurement.items)) {
            measurement.items.forEach((item) => {
                exportData.push({
                    ID_Medição: measurement.id,
                    Obra: getWorkName(measurement.work),
                    Funcionário: getEmployeeName(measurement.employee),
                    Data: measurement.date_measurement,
                    Identificador: item.identifier,
                    Tipo: item.type,
                    Altura_cm: item.height_cm,
                    Largura_cm: item.width_cm,
                    Localização: item.localization,
                    Observações: item.observations,
                });
            });
        }
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Medicao_ID_${measurement.id}`);
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const file = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(file, `Medicao_${measurement.id}_${getWorkName(measurement.work)}.xlsx`);
        toast.success(`Medição ${measurement.id} exportada para Excel!`);
    };

    const exportSingleMeasurementToPdf = async (measurement) => {
        const input = document.getElementById(`measurement-card-${measurement.id}`);
        if (!input) {
            toast.error("Elemento da medição para exportar PDF não encontrado!");
            return;
        }
        toast.info(`Gerando PDF para Medição ${measurement.id}, aguarde...`);
        try {
            const canvas = await html2canvas(input, { scale: 3, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`Medicao_${measurement.id}_${getWorkName(measurement.work)}.pdf`);
            toast.success(`PDF da Medição ${measurement.id} exportado com sucesso!`);
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            toast.error("Erro ao gerar PDF.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold text-gray-700">Carregando dados...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-4">Nova Medição de Obra</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="workSelect" className="block text-sm mb-1">Obra</label>
                        <select
                            id="workSelect"
                            className="w-full border px-2 py-1 rounded"
                            value={selectedWork}
                            onChange={(e) => setSelectedWork(e.target.value)}
                            required
                        >
                            <option value="">Selecione</option>
                            {Array.isArray(works) && works.map((work) => (
                                <option key={work.id} value={work.id}>{work.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="employeeSelect" className="block text-sm mb-1">Funcionário</label>
                        <select
                            id="employeeSelect"
                            className="w-full border px-2 py-1 rounded"
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            required
                        >
                            <option value="">Selecione</option>
                            {Array.isArray(employees) && employees.map((emp) => (
                                <option key={emp.id} value={String(emp.id)}>
                                    {emp.username || emp.full_name || `ID: ${emp.id}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dateInput" className="block text-sm mb-1">Data</label>
                        <input
                            id="dateInput"
                            type="date"
                            className="w-full border px-2 py-1 rounded"
                            value={date_measurement}
                            onChange={(e) => setDateMeasurement(e.target.value)}
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="observationsTextarea" className="block text-sm mb-1">Observações</label>
                        <textarea
                            id="observationsTextarea"
                            className="w-full border px-2 py-1 rounded"
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="font-medium mb-2">Itens de Medição</h3>
                    {Array.isArray(items) && items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
                            <input type="text" placeholder="Identificador" value={item.identifier} onChange={(e) => handleItemChange(index, "identifier", e.target.value)} className="border px-2 py-1 rounded" required />
                            <select
                                className="border px-2 py-1 rounded"
                                value={item.type}
                                onChange={(e) => handleItemChange(index, "type", e.target.value)}
                                required
                            >
                                <option value="">Selecione Tipo</option>
                                {Array.isArray(itemTypeOptions) && itemTypeOptions.map((typeOption) => (
                                    <option key={typeOption.value} value={typeOption.value}>
                                        {typeOption.label}
                                    </option>
                                ))}
                            </select>
                            <input type="number" placeholder="Altura (cm)" value={item.height_cm} onChange={(e) => handleItemChange(index, "height_cm", e.target.value)} className="border px-2 py-1 rounded" required />
                            <input type="number" placeholder="Largura (cm)" value={item.width_cm} onChange={(e) => handleItemChange(index, "width_cm", e.target.value)} className="border px-2 py-1 rounded" required />
                            <select
                                className="border px-2 py-1 rounded"
                                value={item.localization}
                                onChange={(e) => handleItemChange(index, "localization", e.target.value)}
                                required
                            >
                                <option value="">Selecione Localização</option>
                                {Array.isArray(itemLocalizationOptions) && itemLocalizationOptions.map((locOption) => (
                                    <option key={locOption.value} value={locOption.value}>
                                        {locOption.label}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-1 items-center">
                                <input type="text" placeholder="Observações" value={item.observations} onChange={(e) => handleItemChange(index, "observations", e.target.value)} className="border px-1 py-1 rounded w-full" />
                                <MinusCircleIcon onClick={() => removeItem(index)} className="h-7 w-7 text-red-500 cursor-pointer hover:text-red-600" />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addItem} className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
                        + Adicionar Item
                    </button>
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="submit" className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200">
                        Salvar Medição
                    </button>
                </div>
            </form>
            {/* Filtros e Indicadores */}
            <div className="mt-10">
                <div className="flex flex-wrap gap-4 mb-6">
                    <div>
                        <label htmlFor="workFilter" className="text-sm text-gray-600">Filtrar por obra:</label>
                        <select
                            id="workFilter"
                            className="border px-2 py-1 rounded"
                            value={selectedWorkFilter}
                            onChange={(e) => setSelectedWorkFilter(e.target.value)}
                        >
                            <option value="">Todas</option>
                            {Array.isArray(filteredMeasurements) && Array.from(new Set(filteredMeasurements.map((m) => getWorkName(m.work)))).map((name, idx) => (
                                <option key={idx} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dateFilter" className="text-sm text-gray-600">Filtrar por data:</label>
                        <input
                            id="dateFilter"
                            type="date"
                            className="border px-2 py-1 rounded"
                            value={selectedDateFilter}
                            onChange={(e) => setSelectedDateFilter(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-100 text-blue-800 p-4 rounded shadow-sm text-center">
                        <p className="text-sm">Total de Medições</p>
                        <p className="text-xl font-bold">{filteredMeasurements.length}</p>
                    </div>
                    <div className="bg-green-100 text-green-800 p-4 rounded shadow-sm text-center">
                        <p className="text-sm">Total de Itens Medidos</p>
                        <p className="text-xl font-bold">
                            {Array.isArray(filteredMeasurements) ? filteredMeasurements.reduce((acc, m) => acc + (Array.isArray(m.items) ? m.items.length : 0), 0) : 0}
                        </p>
                    </div>
                    <div className="flex items-end justify-end gap-2"></div>
                </div>
                <div id="measurements-list-section">
                    {filteredMeasurements.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Nenhuma medição encontrada com os filtros aplicados.
                        </p>
                    ) : (
                        Array.isArray(currentMeasurements) && currentMeasurements.map((measurement) => (
                            <div key={measurement.id} id={`measurement-card-${measurement.id}`} className="bg-white border rounded shadow p-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <p className="font-bold text-gray-800">
                                            Obra: <span className="text-blue-600">{getWorkName(measurement.work)}</span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Medido por: <strong>{measurement.employee_name}</strong> em {new Date(measurement.date_measurement).toLocaleDateString("pt-BR")}
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-400">#ID {measurement.id}
                                        <button
                                            onClick={() => handleDeleteMeasurement(measurement.id)}
                                            className="text-sm text-red-600 ml-4 hover:underline"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                                {measurement.observations && (
                                    <p className="text-sm text-gray-600 mb-3">
                                        <strong>Obs:</strong> {measurement.observations}
                                    </p>
                                )}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border border-gray-200 rounded overflow-hidden">
                                        <thead className="bg-gray-100 text-left">
                                            <tr>
                                                <th className="px-2 py-1 border">Código</th>
                                                <th className="px-2 py-1 border">Tipo</th>
                                                <th className="px-2 py-1 border">Altura (cm)</th>
                                                <th className="px-2 py-1 border">Largura (cm)</th>
                                                <th className="px-2 py-1 border">Localização</th>
                                                <th className="px-2 py-1 border">Observações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(measurement.items) && measurement.items.map((item, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="px-2 py-1 border">{item.identifier}</td>
                                                    <td className="px-2 py-1 border">{item.type}</td>
                                                    <td className="px-2 py-1 border">{item.height_cm}</td>
                                                    <td className="px-2 py-1 border">{item.width_cm}</td>
                                                    <td className="px-2 py-1 border">{item.localization}</td>
                                                    <td className="px-2 py-1 border">{item.observations}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => exportSingleMeasurementToPdf(measurement)}
                                        className="text-blue-600 px-3 py-1 rounded hover:underline text-sm flex items-center"
                                    >
                                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                                        PDF
                                    </button>
                                    <button
                                        onClick={() => exportSingleMeasurementToExcel(measurement)}
                                        className="text-green-600 px-3 py-1 rounded hover:underline text-sm flex items-center"
                                    >
                                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                                        Excel
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                    {/* PAGINAÇÃO */}
                    {filteredMeasurements.length > measurementsPerPage && (
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                if (page >= 1 && page <= totalPages) setCurrentPage(page);
                            }}
                        />
                    )}
                </div>
            </div>
            {deleteModalOpen && measurementToDelete && (
                <DeleteConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={closeDeleteModal}
                    itemId={measurementToDelete.id}
                    itemDescription={
                        <>
                            Medição #<strong>{measurementToDelete.id}</strong> da obra{" "}
                            <strong>{getWorkName(measurementToDelete.work)}</strong>
                        </>
                    }
                    deleteEndpoint="/measurements/"
                    onDeleteSuccess={handleMeasurementDeletedSuccess}
                />
            )}
        </div>
    );
};

export default MeasurementForm;
