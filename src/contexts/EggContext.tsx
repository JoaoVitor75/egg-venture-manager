import React, { createContext, useContext, useState, useEffect } from 'react';
import { EggType, Aviary, Batch, CollectionMode } from '@/types';
import { 
  aviaryService, 
  eggCollectService, 
  chickenCollectService, 
  waterService,
  AviaryDTO,
  CollectEggDataDTO,
  CollectChickenDTO,
  WaterDTO,
  EggType as ApiEggType,
  EggDetailDTO
} from '@/services/api';

interface EggContextType {
  eggs: EggType[];
  batches: Batch[];
  selectedEgg: EggType | null;
  selectedBatch: Batch | null;
  selectedAviary: Aviary | null;
  collectionMode: CollectionMode;
  loading: boolean;
  setSelectedEgg: (egg: EggType | null) => void;
  setSelectedBatch: (batch: Batch | null) => void;
  setSelectedAviary: (aviary: Aviary | null) => void;
  updateEggCount: (id: string, trays: number, units: number) => void;
  submitAllCollections: () => Promise<void>;
  setCollectionMode: (mode: CollectionMode) => void;
  addBatch: (batch: Batch) => void;
  updateBatch: (batch: Batch) => void;
  deleteBatch: (id: string) => void;
  addAviary: (batchId: string, aviary: Aviary) => void;
  updateAviary: (batchId: string, aviary: Aviary) => void;
  deleteAviary: (batchId: string, aviaryId: string) => void;
  clearSelectedEggData: () => void;
  clearAllEggCounts: () => void;
  loadAviariesFromAPI: () => Promise<void>;
}

const EggContext = createContext<EggContextType | undefined>(undefined);

// Mapeamento dos tipos de ovos do frontend para a API
const eggTypeMapping: Record<string, ApiEggType> = {
  '3': ApiEggType.CRACKED, // Ovos Trincados
  '4': ApiEggType._DIRTY, // Ovos Sujos de Ninho
  '5': ApiEggType.SMALL, // Ovos Pequenos
  '6': ApiEggType.CLEAN, // Ovos Incubáveis
  '7': ApiEggType.BROKEN, // Ovos Quebrados
  '8': ApiEggType.DOUBLE_YOLK, // Ovos Deformados
  '9': ApiEggType.THIN_SHELL, // Ovos Casca Fina
  '10': ApiEggType.BROKEN, // Eliminados
};

// Default data
const defaultEggs: EggType[] = [
  { id: '1', name: 'Aves Macho', count: 0, trays: 0, units: 0, useTrays: false },
  { id: '2', name: 'Aves Fêmea', count: 0, trays: 0, units: 0, useTrays: false },
  { id: '3', name: 'Ovos Trincados', count: 0, trays: 0, units: 0, useTrays: true },
  { id: '4', name: 'Ovos Sujos de Ninho', count: 0, trays: 0, units: 0, useTrays: true },
  { id: '5', name: 'Ovos Pequenos', count: 0, trays: 0, units: 0, useTrays: true },
  { id: '6', name: 'Ovos Incubáveis', count: 0, trays: 0, units: 0, useTrays: true },
  { id: '7', name: 'Ovos Quebrados', count: 0, trays: 0, units: 0, useTrays: true },
  { id: '8', name: 'Ovos Deformados', count: 0, trays: 0, units: 0, useTrays: true },
  { id: '9', name: 'Ovos Casca Fina', count: 0, trays: 0, units: 0, useTrays: true },
  { id: '10', name: 'Eliminados', count: 0, trays: 0, units: 0, useTrays: true },
  { id: '11', name: 'Água', count: 0, trays: 0, units: 0, useTrays: false },
];

const defaultBatches: Batch[] = [
  {
    id: '1',
    name: 'Lote 1',
    active: true,
    aviaries: [
      { id: '1', name: 'Aviário 1', trayValue: 30 },
      { id: '2', name: 'Aviário 2', trayValue: 30 },
      { id: '3', name: 'Aviário 3', trayValue: 30 },
    ],
  },
];

