import React, { useState, useEffect } from 'react';
import LostFoundHeader from './LostItems/LostFoundHeader';
import LostFoundStats from './LostItems/LostFoundStats';
import LostFoundTable from './LostItems/tables/LostFoundTable';
import LostFoundModals from './LostItems/LostFoundModals';
import { LostFoundService } from '../service/api/api';
import '../assets/css/LostItemsDashboard.css';

const LostItemsDashboard = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [stats, setStats] = useState({ lost_count: 0, found_count: 0, pending_count: 0 });
  const [pickedItems, setPickedItems] = useState([]);
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

  const fetchRecentPickups = async () => {
    try {
      const recentPickups = await LostFoundService.getRecentPickups();
      setPickedItems(recentPickups);
      console.log('Fetched recent pickups:', recentPickups);
    } catch (error) {
      console.error('Error fetching recent pickups:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? { search: searchTerm } : {};

      if (activeTab === 'lost') {
        const lostItemsData = await LostFoundService.getLostItems(params);
        setLostItems(lostItemsData);
      } else {
        const foundItemsData = await LostFoundService.getFoundItems(params);
        // Filter out claimed items from found items
        const unclaimedFoundItems = foundItemsData.filter(item => item.status !== 'claimed');
        setFoundItems(unclaimedFoundItems);
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
      const allMatches = await LostFoundService.getPotentialMatchesForLostItem();
      setPotentialMatches(allMatches);
      console.log("these are matches", allMatches);
    } catch (error) {
      console.error('Error fetching potential matches:', error);
    }
  };

  useEffect(() => {
    fetchData();
    if (activeTab === 'lost') {
      fetchPotentialMatches();
    } else if (activeTab === 'picked') {
      fetchRecentPickups();
    }
  }, [activeTab, searchTerm]);

  useEffect(() => {
    if (activeTab === 'lost') {
      fetchPotentialMatches();
    }
  }, [activeTab]);

const handleAddLostItem = async () => {
  await fetchData();
};

const handleAddFoundItem = async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const createdItem = await LostFoundService.createFoundItem(formData, config);
    setFoundItems([...foundItems, createdItem]);
    setShowAddFoundModal(false);
    fetchData();
  } catch (error) {
    console.error('Error creating found item:', error);
    // Handle error appropriately
  }
};

  const markAsFound = async (id) => {
    try {
      await LostFoundService.markAsFound(id);
      fetchData();
      if (activeTab === 'lost') {
        fetchPotentialMatches();
      }
    } catch (error) {
      console.error('Error marking item as found:', error);
    }
  };

  const markAsPicked = async (id) => {
    try {
      await LostFoundService.pickFoundItem(id, pickedBy);
      setShowDetailsModal(false);
      setPickedBy({ memberId: '', name: '', phone: '' });
      setSelectedItem(null);
      fetchData();
      fetchRecentPickups();
    } catch (error) {
      console.error('Error picking item:', error);
    }
  };

  const handlePick = async () => {
    if (selectedItem) {
      await markAsPicked(selectedItem.id);
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
        item.reporter_member_id?.toLowerCase()?.includes(search)
      )
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
        item.finder_name?.toLowerCase()?.includes(search)
    
      )  );
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
  lostItems={{ cards: stats.lost_cards_count || 0, items: stats.lost_items_count || 0 }}
  foundItems={{ cards: stats.found_cards_count || 0, items: stats.found_items_count || 0 }}
  pendingItems={stats.pending_count}
  showMatches={showMatches}
  setShowMatches={setShowMatches}
  fetchPotentialMatches={fetchPotentialMatches}
  onLostSubmit={handleAddLostItem}
  onFoundSubmit={handleAddFoundItem}
/>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <LostFoundTable
          activeTab={activeTab}
          filteredPickedItems={pickedItems}
          filteredLostItems={filteredLostItems}
          filteredFoundItems={filteredFoundItems}
          markAsFound={markAsFound}
          markAsPicked={markAsPicked}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          potentialMatches={potentialMatches}
          showMatches={showMatches}
          setShowMatches={setShowMatches}
          fetchPotentialMatches={fetchPotentialMatches}
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

  // ✅ Pass refreshers properly
  onLostSubmit={async () => {
    await fetchData();      // refresh after lost submit
    setShowAddLostModal(false); // close modal
  }}
  onFoundSubmit={async () => {
    await fetchData();      // refresh after found submit
    setShowAddFoundModal(false);
  }}

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