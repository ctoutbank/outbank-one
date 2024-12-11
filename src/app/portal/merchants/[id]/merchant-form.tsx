"use client"
import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
}

const MerchantForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Enviar os dados para a API para salvar ou atualizar no banco de dados
      const response = await fetch('/api/merchant', {
        method: 'POST', // Pode ser 'PUT' para atualização
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar os dados');
      }

      const result = await response.json();
      console.log('Dados salvos com sucesso:', result);
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
    }
  };

  return (
    <form className="p-4 border rounded shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700">Nome</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Telefone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Endereço</label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Complemento</label>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Cidade</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Estado</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">CEP</label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="button"
        onClick={handleSave}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Salvar
      </button>
    </form>
  );
};

export default MerchantForm;
