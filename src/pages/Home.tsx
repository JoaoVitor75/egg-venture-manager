
import Header from '@/components/Header';
import EggTypeButton from '@/components/EggTypeButton';
import EggCounter from '@/components/EggCounter';
import { useEggContext } from '@/contexts/EggContext';
import AviarySelector from '@/components/AviarySelector';
import TrayValueDisplay from '@/components/TrayValueDisplay';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const { eggs, selectedEgg, setSelectedEgg, updateEggCount } = useEggContext();
  const [waterValue, setWaterValue] = useState('');
  const { toast } = useToast();

  // Fechar o contador quando mudar de página
  useEffect(() => {
    return () => {
      setSelectedEgg(null);
    };
  }, [setSelectedEgg]);

  // Encontrar o egg do tipo Água
  const waterEgg = eggs.find(egg => egg.name === 'Água');

  const handleWaterSubmit = () => {
    if (waterEgg) {
      const units = parseInt(waterValue) || 0;
      
      // Atualizar o valor da água
      updateEggCount(waterEgg.id, 0, units);
      
      // Mostrar confirmação
      toast({
        title: "Água registrada",
        description: `${units} unidades de água foram registradas`,
      });
      
      // Limpar o campo
      setWaterValue('');
    }
  };

  // Filtrar água da lista principal
  const eggTypesWithoutWater = eggs.filter(egg => egg.name !== 'Água');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Tonhão" />
      
      <div className="container mx-auto p-4 flex-1">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <AviarySelector />
          <TrayValueDisplay />
        </div>
        
        <div className="grid gap-3 mb-4">
          {eggTypesWithoutWater.map(egg => (
            <EggTypeButton key={egg.id} egg={egg} />
          ))}
        </div>
        
        {/* Seção de Água */}
        {waterEgg && (
          <div className="bg-green-50 p-4 rounded-xl shadow-sm mb-4">
            <h3 className="text-lg font-medium mb-2">Água</h3>
            <Input
              type="number"
              value={waterValue}
              onChange={(e) => setWaterValue(e.target.value)}
              placeholder="Digite a quantidade de água"
              className="mb-3"
            />
            <Button 
              onClick={handleWaterSubmit}
              className="w-full bg-egg-green hover:bg-egg-green-dark"
            >
              Registrar Água
            </Button>
          </div>
        )}
      </div>
      
      {selectedEgg && <EggCounter />}
    </div>
  );
};

export default Home;
