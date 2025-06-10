import React, { useState } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { useEggContext } from '@/contexts/EggContext';
import { Button } from '@/components/ui/button';

const AviarySelector = () => {
  const { 
    batches, 
    selectedBatch, 
    selectedAviary, 
    setSelectedBatch, 
    setSelectedAviary, 
    loadAviariesFromAPI,
    loading 
  } = useEggContext();
  
  const [isOpen, setIsOpen] = useState(false);

  const handleBatchChange = (batch: any) => {
    setSelectedBatch(batch);
    if (batch.aviaries.length > 0) {
      setSelectedAviary(batch.aviaries[0]);
    } else {
      setSelectedAviary(null);
    }
    setIsOpen(false);
  };

  const handleAviaryChange = (aviary: any) => {
    setSelectedAviary(aviary);
    setIsOpen(false);
  };

  const handleRefresh = async () => {
    try {
      await loadAviariesFromAPI();
    } catch (error) {
      console.error('Erro ao atualizar aviários:', error);
    }
  };

  return (
    <div className="relative">
      {/* Botão principal compacto */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-egg-green focus:border-transparent transition-colors min-w-[200px]"
        >
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-500">
              {selectedBatch?.name || 'Selecione o lote'}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {selectedAviary?.name || 'Nenhum aviário'}
            </span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="p-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Dropdown expandido */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {batches.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>Nenhum lote encontrado</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="mt-2"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Carregar aviários
              </Button>
            </div>
          ) : (
            batches.map((batch) => (
              <div key={batch.id} className="border-b border-gray-100 last:border-b-0">
                {/* Header do lote */}
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900 text-sm">{batch.name}</h3>
                  <p className="text-xs text-gray-500">
                    {batch.aviaries.length} aviário{batch.aviaries.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                {/* Lista de aviários */}
                <div className="max-h-40 overflow-y-auto">
                  {batch.aviaries.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Nenhum aviário neste lote
                    </div>
                  ) : (
                    batch.aviaries.map((aviary) => (
                      <button
                        key={aviary.id}
                        onClick={() => {
                          handleBatchChange(batch);
                          handleAviaryChange(aviary);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          selectedAviary?.id === aviary.id && selectedBatch?.id === batch.id
                            ? 'bg-egg-green/10 border-r-2 border-egg-green'
                            : ''
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 text-sm">
                            {aviary.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ID: {aviary.id}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Overlay para fechar o dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AviarySelector;
