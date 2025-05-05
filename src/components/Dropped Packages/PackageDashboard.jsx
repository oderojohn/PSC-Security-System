import React, { useState } from 'react';
import PackageHeader from './PackageHeader';
import PackageStats from './PackageStats';
import PackageTable from './PackageTable';
import PackageModals from './PackageModals';

const PackageDashboard = () => {
  const [droppedPackages, setDroppedPackages] = useState([
    { id: 1, type: 'package', description: 'Red box with books', recipientName: 'John Doe', recipientPhone: '0712345678', droppedBy: 'Staff A', dropperPhone: '0754434208', date: '2024-05-20 10:30', status: 'pending' },
    { id: 2, type: 'document', description: 'Legal documents in envelope', recipientName: 'Jane Smith', recipientPhone: '0723456789', droppedBy: 'Staff B', dropperPhone: '0754434208', date: '2024-05-19 14:15', status: 'pending' },
  ]);

  const [pickedPackages, setPickedPackages] = useState([
    { id: 3, type: 'package', description: 'Blue suitcase', recipientName: 'Mike Johnson', recipientPhone: '0734567890', pickedBy: 'Alice Brown', pickerPhone: '0754434208', date: '2024-05-18 16:45', status: 'picked' },
    { id: 4, type: 'document', description: 'Passport', recipientName: 'Sarah Wilson', recipientPhone: '0745678901', pickedBy: 'Bob Green', pickerPhone: '0754434208', date: '2024-05-17 11:20', status: 'picked' },
  ]);

  const [showDropModal, setShowDropModal] = useState(false);
  const [showPickModal, setShowPickModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [pickedBy, setPickedBy] = useState({ memberId: '', name: '', phone: '' });
  
  const [newDroppedPackage, setNewDroppedPackage] = useState({
    type: 'package',
    description: '',
    recipientName: '',
    recipientPhone: '',
    droppedBy: '',
    dropperPhone: ''
  });

  const [newPickedPackage, setNewPickedPackage] = useState({
    searchTerm: '',
    pickerName: '',
    pickerPhone: '',
    recipientName: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('drop');

  const filteredDroppedPackages = droppedPackages.filter(pkg => {
    const search = searchTerm.toLowerCase();
    return (
      pkg.description.toLowerCase().includes(search) ||
      pkg.recipientName.toLowerCase().includes(search) ||
      pkg.droppedBy.toLowerCase().includes(search) ||
      pkg.recipientPhone.toLowerCase().includes(search)
    );
  });

  const filteredPickedPackages = pickedPackages.filter(pkg => {
    const search = searchTerm.toLowerCase();
    return (
      pkg.description.toLowerCase().includes(search) ||
      pkg.recipientName.toLowerCase().includes(search) ||
      pkg.pickedBy.toLowerCase().includes(search) ||
      pkg.recipientPhone.toLowerCase().includes(search)
    );
  });

  const handleDropPackage = () => {
    setDroppedPackages([...droppedPackages, { 
      ...newDroppedPackage, 
      id: Date.now(), 
      date: new Date().toLocaleString(), 
      status: 'pending' 
    }]);
    setShowDropModal(false);
    setNewDroppedPackage({
      type: 'package',
      description: '',
      recipientName: '',
      recipientPhone: '',
      droppedBy: '',
      dropperPhone: ''
    });
  };

  const handlePickPackage = () => {
    alert(`Package pickup request submitted by ${newPickedPackage.pickerName}`);
    setShowPickModal(false);
    setNewPickedPackage({
      searchTerm: '',
      pickerName: '',
      pickerPhone: '',
      recipientName: ''
    });
  };

  const markAsPicked = (id) => {
    const pkg = droppedPackages.find(pkg => pkg.id === id);
    if (pkg) {
      setDroppedPackages(droppedPackages.filter(pkg => pkg.id !== id));
      setPickedPackages([...pickedPackages, { 
        ...pkg, 
        pickedBy: 'Staff (manual entry)',
        pickerPhone: 'N/A',
        status: 'picked',
        date: new Date().toLocaleString()
      }]);
    }
  };

  const handlePick = () => {
    if (selectedPackage) {
      alert(`Package picked by: ${pickedBy.name} (${pickedBy.memberId})`);
      markAsPicked(selectedPackage.id);
      setShowDetailsModal(false);
      setPickedBy({ memberId: '', name: '', phone: '' });
      setSelectedPackage(null);
    }
  };

  return (
    <div className="lost-items-dashboard">
      <PackageHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
      />
      <PackageStats 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        droppedPackages={droppedPackages} 
        pickedPackages={pickedPackages} 
        setShowDropModal={setShowDropModal} 
        setShowPickModal={setShowPickModal} 
      />
      <PackageTable 
        activeTab={activeTab} 
        filteredDroppedPackages={filteredDroppedPackages} 
        filteredPickedPackages={filteredPickedPackages} 
        markAsPicked={markAsPicked} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onViewDetails={(pkg) => {
          setSelectedPackage(pkg);
          setShowDetailsModal(true);
        }}
      />
      <PackageModals 
        showDropModal={showDropModal}
        setShowDropModal={setShowDropModal}
        showPickModal={showPickModal}
        setShowPickModal={setShowPickModal}
        newDroppedPackage={newDroppedPackage}
        setNewDroppedPackage={setNewDroppedPackage}
        newPickedPackage={newPickedPackage}
        setNewPickedPackage={setNewPickedPackage}
        handleDropPackage={handleDropPackage}
        handlePickPackage={handlePickPackage}
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedPackage={selectedPackage}
        pickedBy={pickedBy}
        setPickedBy={setPickedBy}
        handlePick={handlePick}
      />
    </div>
  );
};

export default PackageDashboard;