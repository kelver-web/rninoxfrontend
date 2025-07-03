// src/pages/vehicles/VehiclesPages.jsx

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { toast } from 'react-toastify';
import {
    PlusIcon,
    TruckIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

import CreateVehicleModal from '@/components/vehicles/CreateVehicleModal';
import DeleteConfirmationModal from '@/components/kanban/DeleteConfirmationModal';
import EditVehicleModal from '@/components/vehicles/EditVehicleModal';


const VehiclesPages = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [vehicleToEdit, setVehicleToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);

    const fetchVehicles = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/logistics/'
            );
            setVehicles(response.data);
        } catch (error) {
            console.error('Erro ao buscar veículos:', error);
            toast.error('Erro ao carregar veículos. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleVehicleCreated = () => {
        fetchVehicles();
        handleCloseCreateModal();
    };

    const handleEditVehicle = (vehicle) => {
        setVehicleToEdit(vehicle);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setVehicleToEdit(null);
    };

    const handleVehicleUpdated = () => {
        fetchVehicles();
        handleCloseEditModal();
    };

    const handleDeleteVehicle = (vehicle) => {
        setVehicleToDelete(vehicle);
        setIsDeleteModalOpen(true);
    };

    const handleVehicleDeletedSuccess = () => {
        fetchVehicles();
        handleCloseDeleteModal();
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setVehicleToDelete(null);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <TruckIcon className="h-8 w-8 text-indigo-600 mr-2" />
                    Gerenciar Veículos
                </h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center px-4 py-1 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Adicionar Veículo
                </button>
            </div>

            {isLoading ? (
                <p className="text-gray-600">Carregando veículos...</p>
            ) : vehicles.length === 0 ? (
                <p className="text-gray-600">Nenhum veículo cadastrado ainda.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Placa
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Marca
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Modelo
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {vehicle.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {vehicle.license_plate || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {vehicle.brand || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {vehicle.model || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditVehicle(vehicle)}
                                            className="text-blue-600 hover:text-blue-900 mr-1 p-1 rounded-full hover:bg-blue-100"
                                            title="Editar Veículo"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteVehicle(vehicle)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                            title="Excluir Veículo"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <CreateVehicleModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onVehicleCreated={handleVehicleCreated}
            />

            {isDeleteModalOpen && vehicleToDelete && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    itemId={vehicleToDelete.id}
                    // AJUSTADO AQUI: Passa a Placa, Marca e Modelo para a descrição
                    itemDescription={
                        <>
                            Veículo: <strong>{vehicleToDelete.license_plate || 'N/A'}</strong>
                            {' | '}
                            {vehicleToDelete.brand || 'N/A'} - {vehicleToDelete.model || 'N/A'}
                        </>
                    }
                    deleteEndpoint="/logistics/"
                    onDeleteSuccess={handleVehicleDeletedSuccess}
                />
            )}

            <EditVehicleModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                vehicle={vehicleToEdit}
                onVehicleUpdated={handleVehicleUpdated}
            />
        </div>
    );
};

export default VehiclesPages;
