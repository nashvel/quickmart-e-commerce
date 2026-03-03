import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  CheckCircle, 
  UserX,
  X
} from 'lucide-react';
import { User } from '@/types';

interface Props {
  users: User[];
}

export default function AdminUsers({ users: initialUsers }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const getInitials = (firstName: string, lastName: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    return '?';
  };

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
    setActiveDropdown(null);
  };

  const handleBlacklist = (userId: number) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, is_verified: !u.is_verified, status: u.is_verified ? 'pending' : 'active' } : u
    ));
    setActiveDropdown(null);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout role="admin">
      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 bg-gray-50 min-h-screen">
        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h2>
              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    value={editingUser.first_name || ''} 
                    onChange={(e) => setEditingUser({...editingUser, first_name: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={editingUser.last_name || ''} 
                    onChange={(e) => setEditingUser({...editingUser, last_name: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={editingUser.email || ''} 
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                  <input 
                    type="text" 
                    placeholder="Phone" 
                    value={editingUser.phone || ''} 
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setEditingUser(null)} 
                    className="px-6 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="pt-4 sm:pt-6 lg:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-600">Manage and monitor all user accounts.</p>
            </div>
            <button className="mt-4 sm:mt-0 flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
              <Plus className="mr-2" size={18} />
              Add New User
            </button>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-300 shadow-sm"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="client">Clients</option>
              <option value="rider">Riders</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Joined
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {getInitials(user.first_name, user.last_name)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.status === 'pending' || !user.is_verified ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <UserX className="mr-1.5" size={14} />
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="mr-1.5" size={14} />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.created_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                          className="text-gray-500 hover:text-primary"
                        >
                          <MoreVertical size={20} />
                        </button>
                        {activeDropdown === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                              <a 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); handleEdit(user); }} 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Edit
                              </a>
                              <a 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); handleBlacklist(user.id); }} 
                                className={`block px-4 py-2 text-sm ${
                                  !user.is_verified ? 'text-green-600' : 'text-red-600'
                                } hover:bg-gray-100`}
                              >
                                {!user.is_verified ? 'Verify User' : 'Suspend User'}
                              </a>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">No users found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
