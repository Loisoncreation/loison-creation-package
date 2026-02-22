import React, { useState, useEffect } from 'react';
import { Package, Clock, Mail, Users, TrendingUp, Plus, Edit2, Trash2, CheckCircle, AlertCircle, Wrench, Menu, X, LogOut, BarChart3, Calendar, CheckSquare, DollarSign, Download, User, Shield, TrendingDown, Target, Activity } from 'lucide-react';

const GestionMetalleriePro = () => {
  // Système de connexion
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(true);
  
  // États
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Données
  const [stocks, setStocks] = useState([]);
  const [chantiers, setChantiers] = useState([]);
  const [temps, setTemps] = useState([]);
  const [taches, setTaches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [difficultes, setDifficultes] = useState([]);
  
  // Modals
  const [showStockModal, setShowStockModal] = useState(false);
  const [showChantierModal, setShowChantierModal] = useState(false);
  const [showTempsModal, setShowTempsModal] = useState(false);
  const [showTacheModal, setShowTacheModal] = useState(false);
  const [showDifficulteModal, setShowDifficulteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const EMPLOYES = [
    { id: 1, nom: 'PATRON', role: 'patron', code: '0000', actif: true },
    { id: 2, nom: 'Jean Dupont', role: 'employe', code: '1234', actif: true },
    { id: 3, nom: 'Marie Martin', role: 'employe', code: '5678', actif: true },
    { id: 4, nom: 'Pierre Durand', role: 'employe', code: '9012', actif: true },
    { id: 5, nom: 'Sophie Dubois', role: 'employe', code: '3456', actif: true }
  ];

  // Chargement données
  useEffect(() => {
    if (userRole) loadAllData();
  }, [userRole]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const loadData = async (key, setter) => {
        try {
          const data = await window.storage.get(key);
          setter(data?.value ? JSON.parse(data.value) : []);
        } catch { setter([]); }
      };

      await Promise.all([
        loadData('loison-stocks', setStocks),
        loadData('loison-chantiers', setChantiers),
        loadData('loison-temps', setTemps),
        loadData('loison-taches', setTaches),
        loadData('loison-notifications', setNotifications),
        loadData('loison-difficultes', setDifficultes)
      ]);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
    setLoading(false);
  };

  const saveData = async (key, data) => {
    try {
      await window.storage.set(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  };

  const saveStocks = (data) => { setStocks(data); saveData('loison-stocks', data); };
  const saveChantiers = (data) => { setChantiers(data); saveData('loison-chantiers', data); };
  const saveTemps = (data) => { setTemps(data); saveData('loison-temps', data); };
  const saveTaches = (data) => { setTaches(data); saveData('loison-taches', data); };
  const saveNotifications = (data) => { setNotifications(data); saveData('loison-notifications', data); };
  const saveDifficultes = (data) => { setDifficultes(data); saveData('loison-difficultes', data); };

  const addNotification = (message, type = 'info') => {
    const newNotif = { id: Date.now(), message, type, date: new Date().toISOString(), lu: false };
    saveNotifications([newNotif, ...notifications]);
  };

  // Connexion
  const handleLogin = (code) => {
    const user = EMPLOYES.find(e => e.code === code && e.actif);
    if (user) {
      setCurrentUser(user);
      setUserRole(user.role);
      setShowLoginModal(false);
      addNotification(`${user.nom} connecté`, 'success');
    } else {
      alert('Code incorrect ! Utilisez 0000 (patron) ou 1234 (employé)');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setShowLoginModal(true);
    setActiveTab('dashboard');
  };

  // CRUD Operations
  const addOrUpdateStock = (item) => {
    if (editingItem) {
      const updated = stocks.map(s => s.id === editingItem.id ? { ...item, id: s.id } : s);
      saveStocks(updated);
    } else {
      saveStocks([...stocks, { ...item, id: Date.now() }]);
    }
    setShowStockModal(false);
    setEditingItem(null);
  };

  const deleteStock = (id) => {
    if (confirm('Supprimer ?')) saveStocks(stocks.filter(s => s.id !== id));
  };

  const addOrUpdateChantier = (chantier) => {
    if (editingItem) {
      const updated = chantiers.map(c => c.id === editingItem.id ? { ...chantier, id: c.id } : c);
      saveChantiers(updated);
    } else {
      saveChantiers([...chantiers, { ...chantier, id: Date.now(), createdBy: currentUser.nom }]);
    }
    setShowChantierModal(false);
    setEditingItem(null);
  };

  const deleteChantier = (id) => {
    if (confirm('Supprimer ?')) saveChantiers(chantiers.filter(c => c.id !== id));
  };

  const updateChantierStatus = (id, newStatus) => {
    const updated = chantiers.map(c => c.id === id ? { ...c, statut: newStatus, lastUpdate: new Date().toISOString() } : c);
    saveChantiers(updated);
  };

  const addTemps = (entry) => {
    saveTemps([...temps, { ...entry, id: Date.now(), employe: currentUser.nom }]);
    setShowTempsModal(false);
  };

  const deleteTemps = (id) => {
    if (confirm('Supprimer ?')) saveTemps(temps.filter(t => t.id !== id));
  };

  const addOrUpdateTache = (tache) => {
    if (editingItem) {
      saveTaches(taches.map(t => t.id === editingItem.id ? { ...tache, id: t.id } : t));
    } else {
      saveTaches([...taches, { ...tache, id: Date.now(), createdBy: currentUser.nom, statut: 'en_attente', createdAt: new Date().toISOString() }]);
    }
    setShowTacheModal(false);
    setEditingItem(null);
  };

  const toggleTacheStatus = (id) => {
    const updated = taches.map(t => {
      if (t.id === id) {
        const newStatus = t.statut === 'terminee' ? 'en_cours' : 'terminee';
        return { ...t, statut: newStatus, completedAt: newStatus === 'terminee' ? new Date().toISOString() : null };
      }
      return t;
    });
    saveTaches(updated);
  };

  const deleteTache = (id) => {
    if (confirm('Supprimer ?')) saveTaches(taches.filter(t => t.id !== id));
  };

  const addDifficulte = (difficulte) => {
    const newDiff = {
      ...difficulte,
      id: Date.now(),
      rapportePar: currentUser.nom,
      date: new Date().toISOString(),
      statut: 'non_resolue'
    };
    saveDifficultes([...difficultes, newDiff]);
    addNotification('Difficulté signalée', 'warning');
    setShowDifficulteModal(false);
  };

  const toggleDifficulteStatus = (id) => {
    const updated = difficultes.map(d => {
      if (d.id === id) {
        return { ...d, statut: d.statut === 'resolue' ? 'non_resolue' : 'resolue', resolueLe: d.statut === 'resolue' ? null : new Date().toISOString() };
      }
      return d;
    });
    saveDifficultes(updated);
  };

  const deleteDifficulte = (id) => {
    if (confirm('Supprimer ?')) saveDifficultes(difficultes.filter(d => d.id !== id));
  };

  const sendEmailUpdate = (chantier) => {
    const subject = `Mise à jour: ${chantier.nom}`;
    const body = `Bonjour ${chantier.client},\n\nAvancement: ${chantier.statut}\nProgression: ${chantier.progression}%\n\nCordialement,\n${currentUser.nom}`;
    window.location.href = `mailto:${chantier.emailClient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const exportToCSV = (data, filename) => {
    if (data.length === 0) return alert('Aucune donnée');
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Calculs
  const stocksAlerts = stocks.filter(s => s.quantite <= s.seuilAlerte).length;
  const chantiersActifs = chantiers.filter(c => c.statut === 'En cours' || c.statut === 'Installation').length;
  const tachesEnCours = taches.filter(t => t.statut !== 'terminee').length;
  const tachesEmploye = userRole === 'employe' ? taches.filter(t => t.assigneA === currentUser.nom) : [];
  const tempsEmploye = temps.filter(t => t.employe === currentUser.nom);
  const difficultesNonResolues = difficultes.filter(d => d.statut === 'non_resolue').length;
  
  const heuresSemaine = temps
    .filter(t => {
      if (userRole === 'employe' && t.employe !== currentUser.nom) return false;
      const date = new Date(t.date);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    })
    .reduce((sum, t) => sum + parseFloat(t.heures || 0), 0);

  const chiffreAffaireTotal = chantiers.reduce((sum, c) => sum + parseFloat(c.montant || 0), 0);
  const chiffreAffaireEnCours = chantiers
    .filter(c => c.statut === 'En cours' || c.statut === 'Installation')
    .reduce((sum, c) => sum + parseFloat(c.montant || 0), 0);

  // Analyse de rentabilité
  const analyserRentabilite = () => {
    return chantiers.map(c => {
      const heuresChantier = temps.filter(t => t.chantier === c.nom).reduce((sum, t) => sum + parseFloat(t.heures || 0), 0);
      const coutMain = heuresChantier * 35; // 35€/h estimé
      const coutMateriaux = 0; // À calculer avec les stocks utilisés
      const benefice = parseFloat(c.montant || 0) - coutMain - coutMateriaux;
      const marge = c.montant > 0 ? (benefice / c.montant * 100) : 0;
      
      return {
        chantier: c.nom,
        ca: parseFloat(c.montant || 0),
        heures: heuresChantier,
        coutMain,
        benefice,
        marge: marge.toFixed(1),
        statut: c.statut
      };
    }).sort((a, b) => b.marge - a.marge);
  };

  // Calendrier
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsPourJour = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    const events = [];
    
    taches.forEach(t => {
      if (t.dateEcheance === dateStr) {
        events.push({ type: 'tache', data: t });
      }
    });
    
    chantiers.forEach(c => {
      if (c.dateDebut === dateStr || c.dateFin === dateStr) {
        events.push({ type: 'chantier', data: c });
      }
    });
    
    return events;
  };

  // Composants
  const LoginModal = () => {
    const [code, setCode] = useState('');
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 border-2 border-amber-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <Wrench className="text-amber-400 mx-auto mb-4" size={64} />
            <h1 className="text-3xl font-bold text-amber-400 mb-2">LOISON CREATION</h1>
            <p className="text-zinc-400">Système de gestion</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Code (4 chiffres)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && code.length === 4 && handleLogin(code)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest"
              maxLength={4}
              autoFocus
            />
            <button
              onClick={() => handleLogin(code)}
              disabled={code.length !== 4}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold py-3 rounded-lg transition"
            >
              SE CONNECTER
            </button>
          </div>
          <div className="mt-8 p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-zinc-400 text-xs text-center mb-3">Codes:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-900 p-3 rounded text-center">
                <div className="text-amber-400 font-bold mb-1">👔 PATRON</div>
                <div className="text-zinc-300 text-lg font-mono">0000</div>
              </div>
              <div className="bg-zinc-900 p-3 rounded text-center">
                <div className="text-blue-400 font-bold mb-1">👷 EMPLOYÉ</div>
                <div className="text-zinc-300 text-lg font-mono">1234</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StockForm = ({ item, onSubmit, onClose }) => {
    const [formData, setFormData] = useState(item || { nom: '', reference: '', quantite: 0, unite: 'kg', seuilAlerte: 0, prix: 0, fournisseur: '' });
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 border border-amber-500/30 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-amber-400 mb-4">{item ? 'Modifier' : 'Ajouter'}</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <input type="text" placeholder="Référence" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Quantité" value={formData.quantite} onChange={e => setFormData({...formData, quantite: e.target.value})} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
              <select value={formData.unite} onChange={e => setFormData({...formData, unite: e.target.value})} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
                <option>kg</option><option>m</option><option>unité</option><option>m²</option>
              </select>
            </div>
            <input type="number" placeholder="Seuil" value={formData.seuilAlerte} onChange={e => setFormData({...formData, seuilAlerte: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <input type="number" step="0.01" placeholder="Prix €" value={formData.prix} onChange={e => setFormData({...formData, prix: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <input type="text" placeholder="Fournisseur" value={formData.fournisseur} onChange={e => setFormData({...formData, fournisseur: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => onSubmit(formData)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded">Enregistrer</button>
            <button onClick={onClose} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded">Annuler</button>
          </div>
        </div>
      </div>
    );
  };

  const ChantierForm = ({ item, onSubmit, onClose }) => {
    const [formData, setFormData] = useState(item || { nom: '', client: '', emailClient: '', telephone: '', adresse: '', statut: 'Devis', progression: 0, dateDebut: '', dateFin: '', montant: 0, notes: '' });
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 border border-amber-500/30 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-amber-400 mb-4">{item ? 'Modifier' : 'Créer'}</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <input type="text" placeholder="Client" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <input type="email" placeholder="Email" value={formData.emailClient} onChange={e => setFormData({...formData, emailClient: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <input type="tel" placeholder="Tél" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <input type="text" placeholder="Adresse" value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <select value={formData.statut} onChange={e => setFormData({...formData, statut: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
              <option>Devis</option><option>En attente</option><option>En cours</option><option>Installation</option><option>Terminé</option>
            </select>
            <div>
              <label className="text-zinc-400 text-sm">Progression: {formData.progression}%</label>
              <input type="range" min="0" max="100" value={formData.progression} onChange={e => setFormData({...formData, progression: e.target.value})} className="w-full" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-zinc-400 text-xs">Début</label><input type="date" value={formData.dateDebut} onChange={e => setFormData({...formData, dateDebut: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-sm" /></div>
              <div><label className="text-zinc-400 text-xs">Fin</label><input type="date" value={formData.dateFin} onChange={e => setFormData({...formData, dateFin: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-sm" /></div>
            </div>
            <input type="number" step="0.01" placeholder="Montant €" value={formData.montant} onChange={e => setFormData({...formData, montant: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <textarea placeholder="Notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white h-20" />
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => onSubmit(formData)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded">Enregistrer</button>
            <button onClick={onClose} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded">Annuler</button>
          </div>
        </div>
      </div>
    );
  };

  const TacheForm = ({ item, onSubmit, onClose }) => {
    const [formData, setFormData] = useState(item || { titre: '', description: '', chantier: '', assigneA: '', priorite: 'normale', dateEcheance: '' });
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 border border-amber-500/30 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-amber-400 mb-4">{item ? 'Modifier' : 'Créer'}</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Titre" value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white h-20" />
            <select value={formData.chantier} onChange={e => setFormData({...formData, chantier: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
              <option value="">Chantier</option>
              {chantiers.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </select>
            <select value={formData.assigneA} onChange={e => setFormData({...formData, assigneA: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
              <option value="">Assigner à</option>
              {EMPLOYES.filter(e => e.role === 'employe').map(e => <option key={e.id} value={e.nom}>{e.nom}</option>)}
            </select>
            <select value={formData.priorite} onChange={e => setFormData({...formData, priorite: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
              <option value="basse">Basse</option><option value="normale">Normale</option><option value="haute">Haute</option><option value="urgente">Urgente</option>
            </select>
            <input type="date" value={formData.dateEcheance} onChange={e => setFormData({...formData, dateEcheance: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => onSubmit(formData)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded">Enregistrer</button>
            <button onClick={onClose} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded">Annuler</button>
          </div>
        </div>
      </div>
    );
  };

  const TempsForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], chantier: '', heures: '', description: '' });
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 border border-amber-500/30 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Pointer</h3>
          <div className="space-y-3">
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <select value={formData.chantier} onChange={e => setFormData({...formData, chantier: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
              <option value="">Chantier</option>
              {chantiers.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </select>
            <input type="number" step="0.5" placeholder="Heures" value={formData.heures} onChange={e => setFormData({...formData, heures: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white" />
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white h-20" />
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => onSubmit(formData)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded">Enregistrer</button>
            <button onClick={onClose} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded">Annuler</button>
          </div>
        </div>
      </div>
    );
  };

  const DifficulteForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({ chantier: '', type: 'materiel', description: '', impact: 'faible' });
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 border border-red-500/30 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-red-400 mb-4">Signaler une difficulté</h3>
          <div className="space-y-3">
            <select value={formData.chantier} onChange={e => setFormData({...formData, chantier: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
              <option value="">Chantier concerné</option>
              {chantiers.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </select>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
              <option value="materiel">Matériel</option>
              <option value="technique">Technique</option>
              <option value="client">Client</option>
              <option value="fournisseur">Fournisseur</option>
              <option value="meteo">Météo</option>
              <option value="securite">Sécurité</option>
              <option value="autre">Autre</option>
            </select>
            <textarea placeholder="Description du problème" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white h-24" />
            <select value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
              <option value="faible">Impact faible</option>
              <option value="moyen">Impact moyen</option>
              <option value="fort">Impact fort</option>
              <option value="bloquant">Bloquant</option>
            </select>
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => onSubmit(formData)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded">Signaler</button>
            <button onClick={onClose} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded">Annuler</button>
          </div>
        </div>
      </div>
    );
  };

  if (showLoginModal) return <LoginModal />;
  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="text-amber-400 text-xl">Chargement...</div></div>;

  // INTERFACE PATRON
  if (userRole === 'patron') {
    const rentabilite = analyserRentabilite();
    
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <header className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-b border-amber-500/30 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="text-amber-400" size={28} />
                <div>
                  <h1 className="text-xl font-bold text-amber-400">ESPACE PATRON</h1>
                  <p className="text-zinc-400 text-xs">{currentUser.nom}</p>
                </div>
              </div>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-amber-400">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <nav className="hidden lg:flex gap-2">
                {[
                  { id: 'dashboard', label: 'Tableau de bord', icon: TrendingUp },
                  { id: 'planning', label: 'Planning', icon: Calendar },
                  { id: 'chantiers', label: 'Chantiers', icon: Users },
                  { id: 'difficultes', label: 'Difficultés', icon: AlertCircle },
                  { id: 'rentabilite', label: 'Rentabilité', icon: BarChart3 },
                  { id: 'taches', label: 'Tâches', icon: CheckSquare },
                  { id: 'stocks', label: 'Stocks', icon: Package }
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1 px-2 py-2 rounded transition text-xs ${activeTab === tab.id ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </nav>

              <button onClick={handleLogout} className="hidden lg:flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded text-sm">
                <LogOut size={16} />
              </button>
            </div>

            {mobileMenuOpen && (
              <nav className="lg:hidden mt-4 flex flex-col gap-2">
                {[
                  { id: 'dashboard', label: 'Tableau de bord', icon: TrendingUp },
                  { id: 'planning', label: 'Planning', icon: Calendar },
                  { id: 'chantiers', label: 'Chantiers', icon: Users },
                  { id: 'difficultes', label: 'Difficultés', icon: AlertCircle },
                  { id: 'rentabilite', label: 'Rentabilité', icon: BarChart3 },
                  { id: 'taches', label: 'Tâches', icon: CheckSquare },
                  { id: 'stocks', label: 'Stocks', icon: Package }
                ].map(tab => (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }} className={`flex items-center gap-2 px-3 py-2 rounded ${activeTab === tab.id ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-zinc-300'}`}>
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
                <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-2 rounded">
                  <LogOut size={18} />
                </button>
              </nav>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-amber-400 mb-6">Vue d'ensemble</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
                  <DollarSign className="text-green-400 mb-2" size={28} />
                  <h3 className="text-zinc-400 text-xs mb-1">CA Total</h3>
                  <p className="text-2xl font-bold text-white">{chiffreAffaireTotal.toFixed(0)} €</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4">
                  <Users className="text-blue-400 mb-2" size={28} />
                  <h3 className="text-zinc-400 text-xs mb-1">Chantiers actifs</h3>
                  <p className="text-2xl font-bold text-white">{chantiersActifs}</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 rounded-lg p-4">
                  {difficultesNonResolues > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full float-right">{difficultesNonResolues}</span>}
                  <AlertCircle className="text-red-400 mb-2" size={28} />
                  <h3 className="text-zinc-400 text-xs mb-1">Difficultés</h3>
                  <p className="text-2xl font-bold text-white">{difficultes.length}</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-lg p-4">
                  {stocksAlerts > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full float-right">{stocksAlerts}</span>}
                  <Package className="text-amber-400 mb-2" size={28} />
                  <h3 className="text-zinc-400 text-xs mb-1">Stock</h3>
                  <p className="text-2xl font-bold text-white">{stocks.length}</p>
                </div>
              </div>

              {/* Alertes importantes */}
              {(stocksAlerts > 0 || difficultesNonResolues > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {stocksAlerts > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="text-red-400" size={20} />
                        <h3 className="text-red-400 font-bold">Alertes de stock</h3>
                      </div>
                      <div className="space-y-2">
                        {stocks.filter(s => s.quantite <= s.seuilAlerte).slice(0, 5).map(s => (
                          <div key={s.id} className="flex justify-between bg-zinc-900/50 p-2 rounded text-sm">
                            <span className="text-white">{s.nom}</span>
                            <span className="text-red-400">{s.quantite} {s.unite}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {difficultesNonResolues > 0 && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="text-orange-400" size={20} />
                        <h3 className="text-orange-400 font-bold">Difficultés à traiter</h3>
                      </div>
                      <div className="space-y-2">
                        {difficultes.filter(d => d.statut === 'non_resolue').slice(0, 5).map(d => (
                          <div key={d.id} className="bg-zinc-900/50 p-2 rounded text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="text-white font-semibold">{d.chantier}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                d.impact === 'bloquant' ? 'bg-red-500/20 text-red-400' :
                                d.impact === 'fort' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>{d.impact}</span>
                            </div>
                            <p className="text-zinc-400 text-xs">{d.type}: {d.description.slice(0, 50)}...</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Top/Flop chantiers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-green-400 mb-4">🏆 Top rentabilité</h3>
                  <div className="space-y-2">
                    {rentabilite.filter(r => parseFloat(r.marge) > 0).slice(0, 5).map(r => (
                      <div key={r.chantier} className="bg-zinc-800 rounded p-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-white font-semibold text-sm">{r.chantier}</span>
                          <span className="text-green-400 font-bold">{r.marge}%</span>
                        </div>
                        <div className="text-zinc-400 text-xs">CA: {r.ca.toFixed(0)}€ • {r.heures}h</div>
                      </div>
                    ))}
                    {rentabilite.filter(r => parseFloat(r.marge) > 0).length === 0 && (
                      <p className="text-center text-zinc-400 py-4">Aucune donnée</p>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-red-400 mb-4">⚠️ Chantiers à surveiller</h3>
                  <div className="space-y-2">
                    {rentabilite.filter(r => parseFloat(r.marge) < 20).slice(0, 5).map(r => (
                      <div key={r.chantier} className="bg-zinc-800 rounded p-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-white font-semibold text-sm">{r.chantier}</span>
                          <span className="text-red-400 font-bold">{r.marge}%</span>
                        </div>
                        <div className="text-zinc-400 text-xs">CA: {r.ca.toFixed(0)}€ • {r.heures}h • Coût: {r.coutMain.toFixed(0)}€</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLANNING */}
          {activeTab === 'planning' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-400">Planning</h2>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded">←</button>
                  <button onClick={() => setSelectedDate(new Date())} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded">Aujourd'hui</button>
                  <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded">→</button>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h3>

                <div className="grid grid-cols-7 gap-2">
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                    <div key={day} className="text-center text-zinc-400 font-bold text-sm p-2">
                      {day}
                    </div>
                  ))}

                  {getDaysInMonth(selectedDate).map((date, i) => {
                    const events = date ? getEventsPourJour(date) : [];
                    const isToday = date && date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div key={i} className={`min-h-24 p-2 rounded border ${
                        !date ? 'bg-zinc-950 border-zinc-900' :
                        isToday ? 'bg-amber-500/20 border-amber-500/50' :
                        'bg-zinc-800 border-zinc-700'
                      }`}>
                        {date && (
                          <>
                            <div className={`text-sm font-bold mb-1 ${isToday ? 'text-amber-400' : 'text-white'}`}>
                              {date.getDate()}
                            </div>
                            <div className="space-y-1">
                              {events.slice(0, 3).map((event, idx) => (
                                <div key={idx} className={`text-xs p-1 rounded ${
                                  event.type === 'tache' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                }`}>
                                  {event.data.titre || event.data.nom}
                                </div>
                              ))}
                              {events.length > 3 && (
                                <div className="text-xs text-zinc-500">+{events.length - 3}</div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500/20 border border-blue-500/50 rounded"></div>
                    <span className="text-zinc-400">Tâches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500/20 border border-green-500/50 rounded"></div>
                    <span className="text-zinc-400">Chantiers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500/20 border border-amber-500/50 rounded"></div>
                    <span className="text-zinc-400">Aujourd'hui</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHANTIERS */}
          {activeTab === 'chantiers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-400">Chantiers</h2>
                <button onClick={() => { setEditingItem(null); setShowChantierModal(true); }} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded">
                  <Plus size={18} />
                  Nouveau
                </button>
              </div>

              <div className="space-y-4">
                {chantiers.map(c => (
                  <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                    <div className="flex justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{c.nom}</h3>
                        <p className="text-zinc-400 text-sm">{c.client}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => sendEmailUpdate(c)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm"><Mail size={14} /></button>
                        <button onClick={() => { setEditingItem(c); setShowChantierModal(true); }} className="bg-amber-500 text-black px-2 py-1 rounded text-sm"><Edit2 size={14} /></button>
                        <button onClick={() => deleteChantier(c.id)} className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    
                    <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{width: `${c.progression}%`}} />
                    </div>
                    <p className="text-amber-400 text-sm">{c.progression}% • {c.statut} • {parseFloat(c.montant || 0).toFixed(0)}€</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DIFFICULTÉS */}
          {activeTab === 'difficultes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-red-400">Difficultés & Problèmes</h2>
                <button onClick={() => setShowDifficulteModal(true)} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded">
                  <Plus size={18} />
                  Signaler
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h3 className="text-zinc-400 text-xs mb-1">Total</h3>
                  <p className="text-3xl font-bold text-white">{difficultes.length}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h3 className="text-zinc-400 text-xs mb-1">Non résolues</h3>
                  <p className="text-3xl font-bold text-red-400">{difficultesNonResolues}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h3 className="text-zinc-400 text-xs mb-1">Type le plus fréquent</h3>
                  <p className="text-lg font-bold text-amber-400">
                    {difficultes.length > 0 ? 
                      Object.entries(difficultes.reduce((acc, d) => {
                        acc[d.type] = (acc[d.type] || 0) + 1;
                        return acc;
                      }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'
                      : '-'}
                  </p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h3 className="text-zinc-400 text-xs mb-1">Résolues</h3>
                  <p className="text-3xl font-bold text-green-400">{difficultes.filter(d => d.statut === 'resolue').length}</p>
                </div>
              </div>

              {/* Liste */}
              <div className="space-y-4">
                {difficultes.sort((a, b) => new Date(b.date) - new Date(a.date)).map(d => (
                  <div key={d.id} className={`bg-zinc-900 border rounded-lg p-5 ${d.statut === 'resolue' ? 'border-green-500/30 opacity-60' : 'border-red-500/30'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <button onClick={() => toggleDifficulteStatus(d.id)} className={`${d.statut === 'resolue' ? 'text-green-400' : 'text-zinc-600'}`}>
                            <CheckCircle size={24} />
                          </button>
                          <div>
                            <h3 className={`font-bold text-white ${d.statut === 'resolue' ? 'line-through' : ''}`}>{d.chantier}</h3>
                            <p className="text-zinc-400 text-sm">{new Date(d.date).toLocaleDateString('fr-FR')} • Par {d.rapportePar}</p>
                          </div>
                        </div>
                        <p className="text-white mb-2">{d.description}</p>
                        <div className="flex gap-2">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">{d.type}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            d.impact === 'bloquant' ? 'bg-red-500/20 text-red-400' :
                            d.impact === 'fort' ? 'bg-orange-500/20 text-orange-400' :
                            d.impact === 'moyen' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-zinc-700 text-zinc-400'
                          }`}>{d.impact}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteDifficulte(d.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {difficultes.length === 0 && (
                  <div className="text-center py-16 text-zinc-400">
                    <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
                    <p>Aucune difficulté signalée !</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RENTABILITÉ */}
          {activeTab === 'rentabilite' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-400">Analyse de rentabilité</h2>
                <button onClick={() => exportToCSV(rentabilite, 'rentabilite')} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                  <Download size={18} />
                  Exporter
                </button>
              </div>

              {/* Métriques globales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
                  <Target className="text-green-400 mb-2" size={28} />
                  <h3 className="text-zinc-400 text-xs mb-1">Marge moyenne</h3>
                  <p className="text-3xl font-bold text-white">
                    {rentabilite.length > 0 ? 
                      (rentabilite.reduce((sum, r) => sum + parseFloat(r.marge), 0) / rentabilite.length).toFixed(1)
                      : 0}%
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4">
                  <Activity className="text-blue-400 mb-2" size={28} />
                  <h3 className="text-zinc-400 text-xs mb-1">Heures totales</h3>
                  <p className="text-3xl font-bold text-white">
                    {rentabilite.reduce((sum, r) => sum + r.heures, 0).toFixed(0)}h
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-lg p-4">
                  <DollarSign className="text-amber-400 mb-2" size={28} />
                  <h3 className="text-zinc-400 text-xs mb-1">Bénéfice total</h3>
                  <p className="text-3xl font-bold text-white">
                    {rentabilite.reduce((sum, r) => sum + r.benefice, 0).toFixed(0)}€
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-pink-500/10 border border-red-500/30 rounded-lg p-4">
                  <TrendingDown className="text-red-400 mb-2" size={28} />
                  <h3 className="text-zinc-400 text-xs mb-1">Chantiers < 20%</h3>
                  <p className="text-3xl font-bold text-white">
                    {rentabilite.filter(r => parseFloat(r.marge) < 20).length}
                  </p>
                </div>
              </div>

              {/* Tableau détaillé */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-800">
                    <tr>
                      <th className="text-left text-zinc-400 p-3">Chantier</th>
                      <th className="text-right text-zinc-400 p-3">CA</th>
                      <th className="text-right text-zinc-400 p-3">Heures</th>
                      <th className="text-right text-zinc-400 p-3">Coût main d'œuvre</th>
                      <th className="text-right text-zinc-400 p-3">Bénéfice</th>
                      <th className="text-right text-zinc-400 p-3">Marge %</th>
                      <th className="text-center text-zinc-400 p-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentabilite.map((r, i) => (
                      <tr key={i} className="border-t border-zinc-800">
                        <td className="p-3 text-white font-semibold">{r.chantier}</td>
                        <td className="p-3 text-right text-white">{r.ca.toFixed(0)} €</td>
                        <td className="p-3 text-right text-zinc-300">{r.heures.toFixed(1)}h</td>
                        <td className="p-3 text-right text-orange-400">{r.coutMain.toFixed(0)} €</td>
                        <td className={`p-3 text-right font-bold ${r.benefice >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {r.benefice.toFixed(0)} €
                        </td>
                        <td className={`p-3 text-right font-bold ${
                          parseFloat(r.marge) >= 30 ? 'text-green-400' :
                          parseFloat(r.marge) >= 20 ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {r.marge}%
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${
                            r.statut === 'Terminé' ? 'bg-green-500/20 text-green-400' :
                            r.statut === 'En cours' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-zinc-700 text-zinc-400'
                          }`}>{r.statut}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recommandations */}
              <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-5">
                <h3 className="text-blue-400 font-bold mb-3">💡 Recommandations</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  {rentabilite.filter(r => parseFloat(r.marge) < 15).length > 0 && (
                    <li>• <span className="text-red-400 font-bold">{rentabilite.filter(r => parseFloat(r.marge) < 15).length} chantier(s)</span> ont une marge inférieure à 15% - Revoir les devis ou optimiser les coûts</li>
                  )}
                  {rentabilite.filter(r => r.heures > 100).length > 0 && (
                    <li>• <span className="text-amber-400 font-bold">{rentabilite.filter(r => r.heures > 100).length} chantier(s)</span> dépassent 100h - Analyser si c'était prévu au devis</li>
                  )}
                  {rentabilite.filter(r => parseFloat(r.marge) > 40).length > 0 && (
                    <li>• <span className="text-green-400 font-bold">{rentabilite.filter(r => parseFloat(r.marge) > 40).length} chantier(s)</span> ont une excellente marge (>40%) - Reproduire ce modèle !</li>
                  )}
                  <li>• Coût horaire moyen estimé : 35€/h (main d'œuvre) - À ajuster selon votre réalité</li>
                </ul>
              </div>
            </div>
          )}

          {/* TÂCHES */}
          {activeTab === 'taches' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-400">Tâches</h2>
                <button onClick={() => { setEditingItem(null); setShowTacheModal(true); }} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded">
                  <Plus size={18} />
                  Nouvelle
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {taches.map(t => (
                  <div key={t.id} className={`bg-zinc-900 border rounded-lg p-4 ${t.statut === 'terminee' ? 'border-green-500/30 opacity-60' : 'border-zinc-800'}`}>
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleTacheStatus(t.id)} className={`mt-1 ${t.statut === 'terminee' ? 'text-green-400' : 'text-zinc-600'}`}>
                        <CheckCircle size={24} />
                      </button>
                      <div className="flex-1">
                        <h3 className={`font-bold text-white ${t.statut === 'terminee' ? 'line-through' : ''}`}>{t.titre}</h3>
                        {t.description && <p className="text-zinc-400 text-sm">{t.description}</p>}
                        {t.assigneA && <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs mt-2 inline-block">{t.assigneA}</span>}
                      </div>
                      <button onClick={() => deleteTache(t.id)} className="text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STOCKS */}
          {activeTab === 'stocks' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-400">Stocks</h2>
                <button onClick={() => { setEditingItem(null); setShowStockModal(true); }} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded">
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stocks.map(s => (
                  <div key={s.id} className={`bg-zinc-900 border rounded-lg p-4 ${s.quantite <= s.seuilAlerte ? 'border-red-500/50' : 'border-zinc-800'}`}>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-white font-bold">{s.nom}</h3>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingItem(s); setShowStockModal(true); }} className="text-amber-400"><Edit2 size={14} /></button>
                        <button onClick={() => deleteStock(s.id)} className="text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Stock:</span>
                        <span className={`font-bold ${s.quantite <= s.seuilAlerte ? 'text-red-400' : 'text-white'}`}>{s.quantite} {s.unite}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Prix:</span>
                        <span className="text-zinc-300">{parseFloat(s.prix).toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {showStockModal && <StockForm item={editingItem} onSubmit={addOrUpdateStock} onClose={() => { setShowStockModal(false); setEditingItem(null); }} />}
        {showChantierModal && <ChantierForm item={editingItem} onSubmit={addOrUpdateChantier} onClose={() => { setShowChantierModal(false); setEditingItem(null); }} />}
        {showTacheModal && <TacheForm item={editingItem} onSubmit={addOrUpdateTache} onClose={() => { setShowTacheModal(false); setEditingItem(null); }} />}
        {showDifficulteModal && <DifficulteForm onSubmit={addDifficulte} onClose={() => setShowDifficulteModal(false)} />}
      </div>
    );
  }

  // INTERFACE EMPLOYÉ
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-b border-blue-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="text-blue-400" size={28} />
              <div>
                <h1 className="text-xl font-bold text-blue-400">ESPACE EMPLOYÉ</h1>
                <p className="text-zinc-400 text-xs">{currentUser.nom}</p>
              </div>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-blue-400">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className="hidden lg:flex gap-2">
              {[
                { id: 'dashboard', label: 'Mes tâches', icon: CheckSquare },
                { id: 'temps', label: 'Pointer', icon: Clock },
                { id: 'chantiers', label: 'Chantiers', icon: Users },
                { id: 'difficultes', label: 'Signaler', icon: AlertCircle }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-3 py-2 rounded transition text-sm ${activeTab === tab.id ? 'bg-blue-500 text-white font-bold' : 'bg-zinc-800 text-zinc-300'}`}>
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>

            <button onClick={handleLogout} className="hidden lg:flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm">
              <LogOut size={16} />
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 flex flex-col gap-2">
              {[
                { id: 'dashboard', label: 'Mes tâches', icon: CheckSquare },
                { id: 'temps', label: 'Pointer', icon: Clock },
                { id: 'chantiers', label: 'Chantiers', icon: Users },
                { id: 'difficultes', label: 'Signaler', icon: AlertCircle }
              ].map(tab => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }} className={`flex items-center gap-2 px-3 py-2 rounded ${activeTab === tab.id ? 'bg-blue-500 text-white font-bold' : 'bg-zinc-800 text-zinc-300'}`}>
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-2 rounded">
                <LogOut size={18} />
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-6">Mes tâches</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-lg p-4">
                <CheckSquare className="text-amber-400 mb-2" size={28} />
                <h3 className="text-zinc-400 text-xs">Assignées</h3>
                <p className="text-3xl font-bold text-white">{tachesEmploye.filter(t => t.statut !== 'terminee').length}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
                <CheckCircle className="text-green-400 mb-2" size={28} />
                <h3 className="text-zinc-400 text-xs">Terminées</h3>
                <p className="text-3xl font-bold text-white">{tachesEmploye.filter(t => t.statut === 'terminee').length}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4">
                <Clock className="text-blue-400 mb-2" size={28} />
                <h3 className="text-zinc-400 text-xs">Heures semaine</h3>
                <p className="text-3xl font-bold text-white">{heuresSemaine.toFixed(1)}h</p>
              </div>
            </div>

            <div className="space-y-4">
              {tachesEmploye.filter(t => t.statut !== 'terminee').map(t => (
                <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleTacheStatus(t.id)} className="text-zinc-600 mt-1">
                      <CheckCircle size={24} />
                    </button>
                    <div>
                      <h4 className="font-bold text-white">{t.titre}</h4>
                      {t.description && <p className="text-zinc-400 text-sm">{t.description}</p>}
                      {t.chantier && <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs mt-2 inline-block">{t.chantier}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {tachesEmploye.filter(t => t.statut !== 'terminee').length === 0 && (
                <div className="text-center py-12 text-zinc-400">
                  <CheckCircle className="mx-auto mb-3 text-green-500" size={48} />
                  <p>Aucune tâche !</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'temps' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-400">Pointage</h2>
              <button onClick={() => setShowTempsModal(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded">
                <Plus size={18} />
                Pointer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-zinc-400 text-sm">Aujourd'hui</p>
                <p className="text-3xl font-bold text-blue-400">
                  {tempsEmploye.filter(t => t.date === new Date().toISOString().split('T')[0]).reduce((sum, t) => sum + parseFloat(t.heures || 0), 0).toFixed(1)}h
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-zinc-400 text-sm">Cette semaine</p>
                <p className="text-3xl font-bold text-amber-400">{heuresSemaine.toFixed(1)}h</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-zinc-400 text-sm">Ce mois</p>
                <p className="text-3xl font-bold text-green-400">
                  {tempsEmploye.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + parseFloat(t.heures || 0), 0).toFixed(1)}h
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
              <div className="p-4 border-b border-zinc-800">
                <h3 className="font-bold text-white">Historique</h3>
              </div>
              <div className="divide-y divide-zinc-800">
                {tempsEmploye.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20).map(t => (
                  <div key={t.id} className="p-4 flex justify-between">
                    <div>
                      <div className="text-white font-semibold">{t.chantier}</div>
                      <div className="text-zinc-400 text-sm">{new Date(t.date).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div className="text-blue-400 font-bold text-lg">{t.heures}h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chantiers' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-6">Chantiers en cours</h2>
            <div className="space-y-4">
              {chantiers.filter(c => c.statut === 'En cours' || c.statut === 'Installation').map(c => (
                <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-white mb-2">{c.nom}</h3>
                  <p className="text-zinc-400 text-sm mb-3">📍 {c.adresse}</p>
                  <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: `${c.progression}%`}} />
                  </div>
                  <p className="text-zinc-400 text-sm">{c.progression}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'difficultes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-400">Signaler une difficulté</h2>
              <button onClick={() => setShowDifficulteModal(true)} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded">
                <Plus size={18} />
                Signaler
              </button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-5 mb-6">
              <h3 className="text-blue-400 font-bold mb-2">💡 Pourquoi signaler ?</h3>
              <p className="text-zinc-300 text-sm">Aidez l'entreprise à s'améliorer en signalant les problèmes rencontrés : matériel défectueux, difficultés techniques, retards fournisseurs, problèmes météo, etc.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold">Mes signalements récents</h3>
              {difficultes.filter(d => d.rapportePar === currentUser.nom).slice(0, 10).map(d => (
                <div key={d.id} className={`bg-zinc-900 border rounded-lg p-4 ${d.statut === 'resolue' ? 'border-green-500/30' : 'border-zinc-800'}`}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-semibold">{d.chantier}</span>
                    <span className={`text-xs px-2 py-1 rounded ${d.statut === 'resolue' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {d.statut === 'resolue' ? 'Résolue' : 'En cours'}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-2">{d.description}</p>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">{d.type}</span>
                    <span className="text-zinc-500">{new Date(d.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showTempsModal && <TempsForm onSubmit={addTemps} onClose={() => setShowTempsModal(false)} />}
      {showDifficulteModal && <DifficulteForm onSubmit={addDifficulte} onClose={() => setShowDifficulteModal(false)} />}
    </div>
  );
};

export default GestionMetalleriePro;