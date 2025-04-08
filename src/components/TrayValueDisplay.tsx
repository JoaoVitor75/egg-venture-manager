
import { useEggContext } from '@/contexts/EggContext';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const TrayValueDisplay = () => {
  const { selectedAviary, selectedBatch, updateAviary } = useEggContext();
  const { toast } = useToast();

  if (!selectedAviary || !selectedBatch) return null;

  const handleIncreaseTrayValue = () => {
    updateAviary(selectedBatch.id, {
      ...selectedAviary,
      trayValue: selectedAviary.trayValue + 1
    });
  };

  const handleDecreaseTrayValue = () => {
    if (selectedAviary.trayValue <= 1) return;
    
    updateAviary(selectedBatch.id, {
      ...selectedAviary,
      trayValue: selectedAviary.trayValue - 1
    });
  };

  return (
    <div className="mb-4">
      <span className="text-center block mb-1 text-gray-500 text-sm">Valor da Bandeja</span>
      <div className="flex items-center justify-center bg-white border border-gray-300 rounded-md p-1 shadow-sm">
        <button
          onClick={handleDecreaseTrayValue}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
        >
          <Minus size={16} />
        </button>
        
        <div className="flex-1 text-center font-medium">
          <span className="bg-[#F2FCE2] px-2 py-1 rounded text-[#8BC53F]">
            {selectedAviary.trayValue}
          </span>
        </div>
        
        <button
          onClick={handleIncreaseTrayValue}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default TrayValueDisplay;
