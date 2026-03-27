import React, { useState, useEffect } from 'react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [view, setView] = useState(window.location.hash.replace('#', '') || 'dashboard');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null); // { id: number, text: string, onConfirm: () => void }

  // Filters State
  const [filterDept, setFilterDept] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // User Management State
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });

  // Handle browser back button
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      setView(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeView = (newView) => {
    setView(newView);
    window.location.hash = newView;
  };

  useEffect(() => {
    if (token) {
      fetchTickets();
      if (user.role === 'admin') fetchUsers();
    }
  }, [token, user]);

  useEffect(() => {
    if (view === 'chat' && selectedTicket) {
      const interval = setInterval(() => fetchMessages(selectedTicket.id), 3000);
      return () => clearInterval(interval);
    }
  }, [view, selectedTicket]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const loginData = Object.fromEntries(formData);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.access_token);
      changeView('dashboard');

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    changeView('dashboard');
    localStorage.clear();
  };

  const fetchTickets = async () => {
    let url = `${API_URL}/tickets`;
    if (user.role === 'user') url += `?createdBy=${user.username}`;
    if (user.role === 'ti') url += `?department=Soporte TI`;
    if (user.role === 'helpdesk') url += `?department=Mesa de Ayuda`;

    try {
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      setNewUser({ username: '', password: '', role: 'user' });
      changeView('users');
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
      setEditingUser(null);
      changeView('users');
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      fetchUsers();
      setShowConfirm(null);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (ticketId) => {
    try {
      const res = await fetch(`${API_URL}/chat/${ticketId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (content) => {
    try {
      await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, sender: user.username, ticketId: selectedTicket.id }),
      });
      fetchMessages(selectedTicket.id);
    } catch (err) {
      console.error(err);
    }
  };

  const createTicket = async (ticketData) => {
    try {
      await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ticketData, createdBy: user.username }),
      });
      changeView('dashboard');
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchTickets();
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket({ ...selectedTicket, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateDepartment = async (id, department) => {
    try {
      await fetch(`${API_URL}/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department }),
      });
      
      // Delay to ensure the SQLite database fully commits the transaction
      await new Promise(resolve => setTimeout(resolve, 600));
      
      await fetchTickets();
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket({ ...selectedTicket, department });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        {/* Full-screen background image */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(/login-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
        {/* Dark overlay for readability */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(15,10,40,0.75) 0%, rgba(30,27,75,0.65) 30%, rgba(79,70,229,0.45) 100%)' }}></div>
        {/* Decorative glow effects */}
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)', borderRadius: '100%' }}></div>
        <div style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79,70,229,0.35) 0%, transparent 70%)', borderRadius: '100%' }}></div>
        <div className="glass-card animate-fade" style={{ width: '420px', zIndex: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'white', letterSpacing: '2px', fontWeight: '800', fontSize: '1.6rem' }}>🎫 TICKET SYSTEM</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>Username</label>
              <input name="username" className="form-control" style={{ marginTop: '0.4rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(8px)' }} required />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>Password</label>
              <input name="password" type="password" className="form-control" style={{ marginTop: '0.4rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(8px)' }} required />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Validando...' : 'Iniciar Sesión'}
            </button>
          </form>
          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
            Sistema de Gestión de Tickets
          </p>
        </div>
      </div>
    );
  }

  const renderAdminUsers = () => {
    const roles = {
      admin: users.filter(u => u.role === 'admin'),
      ti: users.filter(u => u.role === 'ti'),
      helpdesk: users.filter(u => u.role === 'helpdesk'),
      user: users.filter(u => u.role === 'user'),
    };

    return (
      <div className="animate-fade">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Gestión de Usuarios</h2>
          <button className="btn btn-primary" onClick={() => changeView('create-user')}>+ Nuevo Usuario</button>
        </div>

        {Object.entries(roles).map(([role, list]) => (
          <div key={role}>
            <h4 className="user-group-title">{role === 'admin' ? 'Administrador' : role === 'ti' ? 'Soporte TI' : role === 'helpdesk' ? 'Mesa de Ayuda' : role.charAt(0).toUpperCase() + role.slice(1)}</h4>
            <div className="glass-card" style={{ padding: '0', marginBottom: '2rem', overflow: 'hidden' }}>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(u => (
                    <tr key={u.id}>
                      <td>{u.username}</td>
                      <td>{u.role}</td>
                      <td style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => { setEditingUser(u); changeView('edit-user'); }}>Editar</button>
                        <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setShowConfirm({ id: u.id, text: `¿Eliminar a ${u.username}?`, onConfirm: () => handleDeleteUser(u.id) })}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const displayedTickets = tickets.filter(t => {
    if (filterDept && t.department !== filterDept) return false;
    
    if (filterDateFrom || filterDateTo) {
      if (!t.createdAt) return false;
      const tDateStr = new Date(t.createdAt).toISOString().split('T')[0];
      
      if (filterDateFrom && tDateStr < filterDateFrom) return false;
      if (filterDateTo && tDateStr > filterDateTo) return false;
    }
    return true;
  });

  return (
    <div className="app-layout">
      <div className="sidebar">
        <h2 style={{ color: 'var(--primary)', marginBottom: '3rem', textAlign: 'center' }}>TICKET PRO</h2>
        <div className="nav-item-list">
          <div className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => changeView('dashboard')}>
            <span style={{ fontSize: '1.2rem' }}>📋</span> {user.role === 'user' ? 'Mis Tickets' : 'Panel Principal'}
          </div>
          {user.role === 'admin' && (
            <div className={`nav-item ${view === 'users' || view === 'create-user' || view === 'edit-user' ? 'active' : ''}`} onClick={() => changeView('users')}>
              <span style={{ fontSize: '1.2rem' }}>👥</span> Usuarios
            </div>
          )}
          <div className="nav-item" style={{ marginTop: 'auto', color: 'var(--danger)' }} onClick={handleLogout}>Cerrar Sesión</div>
        </div>
        <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Conectado como:</p>
          <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.username}</p>
        </div>
      </div>

      <div className="main-content">
        {view === 'dashboard' && (
          <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <h2>{user.role === 'user' ? 'Mis Solicitudes' : 'Panel de Control'}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {user.role === 'user' ? 'Seguimiento de tus tickets de soporte' : 'Gestiona todos los tickets del departamento'}
                </p>
              </div>
              {user.role === 'user' && <button className="btn btn-primary" onClick={() => changeView('create')}>Crear Ticket</button>}
            </div>

            {user.role === 'admin' && (
              <div className="glass-card animate-fade" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', fontWeight: '600' }}>Filtrar por Departamento</label>
                  <select className="form-control" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                    <option value="">Todos los departamentos</option>
                    <option value="Soporte TI">Soporte TI</option>
                    <option value="Mesa de Ayuda">Mesa de Ayuda</option>
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', fontWeight: '600' }}>Fecha Desde</label>
                  <input type="date" className="form-control" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', fontWeight: '600' }}>Fecha Hasta</label>
                  <input type="date" className="form-control" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
                </div>
                {(filterDept || filterDateFrom || filterDateTo) && (
                  <button className="btn btn-danger" onClick={() => { setFilterDept(''); setFilterDateFrom(''); setFilterDateTo(''); }}>Limpiar Filtros</button>
                )}
              </div>
            )}

            <div className="ticket-grid">
              {displayedTickets.map(t => (
                <div key={t.id} className="glass-card animate-fade" style={{ cursor: 'pointer', transition: 'all 0.3s', position: 'relative', border: '1px solid var(--border)' }} 
                     onClick={() => { setSelectedTicket(t); changeView('chat'); fetchMessages(t.id); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ background: 'var(--primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800' }}>
                      #{t.id}
                    </span>
                    <span className={`status-badge status-${t.status.toLowerCase().replace(' ', '-')}`}>
                      {t.status === 'Open' ? '🟢 Abierto' : t.status === 'Closed' ? '🔴 Cerrado' : t.status}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.5rem' }}>{t.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {t.description}
                  </p>
                  
                  <div style={{ padding: '1rem 0 0 0', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text)' }}>👤 {t.createdBy}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>📍 {t.department}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.03)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {user.role === 'admin' && view === 'users' && renderAdminUsers()}

        {user.role === 'admin' && (view === 'create-user' || view === 'edit-user') && (
          <div className="glass-card animate-fade" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3>{view === 'create-user' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}</h3>
            <form onSubmit={view === 'create-user' ? handleCreateUser : handleUpdateUser} style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Username</label>
                <input 
                  className="form-control" 
                  value={view === 'create-user' ? newUser.username : editingUser.username}
                  onChange={e => view === 'create-user' ? setNewUser({...newUser, username: e.target.value}) : setEditingUser({...editingUser, username: e.target.value})}
                  required 
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Password {view === 'edit-user' && '(Vacío para no cambiar)'}</label>
                <input 
                  type="password"
                  className="form-control" 
                  value={view === 'create-user' ? newUser.password : (editingUser.password || '')}
                  onChange={e => view === 'create-user' ? setNewUser({...newUser, password: e.target.value}) : setEditingUser({...editingUser, password: e.target.value})}
                  required={view === 'create-user'}
                />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Rol</label>
                <select 
                  className="form-control"
                  value={view === 'create-user' ? newUser.role : editingUser.role}
                  onChange={e => view === 'create-user' ? setNewUser({...newUser, role: e.target.value}) : setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="user">Usuario</option>
                  <option value="ti">Soporte TI</option>
                  <option value="helpdesk">Mesa de Ayuda</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{view === 'create-user' ? 'Crear' : 'Guardar'}</button>
                <button type="button" className="btn btn-danger" style={{ flex: 1 }} onClick={() => changeView('users')}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {view === 'create' && (
          <div className="glass-card animate-fade" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3>Nuevo Ticket de Soporte</h3>
            <form onSubmit={(e) => { e.preventDefault(); createTicket(Object.fromEntries(new FormData(e.target))); }} style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Título del Problema</label>
                <input name="title" className="form-control" placeholder="Ej: No funciona mi impresora" required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Departamento</label>
                <select name="department" className="form-control">
                  <option value="Soporte TI">Soporte TI</option>
                  <option value="Mesa de Ayuda">Mesa de Ayuda</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Prioridad</label>
                <select name="priority" className="form-control">
                  <option value="Low">Baja</option>
                  <option value="Medium">Media</option>
                  <option value="High">Alta</option>
                  <option value="Critical">Crítica</option>
                </select>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Descripción Detallada</label>
                <textarea name="description" className="form-control" rows="5" required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" style={{ flex: 1 }}>Enviar Solicitud</button>
                <button type="button" className="btn btn-danger" style={{ flex: 1 }} onClick={() => changeView('dashboard')}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {view === 'chat' && selectedTicket && (
          <div className="chat-container glass-card animate-fade">
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4>{selectedTicket.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dept: {selectedTicket.department} | Estado: {selectedTicket.status}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {user.role !== 'user' && selectedTicket.status !== 'Closed' && (
                  <>
                    <button 
                      type="button"
                      className="btn" 
                      style={{ background: 'var(--warning)', color: 'white', border: 'none' }}
                      onClick={async () => {
                        const newDept = selectedTicket.department === 'Soporte TI' ? 'Mesa de Ayuda' : 'Soporte TI';
                        await updateDepartment(selectedTicket.id, newDept);
                        if (user.role !== 'admin') {
                          changeView('dashboard');
                          setSelectedTicket(null);
                        }
                      }}
                    >
                      Derivar a {selectedTicket.department === 'Soporte TI' ? 'Mesa de Ayuda' : 'Soporte TI'}
                    </button>
                    <button className="btn btn-primary" onClick={() => updateStatus(selectedTicket.id, 'Closed')}>Marcar como Resuelto</button>
                  </>
                )}
              </div>
            </div>
            <div className="chat-messages">
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Inicio de ticket por <strong>{selectedTicket.createdBy}</strong>. <br/>
                <em>{selectedTicket.description}</em>
              </div>
              {messages.map((m, idx) => (
                <div key={idx} className={`message ${m.sender === user.username ? 'own' : ''}`}>
                  <span style={{ fontSize: '0.65rem', opacity: 0.7, display: 'block', marginBottom: '0.2rem' }}>{m.sender}</span>
                  {m.content}
                  <span style={{ fontSize: '0.6rem', opacity: 0.5, display: 'block', textAlign: 'right', marginTop: '0.2rem' }}>{new Date(m.createdAt).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            {selectedTicket.status !== 'Closed' ? (
              <form style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }} onSubmit={(e) => { e.preventDefault(); sendMessage(e.target.msg.value); e.target.msg.value = ''; }}>
                <input name="msg" className="form-control" placeholder="Escribe un mensaje..." autoFocus />
                <button className="btn btn-primary">Enviar</button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--success)', fontWeight: '600' }}>Ticket Resuelto y Cerrado</div>
            )}
          </div>
        )}
      </div>

      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div className="glass-card animate-fade" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>Confirmar Acción</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{showConfirm.text}</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={showConfirm.onConfirm}>Confirmar</button>
              <button className="btn btn-primary" style={{ flex: 1, background: 'var(--glass)' }} onClick={() => setShowConfirm(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
