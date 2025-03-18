
import Header from '@/components/Header';
import EggTypeButton from '@/components/EggTypeButton';
import EggCounter from '@/components/EggCounter';
import { useEggContext } from '@/contexts/EggContext';
import AviarySelector from '@/components/AviarySelector';
import TrayValueDisplay from '@/components/TrayValueDisplay';
import { useEffect } from 'react';

const Home = () => {
  const { eggs, selectedEgg, setSelectedEgg } = useEggContext();

  // Fechar o contador quando mudar de página
  useEffect(() => {
    return () => {
      setSelectedEgg(null);
    };
  }, [setSelectedEgg]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Tonhão" />
      
      <div className="container mx-auto p-4 flex-1">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <AviarySelector />
          <TrayValueDisplay />
        </div>
        
        <div className="grid gap-3 pb-6">
          {eggs.map(egg => (
            <EggTypeButton key={egg.id} egg={egg} />
          ))}
        </div>
      </div>
      
      {selectedEgg && <EggCounterWithSubmit />}
    </div>
  );
};

const EggCounterWithSubmit = () => {
  const { selectedEgg, updateEggCount, clearSelectedEggData, setSelectedEgg } = useEggContext();
  
  if (!selectedEgg) return null;
  
  const handleSubmit = () => {
    // Atualiza os dados
    updateEggCount(selectedEgg.id, selectedEgg.trays, selectedEgg.units);
    
    // Limpa os campos
    clearSelectedEggData();
    
    // Fecha o contador
    setSelectedEgg(null);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full bg-white rounded-t-xl p-4 space-y-4">
        <EggCounter />
        
        <button 
          onClick={handleSubmit}
          className="w-full py-3 bg-egg-green text-white font-medium rounded-lg shadow-sm"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default Home;