export const EggProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedEggs = localStorage.getItem('eggs');
  const savedBatches = localStorage.getItem('batches');

  const [eggs, setEggs] = useState<EggType[]>(savedEggs ? JSON.parse(savedEggs) : defaultEggs);
  const [batches, setBatches] = useState<Batch[]>(savedBatches ? JSON.parse(savedBatches) : defaultBatches);
  const [selectedEgg, setSelectedEgg] = useState<EggType | null>(null);
  const [collectionMode, setCollectionMode] = useState<CollectionMode>('trays');
  const [loading, setLoading] = useState(false);
  
  const activeBatch = batches.find(batch => batch.active) || batches[0];
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(activeBatch || null);
  const [selectedAviary, setSelectedAviary] = useState<Aviary | null>(
    selectedBatch && selectedBatch.aviaries.length > 0 ? selectedBatch.aviaries[0] : null
  );

  useEffect(() => {
    localStorage.setItem('eggs', JSON.stringify(eggs));
  }, [eggs]);

  useEffect(() => {
    localStorage.setItem('batches', JSON.stringify(batches));
  }, [batches]);

  // Função para carregar aviários da API
  const loadAviariesFromAPI = async () => {
    try {
      setLoading(true);
      console.log('Carregando aviários da API...');
      
      // Carregar todos os aviários
      const response = await aviaryService.listAll();
      console.log('Resposta da API:', response.data);
      
      const apiAviaries = Array.isArray(response.data) ? response.data : [];
      
      if (apiAviaries.length === 0) {
        console.warn('Nenhum aviário retornado da API');
        return;
      }

      // Agrupar aviários por lote (batchId)
      const batchesMap = new Map<number, AviaryDTO[]>();
      
      apiAviaries.forEach((aviary: AviaryDTO) => {
        if (!batchesMap.has(aviary.batchId)) {
          batchesMap.set(aviary.batchId, []);
        }
        batchesMap.get(aviary.batchId)!.push(aviary);
      });

      // Converter para o formato do frontend
      const newBatches: Batch[] = Array.from(batchesMap.entries()).map(([batchId, aviaries]) => ({
        id: batchId.toString(),
        name: `Lote ${batchId}`,
        active: batchId === Math.min(...Array.from(batchesMap.keys())), // Primeiro lote (menor ID) ativo
        aviaries: aviaries.map(aviary => ({
          id: aviary.id.toString(),
          name: aviary.name,
          trayValue: 30 // Valor padrão
        }))
      }));

      console.log('Lotes processados:', newBatches);

      setBatches(newBatches);
      localStorage.setItem('batches', JSON.stringify(newBatches));
      
      // Selecionar o primeiro lote e aviário se não houver seleção
      if (newBatches.length > 0) {
        if (!selectedBatch) {
          setSelectedBatch(newBatches[0]);
          if (newBatches[0].aviaries.length > 0) {
            setSelectedAviary(newBatches[0].aviaries[0]);
          }
        } else {
          // Atualizar o lote selecionado com os novos dados
          const updatedBatch = newBatches.find(b => b.id === selectedBatch.id);
          if (updatedBatch) {
            setSelectedBatch(updatedBatch);
            // Manter aviário selecionado se ainda existir
            if (selectedAviary && !updatedBatch.aviaries.some(a => a.id === selectedAviary.id)) {
              if (updatedBatch.aviaries.length > 0) {
                setSelectedAviary(updatedBatch.aviaries[0]);
              }
            }
          }
        }
      }
      
    } catch (error: any) {
      console.error('Erro ao carregar aviários da API:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar apenas localmente (usada no modal)
  const updateEggCount = (id: string, trays: number, units: number) => {
    setEggs(prevEggs =>
      prevEggs.map(egg => {
        if (egg.id === id) {
          const totalCount = egg.useTrays 
            ? (trays * (selectedAviary?.trayValue || 30)) + units 
            : units;
          return { ...egg, count: totalCount, trays, units };
        }
        return egg;
      })
    );
    console.log(`💾 Salvo localmente: ${eggs.find(e => e.id === id)?.name}, Bandejas: ${trays}, Unidades: ${units}`);
  };

  // Nova função para enviar tudo para a API
  const submitAllCollections = async () => {
    if (!selectedAviary) {
      throw new Error('Nenhum aviário selecionado');
    }

    try {
      setLoading(true);
      const aviaryId = parseInt(selectedAviary.id);
      const collectionsToSend = eggs.filter(egg => egg.count > 0 || egg.trays > 0 || egg.units > 0);

      console.log(`🚀 Enviando ${collectionsToSend.length} coletas para API...`);

      for (const egg of collectionsToSend) {
        console.log(`Enviando: ${egg.name}, Count: ${egg.count}, Trays: ${egg.trays}, Units: ${egg.units}`);

        if (egg.name === 'Aves Macho' || egg.name === 'Aves Fêmea') {
          // Coleta de mortalidade
          const chickenData: CollectChickenDTO = {
            aviaryId,
            deadRoosters: egg.name === 'Aves Macho' ? egg.units : 0,
            deadChickens: egg.name === 'Aves Fêmea' ? egg.units : 0,
            observation: ''
          };
          
          console.log('📤 Enviando mortalidade:', chickenData);
          await chickenCollectService.create(chickenData);
          
        } else if (egg.name === 'Água') {
          // Coleta de água
          const waterData: WaterDTO = {
            aviaryId,
            volume: egg.units
          };
          
          console.log('📤 Enviando água:', waterData);
          await waterService.create(waterData);
          
        } else {
          // Coleta de ovos
          const apiEggType = eggTypeMapping[egg.id];
          if (apiEggType) {
            const eggData: CollectEggDataDTO = {
              aviaryId,
              eggDetail: [{
                type: apiEggType,
                quantity: egg.count
              }]
            };
            
            console.log('📤 Enviando ovos:', eggData);
            await eggCollectService.create(eggData);
          }
        }
      }

      console.log('✅ Todas as coletas enviadas com sucesso!');
      
      // Limpar os dados após envio bem-sucedido
      clearAllEggCounts();

    } catch (error: any) {
      console.error('❌ Erro ao enviar coletas:', error);
      if (error.response) {
        console.error('Status do erro:', error.response.status);
        console.error('Dados do erro:', error.response.data);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedEggData = () => {
    if (selectedEgg) {
      setSelectedEgg({ ...selectedEgg, trays: 0, units: 0 });
    }
  };

  const clearAllEggCounts = () => {
    setEggs(prevEggs =>
      prevEggs.map(egg => ({
        ...egg,
        count: 0,
        trays: 0,
        units: 0
      }))
    );
  };

  const addBatch = (batch: Batch) => {
    setBatches(prev => [...prev, batch]);
  };

  const updateBatch = (updatedBatch: Batch) => {
    setBatches(prev => 
      prev.map(batch => batch.id === updatedBatch.id ? updatedBatch : batch)
    );

    if (selectedBatch && selectedBatch.id === updatedBatch.id) {
      setSelectedBatch(updatedBatch);
      
      if (selectedAviary) {
        const aviaryExists = updatedBatch.aviaries.some(a => a.id === selectedAviary.id);
        if (!aviaryExists && updatedBatch.aviaries.length > 0) {
          setSelectedAviary(updatedBatch.aviaries[0]);
        } else if (!aviaryExists) {
          setSelectedAviary(null);
        }
      }
    }
  };

  const deleteBatch = (id: string) => {
    setBatches(prev => prev.filter(batch => batch.id !== id));
    
    if (selectedBatch && selectedBatch.id === id) {
      const remainingBatches = batches.filter(batch => batch.id !== id);
      if (remainingBatches.length > 0) {
        setSelectedBatch(remainingBatches[0]);
        setSelectedAviary(remainingBatches[0].aviaries[0] || null);
      } else {
        setSelectedBatch(null);
        setSelectedAviary(null);
      }
    }
  };

    const addAviary = (batchId: string, aviary: Aviary) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id === batchId) {
          return {
            ...batch,
            aviaries: [...batch.aviaries, aviary]
          };
        }
        return batch;
      })
    );
  };

  const updateAviary = (batchId: string, updatedAviary: Aviary) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id === batchId) {
          return {
            ...batch,
            aviaries: batch.aviaries.map(aviary => 
              aviary.id === updatedAviary.id ? updatedAviary : aviary
            )
          };
        }
        return batch;
      })
    );

    if (selectedAviary && selectedAviary.id === updatedAviary.id) {
      setSelectedAviary(updatedAviary);
    }
  };

  const deleteAviary = (batchId: string, aviaryId: string) => {
    setBatches(prev => 
      prev.map(batch => {
        if (batch.id === batchId) {
          return {
            ...batch,
            aviaries: batch.aviaries.filter(aviary => aviary.id !== aviaryId)
          };
        }
        return batch;
      })
    );

    if (selectedAviary && selectedAviary.id === aviaryId) {
      const batch = batches.find(b => b.id === batchId);
      if (batch) {
        const remainingAviaries = batch.aviaries.filter(a => a.id !== aviaryId);
        if (remainingAviaries.length > 0) {
          setSelectedAviary(remainingAviaries[0]);
        } else {
          setSelectedAviary(null);
        }
      }
    }
  };

  return (
    <EggContext.Provider value={{
      eggs,
      batches,
      selectedEgg,
      selectedBatch,
      selectedAviary,
      collectionMode,
      loading,
      setSelectedEgg,
      setSelectedBatch,
      setSelectedAviary,
      updateEggCount,
      submitAllCollections,
      setCollectionMode,
      addBatch,
      updateBatch,
      deleteBatch,
      addAviary,
      updateAviary,
      deleteAviary,
      clearSelectedEggData,
      clearAllEggCounts,
      loadAviariesFromAPI,
    }}>
      {children}
    </EggContext.Provider>
  );
};

export const useEggContext = () => {
  const context = useContext(EggContext);
  if (context === undefined) {
    throw new Error('useEggContext must be used within an EggProvider');
  }
  return context;
};

