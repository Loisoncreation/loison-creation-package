import React, { useState, useEffect } from 'react';
import { Wrench, Shield, LogOut, CheckCircle, CheckSquare, Plus, X, User, Calendar } from 'lucide-react';

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [activeTab, setActiveTab] = useState('taches');
  const [taches, setTaches] = useState([]);
  const [showTacheModal, setShowTacheModal] = useState(false);

  const EMPLOYES = [
    { id: 1, nom: 'PATRON', role: 'patron', code: '0000', actif: true },
    { id: 2, nom: 'Jean Dupont', role: 'employe', code: '1234', actif: true },
    { id: 3, nom: 'Marie Martin', role: 'employe', code: '5678', actif: true },
    { id: 4, nom: 'Pierre Durand', role: 'employe', code: '9012', actif: true }
  ];

  useEffect(() => {
    if (userRole) {
      loadTaches();
    }
  }, [userRole]);

  const loadTaches = async () => {
    try {
      const data = await window.storage.get('loison-taches');
      if (data?.value) {
        setTaches(JSON.parse(data.value));
      }
    } catch (error) {
      console.log('Pas de taches sauvegardees');
    }
  };

  const saveTaches = async (newTaches) => {
    setTaches(newTaches);
    try {
      await window.storage.set('loison-taches', JSON.stringify(newTaches));
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  };

  const handleLogin = (code) => {
    const user = EMPLOYES.find(e => e.code === code && e.actif);
    if (user) {
      setCurrentUser(user);
      setUserRole(user.role);
      setShowLoginModal(false);
    } else {
      alert('Code incorrect');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setShowLoginModal(true);
    setActiveTab('taches');
  };

  const addTache = (tache) => {
    const newTache = {
      ...tache,
      id: Date.now(),
      creePar: currentUser.nom,
      statut: 'en_cours',
      dateCreation: new Date().toISOString()
    };
    saveTaches([...taches, newTache]);
    setShowTacheModal(false);
  };

  const toggleTacheStatus = (id) => {
    const updated = taches.map(t => {
      if (t.id === id) {
        return {
          ...t,
          statut: t.statut === 'terminee' ? 'en_cours' : 'terminee',
          dateTerminee: t.statut === 'terminee' ? null : new Date().toISOString()
        };
      }
      return t;
    });
    saveTaches(updated);
  };

  const deleteTache = (id) => {
    if (window.confirm('Supprimer cette tache ?')) {
      saveTaches(taches.filter(t => t.id !== id));
    }
  };

  const LoginModal = () => {
    const [code, setCode] = useState('');

    return (
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(to bottom right, #09090b, #18181b, #09090b)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
        <div style={{ background: '#18181b', border: '2px solid rgba(251, 191, 36, 0.5)', borderRadius: '1rem', padding: '2rem', maxWidth: '28rem', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ color: '#fbbf24', margin: '0 auto 1rem', display: 'flex', justifyContent: 'center' }}>
              <Wrench size={64} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.5rem', margin: 0 }}>LOISON CREATION</h1>
            <p style={{ color: '#a1a1aa', margin: '0.5rem 0 0 0' }}>Systeme de gestion</p>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <input type="password" placeholder="Code 4 chiffres" value={code} onChange={(e) => setCode(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && code.length === 4 && handleLogin(code)} style={{ width: '100%', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: 'white', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.25em', boxSizing: 'border-box' }} maxLength={4} autoFocus />
          </div>
            
          <button onClick={() => handleLogin(code)} disabled={code.length !== 4} style={{ width: '100%', background: code.length === 4 ? '#fbbf24' : '#3f3f46', color: code.length === 4 ? 'black' : '#71717a', fontWeight: 'bold', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: code.length === 4 ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>SE CONNECTER</button>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(39, 39, 42, 0.5)', borderRadius: '0.5rem' }}>
            <p style={{ color: '#a1a1aa', fontSize: '0.75rem', textAlign: 'center', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>Codes de test:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
              <div style={{ background: '#18181b', padding: '0.75rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '0.25rem' }}>PATRON</div>
                <div style={{ color: '#d4d4d8', fontSize: '1.125rem', fontFamily: 'monospace' }}>0000</div>
              </div>
              <div style={{ background: '#18181b', padding: '0.75rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                <div style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '0.25rem' }}>EMPLOYE</div>
                <div style={{ color: '#d4d4d8', fontSize: '1.125rem', fontFamily: 'monospace' }}>1234</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TacheModal = () => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [assigneA, setAssigneA] = useState('');
    const [priorite, setPriorite] = useState('normale');

    const handleSubmit = () => {
      if (!titre || !assigneA) {
        alert('Titre et employe requis');
        return;
      }
      addTache({ titre, description, assigneA, priorite });
    };

    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '0.5rem', padding: '1.5rem', maxWidth: '28rem', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fbbf24', margin: 0 }}>Nouvelle Tache</h3>
            <button onClick={() => setShowTacheModal(false)} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Titre</label>
            <input value={titre} onChange={(e) => setTitre(e.target.value)} style={{ width: '100%', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '0.5rem', padding: '0.5rem', color: 'white', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '0.5rem', padding: '0.5rem', color: 'white', minHeight: '4rem', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Assigner a</label>
            <select value={assigneA} onChange={(e) => setAssigneA(e.target.value)} style={{ width: '100%', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '0.5rem', padding: '0.5rem', color: 'white', boxSizing: 'border-box' }}>
              <option value="">Selectionner...</option>
              {EMPLOYES.filter(e => e.role === 'employe').map(e => (
                <option key={e.id} value={e.nom}>{e.nom}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Priorite</label>
            <select value={priorite} onChange={(e) => setPriorite(e.target.value)} style={{ width: '100%', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '0.5rem', padding: '0.5rem', color: 'white', boxSizing: 'border-box' }}>
              <option value="basse">Basse</option>
              <option value="normale">Normale</option>
              <option value="haute">Haute</option>
            </select>
          </div>

          <button onClick={handleSubmit} style={{ width: '100%', background: '#fbbf24', color: 'black', fontWeight: 'bold', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
            Creer la tache
          </button>
        </div>
      </div>
    );
  };

  if (showLoginModal) return <LoginModal />;

  const tachesAffichees = userRole === 'patron' 
    ? taches 
    : taches.filter(t => t.assigneA === currentUser.nom);

  const tachesEnCours = tachesAffichees.filter(t => t.statut === 'en_cours');
  const tachesTerminees = tachesAffichees.filter(t => t.statut === 'terminee');

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: 'white' }}>
      <header style={{ background: 'linear-gradient(to right, #18181b, #27272a, #18181b)', borderBottom: '1px solid rgba(251, 191, 36, 0.3)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={28} style={{ color: '#fbbf24' }} />
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fbbf24', margin: 0 }}>
                  {userRole === 'patron' ? 'ESPACE PATRON' : 'ESPACE EMPLOYE'}
                </h1>
                <p style={{ color: '#a1a1aa', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>{currentUser?.nom}</p>
              </div>
            </div>

            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.5rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
              <LogOut size={16} />
              Deconnexion
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={28} style={{ color: '#fbbf24' }} />
            Gestion des Taches
          </h2>
          {userRole === 'patron' && (
            <button onClick={() => setShowTacheModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fbbf24', color: 'black', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
              <Plus size={20} />
              Nouvelle tache
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '0.5rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>En cours</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>{tachesEnCours.length}</div>
          </div>
          <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '0.5rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Terminees</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>{tachesTerminees.length}</div>
          </div>
        </div>

        {tachesEnCours.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fbbf24' }}>Taches en cours</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {tachesEnCours.map(tache => (
                <div key={tache.id} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '0.5rem', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>{tache.titre}</h4>
                      {tache.description && <p style={{ color: '#a1a1aa', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>{tache.description}</p>}
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#71717a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <User size={14} />
                          {tache.assigneA}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={14} />
                          {new Date(tache.dateCreation).toLocaleDateString()}
                        </div>
                        <div style={{ color: tache.priorite === 'haute' ? '#ef4444' : tache.priorite === 'normale' ? '#fbbf24' : '#71717a' }}>
                          {tache.priorite}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => toggleTacheStatus(tache.id)} style={{ background: '#22c55e', color: 'white', padding: '0.5rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}>
                        <CheckCircle size={20} />
                      </button>
                      {userRole === 'patron' && (
                        <button onClick={() => deleteTache(tache.id)} style={{ background: '#ef4444', color: 'white', padding: '0.5rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}>
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tachesTerminees.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: '#22c55e' }}>Taches terminees</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {tachesTerminees.map(tache => (
                <div key={tache.id} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '0.5rem', padding: '1rem', opacity: 0.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0', textDecoration: 'line-through' }}>{tache.titre}</h4>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#71717a' }}>
                        <div>{tache.assigneA}</div>
                        <div>Terminee le {new Date(tache.dateTerminee).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => toggleTacheStatus(tache.id)} style={{ background: '#3f3f46', color: 'white', padding: '0.5rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}>
                        Reactiver
                      </button>
                      {userRole === 'patron' && (
                        <button onClick={() => deleteTache(tache.id)} style={{ background: '#ef4444', color: 'white', padding: '0.5rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}>
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tachesAffichees.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#71717a' }}>
            <CheckSquare size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.125rem', margin: 0 }}>Aucune tache pour le moment</p>
            {userRole === 'patron' && <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Cliquez sur "Nouvelle tache" pour commencer</p>}
          </div>
        )}
      </main>

      {showTacheModal && <TacheModal />}
    </div>
  );
};

export default App;
