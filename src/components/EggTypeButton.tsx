
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
      className={isSelected ? 'egg-button-selected' : 'egg-button'}
    >
      {egg.name}
      {egg.count > 0 && (
        <span className="absolute right-3 bg-white text-egg-green-dark text-xs font-bold px-2 py-0.5 rounded-full">
          {egg.count}
        </span>
      )}
    </button>
  );
};

export default EggTypeButton;
