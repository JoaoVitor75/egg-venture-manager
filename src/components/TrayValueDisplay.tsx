
import { useEggContext } from '@/contexts/EggContext';
import { Plus, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const TrayValueDisplay = () => {
  const { selectedAviary, selectedBatch, updateAviary } = useEggContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trayValue, setTrayValue] = useState('');
  const { toast } = useToast();

  if (!selectedAviary || !selectedBatch) return null;

  const handleEditTrayValue = () => {
    setTrayValue(String(selectedAviary.trayValue));
    setIsDialogOpen(true);
  };

  const handleSaveTrayValue = () => {
    const value = parseInt(trayValue);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Erro",
        description: "Valor da bandeja deve ser um número positivo",
        variant: "destructive"
      });
      return;
    }

    updateAviary(selectedBatch.id, {
      ...selectedAviary,
      trayValue: value
    });

    setIsDialogOpen(false);
    toast({
      title: "Valor atualizado",
      description: `Valor da bandeja atualizado para ${value}`,
    });
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <span className="text-center mb-1 text-gray-500 text-sm">Valor da Bandeja</span>
      <div className="flex items-center justify-center gap-4">
        <div className="egg-counter text-lg">{selectedAviary.trayValue}</div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button 
              onClick={handleEditTrayValue}
              className="w-10 h-10 rounded-full bg-egg-green text-white flex items-center justify-center shadow-md"
            >
              <Edit2 size={16} />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Valor da Bandeja</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="grid gap-2">
                <label htmlFor="tray-value-edit" className="text-sm font-medium">
                  Quantidade de ovos por bandeja
                </label>
                <Input
                  id="tray-value-edit"
                  type="number"
                  value={trayValue}
                  onChange={(e) => setTrayValue(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveTrayValue} className="bg-egg-green hover:bg-egg-green-dark">
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TrayValueDisplay;
