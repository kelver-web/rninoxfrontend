// src/components/modals/CreateWorkModal.jsx
import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { toast } from 'react-toastify';


const CreateWorkModal = ({ isOpen, onClose, onWorkCreated }) => {
    const [name, setName] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [clientName, setClientName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAddressesLoading, setIsAddressesLoading] = useState(false);

    
    useEffect(() => {
        if (isOpen) {
            const fetchAddresses = async () => {
                setIsAddressesLoading(true);
                try {
                    const response = await api.get('/addresses/');
                    setAddresses(response.data);
                    
                    if (response.data.length > 0) {
                        setSelectedAddressId(response.data[0].id);
                    } else {
                        setSelectedAddressId('');
                    }
                } catch (error) {
                    console.error('Erro ao buscar endereços:', error);
                    toast.error('Erro ao carregar endereços para seleção.');
                } finally {
                    setIsAddressesLoading(false);
                }
            };
            fetchAddresses();
        } else {
            
            setName('');
            setSelectedAddressId('');
            setClientName('');
            setPhone('');
        }
    }, [isOpen]);

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
            const newWorkData = {
                name,
                address: selectedAddressId,
                client: clientName,
                phone: phone,
            };

            await api.post('/works/', newWorkData);

            toast.success('Obra cadastrada com sucesso!');
            onWorkCreated();
            setName('');
            setSelectedAddressId(addresses.length > 0 ? addresses[0].id : '');
            setClientName('');
            setPhone('');

        } catch (error) {
            console.error('Erro ao cadastrar obra:', error.response?.data || error.message);

            const errorMessage = error.response?.data?.address || error.response?.data?.detail || Object.values(error.response?.data || {}).flat().join(', ') || error.message;
            toast.error(`Erro ao cadastrar obra: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Cadastrar Nova Obra</h2>
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
                                onChange={(e) => setSelectedAddressId(parseInt(e.target.value, 10))}
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
                            {isLoading ? 'Salvando...' : 'Salvar Obra'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkModal;
