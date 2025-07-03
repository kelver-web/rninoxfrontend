import { useState, useEffect } from 'react';
import api from '@/services/api';
import { toast } from 'react-toastify';



const EditAddressModal = ({ isOpen, onClose, address, onAddressUpdated }) => {
    
    const [formData, setFormData] = useState({
        street: address?.street || '',
        number: address?.number || '',
        neighborhood: address?.neighborhood || '',
        city: address?.city || '',
        state: address?.state || '',
        zip_code: address?.zip_code || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (address) {
            setFormData({
                street: address.street || '',
                number: address.number || '',
                neighborhood: address.neighborhood || '',
                city: address.city || '',
                state: address.state || '',
                zip_code: address.zip_code || '',
            });
        }
    }, [address]);

    // Garante que o modal não seja renderizado se não estiver aberto
    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Os dados a serem enviados. Prepara o CEP removendo não-numéricos.
            const dataToSend = {
                street: formData.street,
                number: formData.number || '',
                neighborhood: formData.neighborhood || '',
                city: formData.city,
                state: formData.state,
                zip_code: formData.zip_code.replace(/\D/g, '') || '',
            };

            // Requisição PUT para atualizar o endereço específico
            const response = await api.put(`/addresses/${address.id}/`, dataToSend); 

            toast.success('Endereço atualizado com sucesso!');
            onAddressUpdated();
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar endereço:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.detail || Object.values(error.response?.data || {}).flat().join(', ') || error.message;
            toast.error(`Erro ao atualizar endereço: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Editar Endereço</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="street" className="block text-gray-700 text-sm font-bold mb-2">
                            Rua *
                        </label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.street}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="number" className="block text-gray-700 text-sm font-bold mb-2">
                            Número
                        </label>
                        <input
                            type="text"
                            id="number"
                            name="number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.number}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="neighborhood" className="block text-gray-700 text-sm font-bold mb-2">
                            Bairro
                        </label>
                        <input
                            type="text"
                            id="neighborhood"
                            name="neighborhood"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.neighborhood}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
                            Cidade *
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
                            Estado (Ex: RN) *
                        </label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.state}
                            onChange={handleInputChange}
                            maxLength="2"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="zip_code" className="block text-gray-700 text-sm font-bold mb-2">
                            CEP
                        </label>
                        <input
                            type="text"
                            id="zip_code"
                            name="zip_code"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.zip_code}
                            onChange={handleInputChange}
                            maxLength="9"
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
                            disabled={isLoading}
                        >
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAddressModal;
