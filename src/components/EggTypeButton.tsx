
import { useEggContext } from '@/contexts/EggContext';
import { EggType } from '@/types';

interface EggTypeButtonProps {
  egg: EggType;
}

const EggTypeButton: React.FC<EggTypeButtonProps> = ({ egg }) => {
  const { setSelectedEgg, selectedEgg } = useEggContext();
  
  const isSelected = selectedEgg?.id === egg.id;
  
  const handleClick = () => {
    setSelectedEgg(egg);
  };
  
  return (
    <button 
      onClick={handleClick}
      className={`w-full py-3 px-4 rounded-xl text-left font-medium relative shadow-sm ${
        isSelected 
          ? 'bg-egg-green text-white' 
          : 'bg-white text-gray-800 hover:bg-gray-50'
      }`}
    >
      <span className="text-lg">{egg.name}</span>
      {egg.count > 0 && (
        <span className="absolute right-3 bg-white text-egg-green-dark text-xs font-bold px-2 py-0.5 rounded-full">
          {egg.count}
        </span>
      )}
    </button>
  );
};

export default EggTypeButton;
