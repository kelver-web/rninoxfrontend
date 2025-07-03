// src/components/kanban/DeleteConfirmationModal.jsx

import { useState } from 'react';
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import api from '@/services/api';
import { toast } from 'react-toastify';


const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    itemId,
    itemDescription,
    deleteEndpoint,
    onDeleteSuccess,
}) => {
    if (!isOpen) return null;

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const urlToDelete = `${deleteEndpoint}${itemId}/`;
            const response = await api.delete(urlToDelete);

            if (response.status !== 204 && response.status !== 200) {
                throw new Error(response.data?.message || 'Erro ao deletar o item.');
            }
            onDeleteSuccess(itemId);
        } catch (error) {
            console.error('Erro ao deletar:', error.response?.data || error.message);
            toast.error(`Falha ao deletar ${itemDescription}: ${error.response?.data?.detail || error.message}`);
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                <div className="flex items-center mb-2">
                    <ExclamationTriangleIcon className="h-10 w-10 text-red-500 mr-3" />
                    <h2 className="text-xl font-semibold mb-1 text-gray-800">Confirmar Exclusão</h2>
                </div>
                <p className="mb-6 text-gray-700">
                    Você tem certeza que deseja excluir **{itemDescription}**?
                    Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
