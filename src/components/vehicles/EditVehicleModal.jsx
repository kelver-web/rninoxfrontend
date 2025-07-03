// src/components/vehicles/EditVehicleModal.jsx

import React, { useState, useEffect } from 'react';
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


const EditVehicleModal = ({ isOpen, onClose, vehicle, onVehicleUpdated }) => {
    const [formData, setFormData] = useState({
        license_plate: vehicle?.license_plate || '',
        model: vehicle?.model || '',
        brand: vehicle?.brand || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (vehicle) {
            setFormData({
                license_plate: vehicle.license_plate || '',
                model: vehicle.model || '',
                brand: vehicle.brand || '',
            });
        }
    }, [vehicle]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await api.put(`/logistics/${vehicle.id}/`, formData);
            toast.success('Veículo atualizado com sucesso!');
            onVehicleUpdated();
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar veículo:', error.response ? error.response.data : error.message);
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Erro ao atualizar veículo. Verifique os dados e tente novamente.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="sm">
            <DialogHeader>Editar Veículo</DialogHeader>
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
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default EditVehicleModal;
