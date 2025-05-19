import React, { useState, useEffect } from 'react';
import LostFoundHeader from './LostItems/LostFoundHeader';
import LostFoundStats from './LostItems/LostFoundStats';
import LostFoundTable from './LostItems/LostFoundTable';
import LostFoundModals from './LostItems/LostFoundModals';
import { LostFoundService } from '../service/api/api';
import '../assets/css/LostItemsDashboard.css';

const LostItemsDashboard = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [stats, setStats] = useState({ lost_count: 0, found_count: 0, pending_count: 0 });

  const [showAddLostModal, setShowAddLostModal] = useState(false);
  const [showAddFoundModal, setShowAddFoundModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMatchesModal, setShowMatchesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pickedBy, setPickedBy] = useState({ memberId: '', name: '', phone: '' });
  const [showPickupForm, setShowPickupForm] = useState(false);
  const [showMatches, setShowMatches] = useState(false);

  const [newLostItem, setNewLostItem] = useState({
    type: 'card',
    card_last_four: '',
    item_name: '',
    description: '',
    place_lost: '',
    reporter_member_id: '',
    reporter_phone: '',
    owner_name: ''
  });

  const [newFoundItem, setNewFoundItem] = useState({
    type: 'card',
    card_last_four: '',
    item_name: '',
    description: '',
    place_found: '',
    finder_name: '',
    finder_phone: '',
    owner_name: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('lost');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab, searchTerm]);

  // 👇 Fetch matches when tab is 'lost'
  useEffect(() => {
    if (activeTab === 'lost') {
      fetchPotentialMatches();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? { search: searchTerm } : {};

      if (activeTab === 'lost') {
        const lostItemsData = await LostFoundService.getLostItems(params);
        setLostItems(lostItemsData);
      } else {
        const foundItemsData = await LostFoundService.getFoundItems(params);
        setFoundItems(foundItemsData);
      }

      const statsData = await LostFoundService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPotentialMatches = async () => {
    try {
      const allMatches = await LostFoundService.getPotentialMatchesForLostItem(); // marches endpoiont 
      setPotentialMatches(allMatches);
      console.log("this are marches", allMatches)
    } catch (error) {
      console.error('Error fetching potential matches:', error);
    }
  };

 

  const handleAddLostItem = async () => {
    try {
      const createdItem = await LostFoundService.createLostItem({
        ...newLostItem,
        status: 'pending'
      });
      setLostItems([...lostItems, createdItem]);
      setShowAddLostModal(false);
      setNewLostItem({
        type: 'card',
        card_last_four: '',
        item_name: '',
        description: '',
        place_lost: '',
        reporter_member_id: '',
        reporter_phone: '',
        owner_name: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating lost item:', error);
    }
  };

  const handleAddFoundItem = async () => {
    try {
      const createdItem = await LostFoundService.createFoundItem({
        ...newFoundItem,
        status: 'found'
      });
      setFoundItems([...foundItems, createdItem]);
      setShowAddFoundModal(false);
      setNewFoundItem({
        type: 'card',
        card_last_four: '',
        item_name: '',
        description: '',
        place_found: '',
        finder_name: '',
        finder_phone: '',
        owner_name: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating found item:', error);
    }
  };

  const markAsFound = async (id) => {
    try {
      await LostFoundService.markAsFound(id);
      fetchData();
    } catch (error) {
      console.error('Error marking item as found:', error);
    }
  };

  const handlePick = async () => {
    if (selectedItem) {
      try {
        await LostFoundService.pickFoundItem(selectedItem.id, pickedBy);
        setShowDetailsModal(false);
        setPickedBy({ memberId: '', name: '', phone: '' });
        setSelectedItem(null);
        fetchData();
      } catch (error) {
        console.error('Error picking item:', error);
      }
    }
  };

  const filteredLostItems = lostItems.filter(item => {
    const search = searchTerm.toLowerCase();
    return (
      ((item.type === 'card' && item.card_last_four?.toLowerCase()?.includes(search)) ||
        (item.type === 'item' && (
          item.item_name?.toLowerCase()?.includes(search) ||
          item.description?.toLowerCase()?.includes(search) ||
          item.place_lost?.toLowerCase()?.includes(search)
        )) ||
        item.owner_name?.toLowerCase()?.includes(search) ||
        item.reporter_member_id?.toLowerCase()?.includes(search))
    );
  });

  const filteredFoundItems = foundItems.filter(item => {
    const search = searchTerm.toLowerCase();
    return (
      ((item.type === 'card' && item.card_last_four?.toLowerCase()?.includes(search)) ||
        (item.type === 'item' && (
          item.item_name?.toLowerCase()?.includes(search) ||
          item.description?.toLowerCase()?.includes(search) ||
          item.place_found?.toLowerCase()?.includes(search)
        )) ||
        item.owner_name?.toLowerCase()?.includes(search) ||
        item.finder_name?.toLowerCase()?.includes(search))
    );
  });

  return (
    <div className="lost-items-dashboard">
      <LostFoundHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
      />

      <LostFoundStats
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lostItems={stats.lost_count}
        pendingItems={stats.pending_count}
        setShowAddLostModal={setShowAddLostModal}
        setShowAddFoundModal={setShowAddFoundModal}
        showMatches={showMatches}
        setShowMatches={setShowMatches}
        fetchPotentialMatches={fetchPotentialMatches}
      />

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
    <LostFoundTable
    activeTab={activeTab}
    filteredLostItems={filteredLostItems}
    filteredFoundItems={filteredFoundItems}
    markAsFound={markAsFound}
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
    potentialMatches={potentialMatches}
    showMatches={showMatches}
    setShowMatches={setShowMatches}
    onViewDetails={(item) => {
      setSelectedItem(item);
      setShowDetailsModal(true);
    }}
    />

      )}

      <LostFoundModals
        showAddLostModal={showAddLostModal}
        setShowAddLostModal={setShowAddLostModal}
        showAddFoundModal={showAddFoundModal}
        setShowAddFoundModal={setShowAddFoundModal}
        newLostItem={newLostItem}
        setNewLostItem={setNewLostItem}
        newFoundItem={newFoundItem}
        setNewFoundItem={setNewFoundItem}
        handleAddLostItem={handleAddLostItem}
        handleAddFoundItem={handleAddFoundItem}
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedItem={selectedItem}
        pickedBy={pickedBy}
        setPickedBy={setPickedBy}
        handlePick={handlePick}
        showPickupForm={showPickupForm}
        setShowPickupForm={setShowPickupForm}
        showMatchesModal={showMatchesModal}
        setShowMatchesModal={setShowMatchesModal}
        potentialMatches={potentialMatches}
      />
    </div>
  );
};

export default LostItemsDashboard;
