import Header from '@/components/Header';
import EggTypeButton from '@/components/EggTypeButton';
import EggCounter from '@/components/EggCounter';
import { useEggContext } from '@/contexts/EggContext';
import AviarySelector from '@/components/AviarySelector';
import TrayValueDisplay from '@/components/TrayValueDisplay';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Home = () => {
  const { 
    eggs, 
    selectedEgg, 
    setSelectedEgg, 
    submitAllCollections, 
    loading, 
    selectedAviary 
  } = useEggContext();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Fechar o contador quando mudar de página
  useEffect(() => {
    return () => {
      setSelectedEgg(null);
    };
  }, [setSelectedEgg]);

  const handleSubmitAll = async () => {
    if (!selectedAviary) {
      toast({
        title: "Erro",
        description: "Selecione um aviário antes de enviar",
        variant: "destructive"
      });
      return;
    }

    const hasCollections = eggs.some(egg => egg.count > 0 || egg.trays > 0 || egg.units > 0);
    
    if (!hasCollections) {
      toast({
        title: "Aviso",
        description: "Nenhuma coleta foi registrada para enviar",
        variant: "destructive"
      });
      return;
    }

    try {
      await submitAllCollections();
      toast({
        title: "Sucesso!",
        description: "Todas as coletas foram enviadas com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao enviar coletas:', error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar as coletas. Tente novamente.",
        variant: "destructive"
      });
    }
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

        {/* Botão Enviar atualizado */}
        <Button 
          onClick={handleSubmitAll}
          disabled={loading}
          className="w-full py-3 bg-[#8BC53F] hover:bg-[#7AB22F] text-white font-medium rounded-md mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </>
          )}
        </Button>
      </div>
      
      {selectedEgg && <EggCounter />}
    </div>
  );
};

export default Home;
