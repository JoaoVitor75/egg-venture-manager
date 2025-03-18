
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEggContext } from '@/contexts/EggContext';

interface HeaderProps {
  title: string;
  showSettings?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showSettings = true }) => {
  const { selectedBatch } = useEggContext();

  return (
    <header className="header-gradient w-full p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-egg-yellow rounded-full flex items-center justify-center shadow-sm">
          <span className="text-egg-brown-dark font-bold">🥚</span>
        </div>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {selectedBatch && (
          <span className="text-white/90 text-sm font-medium bg-black/20 px-2 py-1 rounded-full">
            {selectedBatch.name}
          </span>
        )}
        {showSettings && (
          <Link to="/settings" className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <Settings size={20} className="text-white" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
