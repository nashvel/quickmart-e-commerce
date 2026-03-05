import { UserRole } from '../types';
import { SearchBar } from './SearchBar';
import { QuickAccess } from './QuickAccess';
import { UserActions } from './UserActions';

interface HeaderProps {
  userRole: UserRole;
}

export const Header = ({ userRole }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-blue-200 h-24">
      <SearchBar />
      <QuickAccess userRole={userRole} />
      <UserActions />
    </header>
  );
};
