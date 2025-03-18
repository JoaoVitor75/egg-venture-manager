
import { Plus, Minus, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useEggContext } from '@/contexts/EggContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const EggCounter = () => {
  const { selectedEgg, updateEggCount, setSelectedEgg, collectionMode, selectedAviary } = useEggContext();
  const [trays, setTrays] = useState(0);
  const [units, setUnits] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedEgg) {
      setTrays(selectedEgg.trays || 0);
      setUnits(selectedEgg.units || 0);
    }
  }, [selectedEgg]);

  const handleIncrease = (type: 'trays' | 'units') => {
    if (type === 'trays') {
      setTrays(prev => prev + 1);
    } else {
      setUnits(prev => prev + 1);
    }
  };

  const handleDecrease = (type: 'trays' | 'units') => {
    if (type === 'trays') {
      setTrays(prev => (prev > 0 ? prev - 1 : 0));
    } else {
      setUnits(prev => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleSave = () => {
    if (selectedEgg) {
      updateEggCount(selectedEgg.id, trays, units);
      toast({
        title: "Coleta salva",
        description: `${selectedEgg.name}: ${trays} bandejas e ${units} unidades`,
      });
      setSelectedEgg(null);
    }
  };

  const handleCancel = () => {
    setSelectedEgg(null);
  };

  if (!selectedEgg || !selectedAviary) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-egg-green-dark">{selectedEgg.name}</h2>
          <button onClick={handleCancel} className="p-2 text-gray-400 hover:text-egg-red">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-center mb-3 text-gray-500 font-medium">Bandejas</h3>
              <div className="flex justify-center items-center gap-4">
                <button 
                  onClick={() => handleDecrease('trays')}
                  className="w-12 h-12 rounded-full bg-egg-green text-white flex items-center justify-center shadow-md"
                >
                  <Minus size={20} />
                </button>
                <div className="egg-counter w-16 h-16 text-2xl">{trays}</div>
                <button 
                  onClick={() => handleIncrease('trays')}
                  className="w-12 h-12 rounded-full bg-egg-green text-white flex items-center justify-center shadow-md"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-center mb-3 text-gray-500 font-medium">Unidades</h3>
              <div className="flex justify-center items-center gap-4">
                <button 
                  onClick={() => handleDecrease('units')}
                  className="w-12 h-12 rounded-full bg-egg-green text-white flex items-center justify-center shadow-md"
                >
                  <Minus size={20} />
                </button>
                <div className="egg-counter w-16 h-16 text-2xl">{units}</div>
                <button 
                  onClick={() => handleIncrease('units')}
                  className="w-12 h-12 rounded-full bg-egg-green text-white flex items-center justify-center shadow-md"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="w-1/2 border-egg-red text-egg-red hover:bg-egg-red/10 hover:text-egg-red" 
            onClick={handleCancel}
          >
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button 
            className="w-1/2 bg-egg-green hover:bg-egg-green-dark" 
            onClick={handleSave}
          >
            <Check className="mr-2 h-4 w-4" /> Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EggCounter;
