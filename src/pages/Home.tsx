
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
      
      {selectedEgg && <EggCounter />}
    </div>
  );
};

export default Home;
