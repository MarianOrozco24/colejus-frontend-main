import React from 'react'

const DeleteTrainingModal = ({ isOpen, onClose, onDelete, trainingTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Eliminar noticia</h2>
                <p className="text-gray-600 mb-6">
                    ¿Estás seguro de que deseas eliminar la capacitación{' '}
                    <strong>{trainingTitle}</strong>?
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 text-gray-500 hover:text-gray-800"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        onClick={onDelete}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteTrainingModal