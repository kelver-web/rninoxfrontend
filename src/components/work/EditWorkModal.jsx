// src/components/work/EditWorkModal.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '@/services/api';


const EditWorkModal = ({ isOpen, onClose, work, onWorkUpdated }) => {

    const [name, setName] = useState(work?.name || '');
    const [selectedAddressId, setSelectedAddressId] = useState(work?.address || '');
    const [clientName, setClientName] = useState(work?.client || '');
    const [phone, setPhone] = useState(work?.phone || '');

    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddressesLoading, setIsAddressesLoading] = useState(false);
    const ADDRESSES_API_ENDPOINT = '/addresses/';
   
    const WORKS_API_ENDPOINT = '/works/';

    useEffect(() => {
        if (isOpen && work) {
           
            setName(work.name || '');
            setSelectedAddressId(work.address || '');
            setClientName(work.client || '');
            setPhone(work.phone || '');

            // Busca os endereços disponíveis
            const fetchAddresses = async () => {
                setIsAddressesLoading(true);
                try {
                    const response = await api.get(ADDRESSES_API_ENDPOINT);
                    setAddresses(response.data);
                } catch (error) {
                    console.error('Erro ao buscar endereços para edição:', error);
                    toast.error('Erro ao carregar endereços para seleção.');
                } finally {
                    setIsAddressesLoading(false);
                }
            };
            fetchAddresses();
        }
    }, [isOpen, work, ADDRESSES_API_ENDPOINT]);

    // Não renderiza o modal se não estiver aberto
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!selectedAddressId) {
            toast.error('Por favor, selecione um endereço para a obra.');
            setIsLoading(false);
            return;
        }

        try {
            const updatedWorkData = {
                name,
                address: selectedAddressId,
                client: clientName,
                phone: phone,
            };

            // Requisição PUT para atualizar a obra específica
            await api.put(`${WORKS_API_ENDPOINT}${work.id}/`, updatedWorkData);

            toast.success('Obra atualizada com sucesso!');
            onWorkUpdated();
            onClose();

        } catch (error) {
            console.error('Erro ao atualizar obra:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.address || error.response?.data?.detail || Object.values(error.response?.data || {}).flat().join(', ') || error.message;
            toast.error(`Erro ao atualizar obra: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Editar Obra</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Nome da Obra *
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                            Endereço *
                        </label>
                        {isAddressesLoading ? (
                            <p className="text-gray-600">Carregando endereços...</p>
                        ) : addresses.length === 0 ? (
                            <p className="text-red-500">Nenhum endereço disponível. Cadastre um endereço primeiro.</p>
                        ) : (
                            <select
                                id="address"
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={selectedAddressId}
                                onChange={(e) => setSelectedAddressId(parseInt(e.target.value, 10))} // Converte para número (ID)
                                required
                            >
                                <option value="" disabled>Selecione um endereço</option>
                                {addresses.map((addr) => (
                                    <option key={addr.id} value={addr.id}>
                                        {addr.street}, {addr.number ? `${addr.number}, ` : ''}{addr.neighborhood ? `${addr.neighborhood}, ` : ''}{addr.city} - {addr.state}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                            Telefone *
                        </label>
                        <input
                            type="text"
                            id="phone"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="clientName" className="block text-gray-700 text-sm font-bold mb-2">
                            Nome do Cliente *
                        </label>
                        <input
                            type="text"
                            id="clientName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                            disabled={isLoading || addresses.length === 0 || !selectedAddressId}
                        >
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditWorkModal;
