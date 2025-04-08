
import Header from '@/components/Header';
import EggTypeButton from '@/components/EggTypeButton';
import EggCounter from '@/components/EggCounter';
import { useEggContext } from '@/contexts/EggContext';
import AviarySelector from '@/components/AviarySelector';
import TrayValueDisplay from '@/components/TrayValueDisplay';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Home = () => {
  const { eggs, selectedEgg, setSelectedEgg, clearAllEggCounts } = useEggContext();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Fechar o contador quando mudar de página
  useEffect(() => {
    return () => {
      setSelectedEgg(null);
    };
  }, [setSelectedEgg]);

  const handleSubmitAll = () => {
    // Aqui você enviaria todos os dados para o servidor
    toast({
      title: "Dados enviados",
      description: "Todas as informações foram enviadas com sucesso!",
    });
    
    // Limpar todos os contadores após enviar
    clearAllEggCounts();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Tonhão" />
      
      <div className={`container mx-auto p-4 flex-1 flex flex-col ${isMobile ? 'max-w-md' : ''}`}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <AviarySelector />
          <TrayValueDisplay />
        </div>
        
        <div className="grid gap-3 mb-4 flex-1">
          {eggs.map(egg => (
            <EggTypeButton key={egg.id} egg={egg} />
          ))}
        </div>

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
