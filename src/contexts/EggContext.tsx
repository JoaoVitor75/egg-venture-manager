import React, { createContext, useContext, useState, useEffect } from 'react';
import { EggType, Aviary, Batch, CollectionMode } from '@/types';

interface EggContextType {
  eggs: EggType[];
  batches: Batch[];
  selectedEgg: EggType | null;
  selectedBatch: Batch | null;
  selectedAviary: Aviary | null;
  collectionMode: CollectionMode;
  setSelectedEgg: (egg: EggType | null) => void;
  setSelectedBatch: (batch: Batch | null) => void;
  setSelectedAviary: (aviary: Aviary | null) => void;
  updateEggCount: (id: string, trays: number, units: number) => void;
  setCollectionMode: (mode: CollectionMode) => void;
  addBatch: (batch: Batch) => void;
  updateBatch: (batch: Batch) => void;
  deleteBatch: (id: string) => void;
  addAviary: (batchId: string, aviary: Aviary) => void;
  updateAviary: (batchId: string, aviary: Aviary) => void;
  deleteAviary: (batchId: string, aviaryId: string) => void;
  clearSelectedEggData: () => void;
}

const EggContext = createContext<EggContextType | undefined>(undefined);

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
  {
    id: '2',
    name: 'Lote 2',
    active: false,
    aviaries: [
      { id: '1', name: 'Aviário 1', trayValue: 30 },
    ],
  },
];

export const EggProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load data from localStorage
  const savedEggs = localStorage.getItem('eggs');
  const savedBatches = localStorage.getItem('batches');
  const savedSettings = localStorage.getItem('eggSettings');

  const [eggs, setEggs] = useState<EggType[]>(savedEggs ? JSON.parse(savedEggs) : defaultEggs);
  const [batches, setBatches] = useState<Batch[]>(savedBatches ? JSON.parse(savedBatches) : defaultBatches);
  const [selectedEgg, setSelectedEgg] = useState<EggType | null>(null);
  const [collectionMode, setCollectionMode] = useState<CollectionMode>('trays');
  
  // Find active batch
  const activeBatch = batches.find(batch => batch.active) || batches[0];
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(activeBatch || null);
  const [selectedAviary, setSelectedAviary] = useState<Aviary | null>(
    selectedBatch && selectedBatch.aviaries.length > 0 ? selectedBatch.aviaries[0] : null
  );

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('eggs', JSON.stringify(eggs));
  }, [eggs]);

  useEffect(() => {
    localStorage.setItem('batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('eggSettings', JSON.stringify({
      collectionMode,
      selectedBatchId: selectedBatch?.id,
      selectedAviaryId: selectedAviary?.id,
    }));
  }, [collectionMode, selectedBatch, selectedAviary]);

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
  };

  const clearSelectedEggData = () => {
    if (selectedEgg) {
      setSelectedEgg({ ...selectedEgg, trays: 0, units: 0 });
    }
  };

  const addBatch = (batch: Batch) => {
    setBatches(prev => [...prev, batch]);
  };

  const updateBatch = (updatedBatch: Batch) => {
    setBatches(prev => 
      prev.map(batch => batch.id === updatedBatch.id ? updatedBatch : batch)
    );

    // Update selected batch if it's the one being updated
    if (selectedBatch && selectedBatch.id === updatedBatch.id) {
      setSelectedBatch(updatedBatch);
      
      // Check if selected aviary still exists in updated batch
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
    
    // If deleted batch is selected, select another one
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

    // Update selected aviary if it's the one being updated
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

    // If deleted aviary is selected, select another one
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
      setSelectedEgg,
      setSelectedBatch,
      setSelectedAviary,
      updateEggCount,
      setCollectionMode,
      addBatch,
      updateBatch,
      deleteBatch,
      addAviary,
      updateAviary,
      deleteAviary,
      clearSelectedEggData,
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
