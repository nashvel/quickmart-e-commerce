import { NotificationButton } from './NotificationButton';
import { UserDropdown } from './UserDropdown';

export const UserActions = () => {
  return (
    <div className="flex items-center gap-4">
      <NotificationButton />
      <UserDropdown />
    </div>
  );
};
