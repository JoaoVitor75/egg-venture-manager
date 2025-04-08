
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
import { Send } from 'lucide-react';

const Home = () => {
  const { eggs, selectedEgg, setSelectedEgg, updateEggCount, clearAllEggCounts } = useEggContext();
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

  const handleWaterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWaterValue(e.target.value);
    
    if (waterEgg) {
      const units = parseInt(e.target.value) || 0;
      updateEggCount(waterEgg.id, 0, units);
    }
  };

  const handleSubmitAll = () => {
    // Aqui você enviaria todos os dados para o servidor
    toast({
      title: "Dados enviados",
      description: "Todas as informações foram enviadas com sucesso!",
    });
    
    // Limpar todos os contadores após enviar
    clearAllEggCounts();
  };

  // Filtrar água da lista principal
  const eggTypesWithoutWater = eggs.filter(egg => egg.name !== 'Água');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Tonhão" />
      
      <div className="container mx-auto p-4 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <AviarySelector />
          <TrayValueDisplay />
        </div>
        
        <div className="grid gap-3 mb-4 flex-1">
          {eggTypesWithoutWater.map(egg => (
            <EggTypeButton key={egg.id} egg={egg} />
          ))}
        </div>
        
        {/* Seção de Água */}
        {waterEgg && (
          <div className="bg-[#F2FCE2] p-4 rounded-xl shadow-sm mb-4">
            <h3 className="text-lg font-medium mb-2 text-egg-green-dark">Água</h3>
            <Input
              type="number"
              value={waterValue}
              onChange={handleWaterChange}
              placeholder="Digite a quantidade de água"
              className="mb-3"
            />
          </div>
        )}

        {/* Botão Enviar como no protótipo */}
        <Button 
          onClick={handleSubmitAll}
          className="w-full py-3 bg-[#8BC53F] hover:bg-[#7AB22F] text-white font-medium rounded-md mt-4"
        >
          <Send className="mr-2 h-4 w-4" /> Enviar
        </Button>
      </div>
      
      {selectedEgg && <EggCounter />}
    </div>
  );
};

export default Home;
