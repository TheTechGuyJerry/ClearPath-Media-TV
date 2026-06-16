import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import CMSForm from '../../components/admin/CMSForm';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const { 
    adminUsers, 
    handleSaveItem, 
    handleDeleteItem, 
    refreshCollections,
    loading,
    effectiveRole,
    isSuperadmin
  } = useAdmin();

  const [editingItem, setEditingItem] = useState<any | null>(null);

  const handleCreateInit = () => {
    if (!isSuperadmin) {
      alert('Permission Denied: Only primary super administrators can add new operator credentials.');
      return;
    }
    setEditingItem({
      id: '',
      name: '',
      email: '',
      role: 'editor',
      status: 'active',
      disabled: false,
      createdAt: '',
      updatedAt: ''
    });
  };

  const handleEditInit = (user: any) => {
    if (!isSuperadmin) {
      alert('Permission Denied: Only super administrators can modify administrator records.');
      return;
    }
    setEditingItem({ ...user });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!isSuperadmin) {
      alert('Access Denied: Super-admin permissions required.');
      return;
    }
    if (!editingItem.name || !editingItem.email) {
      alert('Name and Email are required properties.');
      return;
    }

    const emailKey = editingItem.email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_');
    const dataToSave = { 
      ...editingItem, 
      id: emailKey
    };

    try {
      await handleSaveItem('users', dataToSave);
      alert('Administrator credentials updated successfully!');
      setEditingItem(null);
      await refreshCollections();
    } catch (err: any) {
      alert('Saving admin credentials failed: ' + err.message);
    }
  };

  const handleDelete = async (user: any) => {
    if (!isSuperadmin) {
      alert('Access Denied: Only super_admin can delete operator accounts.');
      return;
    }
    const isJerry = user.email?.toLowerCase() === 'jerryagbedun@gmail.com';
    if (isJerry) {
      alert('Safety limit: You cannot delete the founder account.');
      return;
    }

    const emailKey = user.email ? user.email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_') : '';
    if (confirm(`Are you sure you want to permanently remove administrator credentials for "${user.name}" (${user.email})?`)) {
      try {
        await handleDeleteItem('users', emailKey || user.id);
        alert('Credentials deleted successfully.');
        await refreshCollections();
      } catch (err: any) {
        alert('Deletion failed: ' + err.message);
      }
    }
  };

  const toggleDisableAdmin = async (user: any) => {
    if (!isSuperadmin) {
      alert('Access Denied: Super administrators only.');
      return;
    }
    const isJerry = user.email?.toLowerCase() === 'jerryagbedun@gmail.com';
    if (isJerry) {
      alert('Safety limit: You cannot disable the primary system administrator.');
      return;
    }

    const emailKey = user.email ? user.email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_') : '';
    const isDisabled = user.disabled === true || user.status === 'disabled';
    const nextStatus = isDisabled ? 'active' : 'disabled';

    if (confirm(`Are you sure you want to ${isDisabled ? 'activate' : 'disable'} ${user.name || 'this administrator'}?`)) {
      try {
        await updateDoc(doc(db, 'users', emailKey), { 
          status: nextStatus, 
          disabled: nextStatus === 'disabled',
          updatedAt: new Date().toISOString()
        });
        alert(`Account successfully ${isDisabled ? 'activated' : 'disabled'}!`);
        await refreshCollections();
      } catch (err: any) {
        alert('Failed to modify account status: ' + err.message);
      }
    }
  };

  if (editingItem) {
    return (
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center border-b pb-3 mb-6 bg-white p-6 border rounded-lg shadow-xs">
          <h3 className="font-bold text-primary font-display text-lg">{editingItem.id ? 'Edit' : 'Add New'} Operator</h3>
          <button 
            onClick={() => setEditingItem(null)} 
            className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black hover:bg-gray-100 px-3 py-1 bg-gray-50 border rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>

        <CMSForm
          type="users"
          data={editingItem}
          programmes={[]}
          explainers={[]}
          onChange={(updated) => setEditingItem(updated)}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
          uploadProgress={null}
          onFileChange={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center bg-white p-6 border rounded-lg shadow-xs flex-wrap md:flex-nowrap gap-4">
        <div>
          <span className="text-xs uppercase text-primary font-bold font-mono tracking-wider bg-secondary px-2.5 py-0.5 rounded">Security Registry</span>
          <h1 className="font-display font-semibold text-2xl text-primary mt-1">CMS Administrators</h1>
          <p className="text-sm text-on-surface-variant">Configure operator priviliges, toggle accounts lockouts, and manage secure roles.</p>
        </div>
        {isSuperadmin ? (
          <button 
            onClick={handleCreateInit}
            className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Administrator
          </button>
        ) : (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs px-3 py-1.5 rounded font-mono shrink-0">SUPERADMIN ACCESS PRIVILEGES ONLY FOR CREATING</span>
        )}
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
            <tr>
              <th className="p-4">Admin Name</th>
              <th className="p-4">Registry Email</th>
              <th className="p-4">Access Role Privilege</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {adminUsers.map((a, i) => {
              const isJerry = a.email?.toLowerCase() === 'jerryagbedun@gmail.com';
              const isDisabled = a.disabled === true || a.status === 'disabled';

              return (
                <tr key={a.uid || a.email || i} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 text-left">
                    <p className="font-bold text-primary flex items-center gap-1.5">
                      {a.name || 'Staff Operator'}
                      {isJerry && <span className="text-[9px] bg-red-100 text-red-850 px-1.5 py-0.2 rounded font-bold uppercase shrink-0">FOUNDER</span>}
                    </p>
                  </td>
                  <td className="p-4 font-mono text-on-surface-variant text-left">{a.email}</td>
                  <td className="p-4 text-left">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide inline-block ${
                      a.role === 'super_admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                      a.role === 'editor' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {a.role || 'admin'}
                    </span>
                  </td>
                  <td className="p-4 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isDisabled ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                      <span className={`text-[11px] font-medium ${isDisabled ? 'text-red-700' : 'text-green-700'}`}>
                        {isDisabled ? 'Disabled' : 'Active'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2.5 items-center">
                      {!isJerry && isSuperadmin && (
                        <>
                          <button 
                            onClick={() => handleEditInit(a)}
                            className="text-sky-750 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded text-xs cursor-pointer"
                            title="Edit full settings"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => toggleDisableAdmin(a)}
                            className={`px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                              isDisabled 
                                ? 'bg-green-50 hover:bg-green-100 text-green-700' 
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                            }`}
                            title={isDisabled ? 'Activate account' : 'Lockout account'}
                          >
                            {isDisabled ? 'Enable' : 'Disable'}
                          </button>
                        </>
                      )}
                      {!isJerry && isSuperadmin && (
                        <button 
                          onClick={() => handleDelete(a)} 
                          className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                          title="Permanently remove permission Doc"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {adminUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-on-surface-variant italic">No operators found. Ensure Jerry's profile is loaded correctly during context initializing.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
