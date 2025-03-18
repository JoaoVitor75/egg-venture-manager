
import Header from '@/components/Header';
import { useEggContext } from '@/contexts/EggContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Check, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Aviary, Batch } from '@/types';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { 
    batches, 
    selectedBatch, 
    setSelectedBatch, 
    addBatch, 
    updateBatch, 
    deleteBatch, 
    selectedAviary, 
    setSelectedAviary,
    updateAviary,
    deleteAviary
  } = useEggContext();
  const [isAddBatchDialogOpen, setIsAddBatchDialogOpen] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');
  const [isEditBatchDialogOpen, setIsEditBatchDialogOpen] = useState(false);
  const [editBatchName, setEditBatchName] = useState('');
  const [editBatchId, setEditBatchId] = useState<string | null>(null);
  const [isEditAviaryDialogOpen, setIsEditAviaryDialogOpen] = useState(false);
  const [editAviaryName, setEditAviaryName] = useState('');
  const [editAviaryValue, setEditAviaryValue] = useState('');
  const [editAviaryId, setEditAviaryId] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState('batches');
  const { toast } = useToast();

  const handleAddBatch = () => {
    if (!newBatchName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do lote não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    const newId = `${Date.now()}`;
    const newBatch: Batch = {
      id: newId,
      name: newBatchName,
      active: false,
      aviaries: [{ id: '1', name: 'Aviário 1', trayValue: 30 }]
    };

    addBatch(newBatch);
    setNewBatchName('');
    setIsAddBatchDialogOpen(false);
    
    toast({
      title: "Lote adicionado",
      description: `${newBatchName} foi adicionado com sucesso`
    });
  };

  const handleEditBatch = (batch: Batch) => {
    setEditBatchId(batch.id);
    setEditBatchName(batch.name);
    setIsEditBatchDialogOpen(true);
  };

  const handleSaveEditBatch = () => {
    if (!editBatchId) return;
    if (!editBatchName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do lote não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    const batchToUpdate = batches.find(b => b.id === editBatchId);
    if (batchToUpdate) {
      updateBatch({
        ...batchToUpdate,
        name: editBatchName
      });
      
      toast({
        title: "Lote atualizado",
        description: `Lote atualizado para ${editBatchName}`
      });
    }
    
    setIsEditBatchDialogOpen(false);
  };

  const handleSetActiveBatch = (batch: Batch) => {
    // Update all batches to inactive
    batches.forEach(b => {
      if (b.active) {
        updateBatch({ ...b, active: false });
      }
    });
    
    // Set selected batch to active
    updateBatch({ ...batch, active: true });
    setSelectedBatch(batch);
    setSelectedAviary(batch.aviaries.length > 0 ? batch.aviaries[0] : null);
    
    toast({
      title: "Lote ativado",
      description: `${batch.name} foi ativado com sucesso`
    });
  };

  const handleDeleteBatch = (batchId: string) => {
    if (batches.length <= 1) {
      toast({
        title: "Erro",
        description: "Não é possível excluir todos os lotes",
        variant: "destructive"
      });
      return;
    }
    
    deleteBatch(batchId);
    toast({
      title: "Lote excluído",
      description: "Lote foi excluído com sucesso"
    });
  };

  const handleEditAviary = (aviary: Aviary) => {
    setEditAviaryId(aviary.id);
    setEditAviaryName(aviary.name);
    setEditAviaryValue(String(aviary.trayValue));
    setIsEditAviaryDialogOpen(true);
  };

  const handleSaveEditAviary = () => {
    if (!editAviaryId || !selectedBatch) return;
    if (!editAviaryName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do aviário não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    const value = parseInt(editAviaryValue);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Erro",
        description: "Valor da bandeja deve ser um número positivo",
        variant: "destructive"
      });
      return;
    }

    const aviaryToUpdate = selectedBatch.aviaries.find(a => a.id === editAviaryId);
    if (aviaryToUpdate) {
      updateAviary(selectedBatch.id, {
        ...aviaryToUpdate,
        name: editAviaryName,
        trayValue: value
      });
      
      toast({
        title: "Aviário atualizado",
        description: `${editAviaryName} foi atualizado com sucesso`
      });
    }
    
    setIsEditAviaryDialogOpen(false);
  };

  const handleDeleteAviary = (aviaryId: string) => {
    if (!selectedBatch) return;
    if (selectedBatch.aviaries.length <= 1) {
      toast({
        title: "Erro",
        description: "Não é possível excluir todos os aviários",
        variant: "destructive"
      });
      return;
    }
    
    deleteAviary(selectedBatch.id, aviaryId);
    toast({
      title: "Aviário excluído",
      description: "Aviário foi excluído com sucesso"
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Configurações" showSettings={false} />
      
      <div className="container mx-auto p-4 flex-1">
        <Tabs defaultValue="batches" className="w-full" value={tabValue} onValueChange={setTabValue}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="batches">Lotes</TabsTrigger>
            <TabsTrigger value="aviaries">Aviários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="batches" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Gerenciar Lotes</h2>
              <Dialog open={isAddBatchDialogOpen} onOpenChange={setIsAddBatchDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-egg-green hover:bg-egg-green-dark">
                    <Plus className="mr-2 h-4 w-4" /> Novo Lote
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Lote</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="grid gap-2">
                      <label htmlFor="batch-name" className="text-sm font-medium">
                        Nome do Lote
                      </label>
                      <Input
                        id="batch-name"
                        value={newBatchName}
                        onChange={(e) => setNewBatchName(e.target.value)}
                        placeholder="Ex: Lote 3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setIsAddBatchDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddBatch} className="bg-egg-green hover:bg-egg-green-dark">
                      Adicionar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-3">
              {batches.map(batch => (
                <div key={batch.id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex flex-col">
                      <span className="font-medium">{batch.name}</span>
                      <span className="text-sm text-gray-500">{batch.aviaries.length} aviários</span>
                    </div>
                    {batch.active && (
                      <span className="ml-3 bg-egg-green/20 text-egg-green-dark text-xs font-bold px-2 py-1 rounded-full">
                        Ativo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!batch.active && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-egg-green hover:text-egg-green hover:bg-egg-green/10 p-2 h-9 w-9"
                        onClick={() => handleSetActiveBatch(batch)}
                      >
                        <Check size={18} />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 h-9 w-9"
                      onClick={() => handleEditBatch(batch)}
                    >
                      <Edit2 size={18} />
                    </Button>
                    {!batch.active && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-egg-red hover:text-egg-red hover:bg-egg-red/10 p-2 h-9 w-9"
                        onClick={() => handleDeleteBatch(batch.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Dialog open={isEditBatchDialogOpen} onOpenChange={setIsEditBatchDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Lote</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-batch-name" className="text-sm font-medium">
                      Nome do Lote
                    </label>
                    <Input
                      id="edit-batch-name"
                      value={editBatchName}
                      onChange={(e) => setEditBatchName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsEditBatchDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEditBatch} className="bg-egg-green hover:bg-egg-green-dark">
                    Salvar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="aviaries" className="space-y-4">
            {!selectedBatch ? (
              <div className="text-center p-8">
                <p className="text-gray-500">Selecione um lote ativo para gerenciar aviários</p>
                <Button 
                  className="mt-4 bg-egg-green hover:bg-egg-green-dark"
                  onClick={() => setTabValue('batches')}
                >
                  Ir para Lotes
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Aviários de {selectedBatch.name}</h2>
                </div>
                
                <div className="space-y-3">
                  {selectedBatch.aviaries.map(aviary => (
                    <div key={aviary.id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-medium">{aviary.name}</span>
                        <span className="text-sm text-gray-500">{aviary.trayValue} ovos por bandeja</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 h-9 w-9"
                          onClick={() => handleEditAviary(aviary)}
                        >
                          <Edit2 size={18} />
                        </Button>
                        {selectedBatch.aviaries.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-egg-red hover:text-egg-red hover:bg-egg-red/10 p-2 h-9 w-9"
                            onClick={() => handleDeleteAviary(aviary.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <Dialog open={isEditAviaryDialogOpen} onOpenChange={setIsEditAviaryDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Aviário</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-aviary-name" className="text-sm font-medium">
                      Nome do Aviário
                    </label>
                    <Input
                      id="edit-aviary-name"
                      value={editAviaryName}
                      onChange={(e) => setEditAviaryName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-aviary-value" className="text-sm font-medium">
                      Valor da Bandeja (ovos)
                    </label>
                    <Input
                      id="edit-aviary-value"
                      type="number"
                      value={editAviaryValue}
                      onChange={(e) => setEditAviaryValue(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsEditAviaryDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEditAviary} className="bg-egg-green hover:bg-egg-green-dark">
                    Salvar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <Link to="/">
            <Button className="w-full bg-egg-green hover:bg-egg-green-dark">
              Voltar para Coleta
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
