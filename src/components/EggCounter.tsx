
import { Plus, Minus, X, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useEggContext } from '@/contexts/EggContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';

const EggCounter = () => {
  const { selectedEgg, updateEggCount, setSelectedEgg, selectedAviary } = useEggContext();
  const [trays, setTrays] = useState(0);
  const [units, setUnits] = useState(0);
  const [editingUnits, setEditingUnits] = useState(false);
  const [unitInputValue, setUnitInputValue] = useState('');
  const { toast } = useToast();
  const unitInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (selectedEgg) {
      setTrays(selectedEgg.trays || 0);
      setUnits(selectedEgg.units || 0);
      setUnitInputValue((selectedEgg.units || 0).toString())
    }
  }, [selectedEgg]);

  useEffect(() => {
    if (editingUnits && unitInputRef.current) {
      unitInputRef.current.focus();
    }
  }, [editingUnits]);

  const handleIncrease = (type: 'trays' | 'units') => {
    if (type === 'trays') {
      setTrays(prev => prev + 1);
    } else {
      setUnits(prev => prev + 1);
      setUnitInputValue((units + 1).toString());
    }
  };

  const handleDecrease = (type: 'trays' | 'units') => {
    if (type === 'trays') {
      setTrays(prev => (prev > 0 ? prev - 1 : 0));
    } else {
      setUnits(prev => (prev > 0 ? prev - 1 : 0));
      setUnitInputValue(units > 0 ? (units - 1).toString() : '0');
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

  const handleUnitsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setUnitInputValue(value);
    setUnits(parseInt(value) || 0);
  };

  const handleUnitsDisplayClick = () => {
    setUnitInputValue(units.toString());
    setEditingUnits(true);
  };

  const handleUnitsInputBlur = () => {
    setEditingUnits(false);
  };

  const handleUnitsInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditingUnits(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Para Água (mantém como estava)
    const value = parseInt(e.target.value) || 0;
    setUnits(value);
    setUnitInputValue(value.toString());
  };

  if (!selectedEgg || !selectedAviary) return null;

  const isBird = selectedEgg.name === 'Aves Macho' || selectedEgg.name === 'Aves Fêmea';
  const isWater = selectedEgg.name === 'Água';

  // Calculate the total count based on trays and units
  const totalCount = selectedEgg.useTrays && !isBird
    ? trays * selectedAviary.trayValue + units
    : units;

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
            {/* Mostrar opção de bandejas apenas para tipos de ovos que não sejam aves e água */}
            {selectedEgg.useTrays && !isBird && !isWater && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-center mb-3 text-gray-700 font-medium">Bandejas</h3>
                <div className="flex justify-center items-center gap-4">
                  <button 
                    onClick={() => handleDecrease('trays')}
                    className="w-12 h-12 rounded-full bg-egg-green text-white flex items-center justify-center shadow-md"
                  >
                    <Minus size={20} />
                  </button>
                  <div className="egg-counter w-16 h-16 text-2xl flex items-center justify-center">{trays}</div>
                  <button 
                    onClick={() => handleIncrease('trays')}
                    className="w-12 h-12 rounded-full bg-egg-green text-white flex items-center justify-center shadow-md"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {selectedAviary.trayValue > 0 && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {trays} x {selectedAviary.trayValue} = {trays * selectedAviary.trayValue} ovos
                  </p>
                )}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-center mb-3 text-gray-700 font-medium">Unidades</h3>
              {isWater ? (
                <Input
                  type="number"
                  value={units || ''}
                  onChange={handleInputChange}
                  placeholder="Digite a quantidade de água"
                  className="text-center"
                />
              ) : (
                <div className="flex justify-center items-center gap-4">
                  <button 
                    onClick={() => handleDecrease('units')}
                    className="w-12 h-12 rounded-full bg-egg-green text-white flex items-center justify-center shadow-md"
                  >
                    <Minus size={20} />
                  </button>
                  {editingUnits ? (
                    <Input
                      ref={unitInputRef}
                      type="number"
                      value={unitInputValue}
                      onChange={handleUnitsInputChange}
                      onBlur={handleUnitsInputBlur}
                      onKeyDown={handleUnitsInputKeyDown}
                      className="w-16 h-16 text-2xl text-center border-none outline-none shadow-inner bg-white font-bold"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  ) : (
                    <div
                      className="egg-counter w-16 h-16 text-2xl flex items-center justify-center font-bold cursor-pointer select-none"
                      onClick={handleUnitsDisplayClick}
                    >
                      {units}
                    </div>
                  )}
                  <button 
                    onClick={() => handleIncrease('units')}
                    className="w-12 h-12 rounded-full bg-egg-green text-white flex items-center justify-center shadow-md"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              )}
            </div>
            
            {/* Mostrar o total para todos os tipos exceto água e aves mortas */}
            {!isWater && !isBird && (
              <div className="bg-[#F2FCE2] p-4 rounded-lg">
                <h3 className="text-center font-medium text-egg-green-dark">
                  Total de Ovos
                </h3>
                <p className="text-center text-xl font-bold text-egg-green-dark">{totalCount}</p>
              </div>
            )}
            {/* Para Machos/Fêmeas, mostrar “Aves mortas” */}
            {isBird && (
              <div className="bg-[#F2FCE2] p-4 rounded-lg">
                <h3 className="text-center font-medium text-egg-green-dark">
                  Aves mortas
                </h3>
                <p className="text-center text-xl font-bold text-egg-green-dark">{units}</p>
              </div>
            )}
            {/* Para Água, não mostrar campo adicional */}
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
