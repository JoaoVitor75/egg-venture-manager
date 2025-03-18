
import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useEggContext } from '@/contexts/EggContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const AviarySelector = () => {
  const { selectedBatch, selectedAviary, setSelectedAviary } = useEggContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAviaryName, setNewAviaryName] = useState('');
  const [newAviaryValue, setNewAviaryValue] = useState('30');
  const { addAviary } = useEggContext();
  const { toast } = useToast();

  if (!selectedBatch || !selectedAviary) return null;

  const handleAviarySelect = (aviaryId: string) => {
    const aviary = selectedBatch.aviaries.find(a => a.id === aviaryId);
    if (aviary) {
      setSelectedAviary(aviary);
    }
    setIsOpen(false);
  };

  const handleAddAviary = () => {
    if (!newAviaryName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do aviário não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    const value = parseInt(newAviaryValue);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Erro",
        description: "Valor da bandeja deve ser um número positivo",
        variant: "destructive"
      });
      return;
    }

    const newId = `${Date.now()}`;
    addAviary(selectedBatch.id, {
      id: newId,
      name: newAviaryName,
      trayValue: value
    });

    setNewAviaryName('');
    setNewAviaryValue('30');
    setIsAddDialogOpen(false);
    
    toast({
      title: "Aviário adicionado",
      description: `${newAviaryName} foi adicionado com sucesso`
    });
  };

  return (
    <div className="mb-4 relative">
      <div className="flex flex-col">
        <span className="text-center mb-1 text-gray-500 text-sm">Aviário</span>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md flex items-center justify-between shadow-sm"
          >
            <span>{selectedAviary.name}</span>
            <ChevronDown size={16} />
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {selectedBatch.aviaries.map(aviary => (
                <button
                  key={aviary.id}
                  onClick={() => handleAviarySelect(aviary.id)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                    aviary.id === selectedAviary.id ? 'bg-egg-green/10 text-egg-green-dark font-medium' : ''
                  }`}
                >
                  {aviary.name}
                </button>
              ))}
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <button className="w-full text-left px-4 py-2 text-egg-green-dark font-medium hover:bg-gray-50 flex items-center">
                    <Plus size={16} className="mr-2" /> Adicionar aviário
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Aviário</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="aviary-name" className="text-sm font-medium">
                        Nome do Aviário
                      </label>
                      <Input
                        id="aviary-name"
                        value={newAviaryName}
                        onChange={(e) => setNewAviaryName(e.target.value)}
                        placeholder="Ex: Aviário 4"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="tray-value" className="text-sm font-medium">
                        Valor da Bandeja (ovos)
                      </label>
                      <Input
                        id="tray-value"
                        type="number"
                        value={newAviaryValue}
                        onChange={(e) => setNewAviaryValue(e.target.value)}
                        placeholder="Ex: 30"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddAviary} className="bg-egg-green hover:bg-egg-green-dark">
                      Adicionar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AviarySelector;
