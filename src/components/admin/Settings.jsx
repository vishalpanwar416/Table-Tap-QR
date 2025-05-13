import React from 'react';
import { Settings } from 'lucide-react';

const SettingsManagement = () => {
return (
<div className="bg-white rounded-xl shadow-sm p-6">
<h2 className="text-xl font-semibold mb-4 text-gray-800">Settings</h2>
<div className="text-center py-12 text-gray-500">
<Settings className="w-12 h-12 mx-auto text-gray-400" />
<p className="mt-2">Settings management features coming soon</p>
</div>
</div>
);
};

export default SettingsManagement;