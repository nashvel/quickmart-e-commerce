import { Search } from 'lucide-react';

export const SearchBar = () => {
  return (
    <div className="relative w-full max-w-xs">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="text-blue-500" size={18} />
      </div>
      <input 
        type="text" 
        placeholder="Search..." 
        className="w-full pl-10 pr-4 py-2.5 border border-blue-300 rounded-full bg-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition-colors"
      />
    </div>
  );
};
