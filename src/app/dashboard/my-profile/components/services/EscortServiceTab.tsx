import React from 'react';
import { escortServices } from '../../../../../data/services';

interface EscortServiceTabProps {
  selectedServices: string[];
  onToggleService: (serviceId: string) => void;
}

const EscortServiceTab: React.FC<EscortServiceTabProps> = ({ 
  selectedServices, 
  onToggleService 
}) => {
  return (
    <div className="mt-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {escortServices.map((service) => (
          <button
            key={service.id}
            type="button"
            className={`px-3 py-1 border rounded-md text-sm transition-colors ${selectedServices.includes(service.id) 
              ? 'bg-rose-700 text-white border-rose-800' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-rose-50 hover:border-rose-300'}`}
            onClick={() => onToggleService(service.id)}
            title={service.description}
          >
            {service.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EscortServiceTab;
