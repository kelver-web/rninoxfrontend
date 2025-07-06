// src/pages/works/WorksPage.jsx

import React, { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import api from '@/services/api';
import { toast } from 'react-toastify';
import { PlusIcon, BuildingOffice2Icon, PencilIcon, TrashIcon, ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline'; // Adicionado ícones de paginação
import { Button, IconButton, Typography } from '@material-tailwind/react'; // Adicionado Button, IconButton, Typography para paginação

import CreateWorkModal from '@/components/work/CreateWorkModal';
import EditWorkModal from '@/components/work/EditWorkModal';
import DeleteConfirmationModal from '@/components/kanban/DeleteConfirmationModal';


// --- COMPONENTE AUXILIAR DE CONTROLES DE PAGINAÇÃO (reutilizado) ---
// Idealmente, este componente estaria em um arquivo separado e seria importado.
// Para fins de demonstração completa, ele está aqui.
function PaginationControls({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-right gap-2 p-2">
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

const WorksPage = () => {
    const [works, setWorks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [workToEdit, setWorkToEdit] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [workToDelete, setWorkToDelete] = useState(null);

    // --- Estados de Paginação ---
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5; // Defina quantos itens por página você quer

    const WORKS_API_ENDPOINT = '/works/';

    // Função para buscar as obras do backend
    const fetchWorks = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(WORKS_API_ENDPOINT);
            setWorks(response.data);
            setCurrentPage(1); // Resetar para a primeira página ao recarregar dados
        } catch (error) {
            console.error('Erro ao buscar obras:', error);
            toast.error('Erro ao carregar obras. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchWorks();
    }, []);

    // --- Funções para o Modal de Criação ---
    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleWorkCreated = () => {
        fetchWorks();
        handleCloseCreateModal();
    };

    // --- Funções de Edição ---
    const handleEditWork = (work) => {
        setWorkToEdit(work);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setWorkToEdit(null);
    };

    const handleWorkUpdated = () => {
        fetchWorks();
        handleCloseEditModal();
    };

    // --- Funções de Exclusão ---
    const handleDeleteWork = (work) => {
        setWorkToDelete(work);
        setIsDeleteModalOpen(true);
    };

    const handleWorkDeletedSuccess = () => {
        fetchWorks();
        handleCloseDeleteModal();
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setWorkToDelete(null);
    };

    // --- Lógica de Paginação ---
    const indexOfLastWork = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstWork = indexOfLastWork - ITEMS_PER_PAGE;
    const currentWorks = works.slice(indexOfFirstWork, indexOfLastWork);
    const totalPages = Math.ceil(works.length / ITEMS_PER_PAGE);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <BuildingOffice2Icon className="h-8 w-8 text-blue-600 mr-2" />
                    Gerenciar Obras
                </h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center px-4 py-1 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Adicionar Obra
                </button>
            </div>

            {isLoading ? (
                <p className="text-gray-600">Carregando obras...</p>
            ) : works.length === 0 ? (
                <p className="text-gray-600">Nenhuma obra cadastrada ainda.</p>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nome da Obra
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Endereço
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        CEP
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Telefone
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Mapeia apenas as obras da página atual */}
                                {currentWorks.map((work) => (
                                    <tr key={work.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {work.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {work.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {work.address_name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {work.zip_code || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {work.client || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {work.phone || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditWork(work)}
                                                className="text-blue-600 hover:text-blue-900 mr-1 p-1 rounded-full hover:bg-blue-100"
                                                title="Editar Obra"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteWork(work)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                                title="Excluir Obra"
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

            {/* Modal de Cadastro de Obra */}
            <CreateWorkModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onWorkCreated={handleWorkCreated}
            />

            {/* Modal de Confirmação de Exclusão para Obras */}
            {isDeleteModalOpen && workToDelete && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    itemId={workToDelete.id}
                    itemDescription={
                        <>
                            Obra: <strong>{workToDelete.name || 'N/A'}</strong>
                            {' (Cliente: '}
                            {workToDelete.client || 'N/A'}
                            {')'}
                        </>
                    }
                    itemToastMessage={`Obra "${workToDelete.name || 'N/A'}"`}
                    deleteEndpoint={WORKS_API_ENDPOINT}
                    onDeleteSuccess={handleWorkDeletedSuccess}
                />
            )}

            {/* Modal de Edição de Obra */}
            {isEditModalOpen && workToEdit && (
                <EditWorkModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    work={workToEdit}
                    onWorkUpdated={handleWorkUpdated}
                />
            )}
        </div>
    );
};

export default WorksPage;
