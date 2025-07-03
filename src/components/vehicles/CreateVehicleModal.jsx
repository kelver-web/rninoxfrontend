// src/components/vehicles/CreateVehicleModal.jsx

import React, { useState } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Input,
    Typography,
} from '@material-tailwind/react';
import { toast } from 'react-toastify';
import api from '@/services/api';


const CreateVehicleModal = ({ isOpen, onClose, onVehicleCreated }) => {
    const [formData, setFormData] = useState({
        license_plate: '',
        model: '',
        brand: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await api.post('/logistics/', formData);
            toast.success('Veículo cadastrado com sucesso!');
            onVehicleCreated();
            onClose();
        } catch (error) {
            console.error('Erro ao cadastrar veículo:', error.response ? error.response.data : error.message);
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Erro ao cadastrar veículo. Verifique os dados e tente novamente.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="sm">
            <DialogHeader>Adicionar Novo Veículo</DialogHeader>
            <DialogBody divider className="flex flex-col gap-4">
                <Input
                    label="Placa *"
                    name="license_plate"
                    value={formData.license_plate}
                    onChange={handleInputChange}
                    maxLength={10}
                    required
                />
                <Input
                    label="Marca *"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                />
                <Input
                    label="Modelo *"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                />
            </DialogBody>
            <DialogFooter className="flex justify-end gap-2">
                <Button variant="text" color="red" onClick={onClose} className="mr-1 p-2">
                    Cancelar
                </Button>
                <Button variant="gradient" color="blue" onClick={handleSubmit} disabled={isSubmitting} className='p-2'>
                    {isSubmitting ? 'Adicionando...' : 'Adicionar'}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default CreateVehicleModal;
