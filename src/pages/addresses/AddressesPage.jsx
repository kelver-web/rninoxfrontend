// src/pages/addresses/AddressesPage.jsx

import React, { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import api from '@/services/api';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  ArrowLongLeftIcon, // Ícones de paginação
  ArrowLongRightIcon, // Ícones de paginação
} from '@heroicons/react/24/outline';
import { Button, IconButton, Typography } from '@material-tailwind/react'; // Componentes do Material Tailwind para paginação

import CreateAddressModal from '@/components/addresses/CreateAddressModal';
import DeleteConfirmationModal from '@/components/kanban/DeleteConfirmationModal';
import EditAddressModal from '@/components/addresses/EditAddressModal';


// --- COMPONENTE AUXILIAR DE CONTROLES DE PAGINAÇÃO (reutilizado) ---
function PaginationControls({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-right gap-2 p-2">
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

const AddressesPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    // --- Estados de Paginação ---
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5; // Defina quantos itens por página você quer

    // Definimos o endpoint base para Endereços
    const ADDRESSES_API_ENDPOINT = '/addresses/';

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(ADDRESSES_API_ENDPOINT);
            setAddresses(response.data);
            setCurrentPage(1); // Resetar para a primeira página ao recarregar dados
        } catch (error) {
            console.error('Erro ao buscar endereços:', error);
            toast.error('Erro ao carregar endereços. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleAddressCreated = () => {
        fetchAddresses();
        handleCloseCreateModal();
    };

    const handleEditAddress = (address) => {
        setAddressToEdit(address);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setAddressToEdit(null);
    };

    const handleAddressUpdated = () => {
        fetchAddresses();
        handleCloseEditModal();
    };

    const handleDeleteAddress = (address) => {
        setAddressToDelete(address);
        setIsDeleteModalOpen(true);
    };

    // Esta função será chamada QUANDO o DeleteConfirmationModal DELETAR com sucesso
    const handleAddressDeletedSuccess = () => {
        fetchAddresses();
        handleCloseDeleteModal();
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setAddressToDelete(null);
    };

    // --- Lógica de Paginação ---
    const indexOfLastAddress = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstAddress = indexOfLastAddress - ITEMS_PER_PAGE;
    const currentAddresses = addresses.slice(indexOfFirstAddress, indexOfLastAddress);
    const totalPages = Math.ceil(addresses.length / ITEMS_PER_PAGE);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <MapPinIcon className="h-8 w-8 text-green-600 mr-2" />
                    Gerenciar Endereços
                </h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center px-4 py-1 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition duration-200"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Adicionar Endereço
                </button>
            </div>

            {isLoading ? (
                <p className="text-gray-600">Carregando endereços...</p>
            ) : addresses.length === 0 ? (
                <p className="text-gray-600">Nenhum endereço cadastrado ainda.</p>
            ) : (
                <> {/* Fragment para envolver a tabela e os controles de paginação */}
                    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rua
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Número
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bairro
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cidade
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        CEP
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Usa os dados da página atual */}
                                {currentAddresses.map((address) => (
                                    <tr key={address.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {address.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {address.street || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {address.number || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {address.neighborhood || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {address.city || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {address.state || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {address.zip_code || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditAddress(address)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                                                title="Editar Endereço"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(address)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                                title="Excluir Endereço"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Controles de Paginação */}
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            <CreateAddressModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onAddressCreated={handleAddressCreated}
            />

            {isDeleteModalOpen && addressToDelete && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    itemId={addressToDelete.id}
                    itemDescription={
                        <>
                            Endereço: <strong>{addressToDelete.street || 'N/A'}, {addressToDelete.number || 'N/A'}</strong>
                            {' - '}
                            {addressToDelete.city || 'N/A'}/{addressToDelete.state || 'N/A'}
                        </>
                    }

                    itemToastMessage={`Endereço "${addressToDelete.street || 'N/A'}, ${addressToDelete.number || 'N/A'}"`}
                    deleteEndpoint={ADDRESSES_API_ENDPOINT}
                    onDeleteSuccess={handleAddressDeletedSuccess}
                />
            )}

            {isEditModalOpen && addressToEdit && (
                <EditAddressModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    address={addressToEdit}
                    onAddressUpdated={handleAddressUpdated}
                />
            )}
        </div>
    );
};

export default AddressesPage;
