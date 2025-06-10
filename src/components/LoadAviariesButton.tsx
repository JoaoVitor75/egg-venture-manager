// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { useEggContext } from '@/contexts/EggContext';
// import { useToast } from '@/hooks/use-toast';
// import { Download, Loader2 } from 'lucide-react';

// const LoadAviariesButton: React.FC = () => {
//   const { loadAviariesFromAPI, loading } = useEggContext();
//   const { toast } = useToast();

//   const handleLoadAviaries = async () => {
//     try {
//       await loadAviariesFromAPI();
//       toast({
//         title: "Sucesso!",
//         description: "Aviários carregados da API com sucesso",
//       });
//     } catch (error) {
//       console.error('Erro ao carregar aviários:', error);
//       toast({
//         title: "Erro",
//         description: "Falha ao carregar aviários da API",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <Button 
//       onClick={handleLoadAviaries} 
//       disabled={loading}
//       className="bg-egg-green hover:bg-egg-green-dark"
//     >
//       {loading ? (
//         <>
//           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           Carregando...
//         </>
//       ) : (
//         <>
//           <Download className="mr-2 h-4 w-4" />
//           Carregar Aviários da API
//         </>
//       )}
//     </Button>
//   );
// };

// export default LoadAviariesButton;
