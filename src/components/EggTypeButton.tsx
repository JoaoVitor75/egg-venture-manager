
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
      className={`w-full py-3 px-4 rounded-md text-center font-medium relative shadow-sm border ${
        isSelected 
          ? 'bg-[#8BC53F] text-white border-[#8BC53F]' 
          : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-200'
      }`}
    >
      <span className="text-base">{egg.name}</span>
      {egg.count > 0 && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#8BC53F] text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {egg.count}
        </span>
      )}
    </button>
  );
};

export default EggTypeButton;
