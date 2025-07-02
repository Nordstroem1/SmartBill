import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, isAuthenticated, logout } from '../../utils/auth';
import './Dashboard.css';

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        // Get user data
        const userData = getStoredUser();
        setUser(userData);
    }, [navigate]);

    const handleLogout = async () => {
        await logout();
        // logout() will redirect to login page
    };

    if (!user) {
        return (
            <div className="dashboard">
                <div className="loading">Laddar...</div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="dashboard-user-info">
                    {user.picture && (
                        <img 
                            src={user.picture} 
                            alt="Profile" 
                            className="user-avatar"
                        />
                    )}
                    <div className="user-details">
                        <h2>Välkommen, {user.name}!</h2>
                        <p>{user.email}</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="logout-btn"
                >
                    Logga ut
                </button>
            </header>
            <main className="dashboard-content">
                <h1>Dashboard</h1>
                <p>Du är nu inloggad och kan använda SmartBill!</p>
                
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <h3>Fakturor</h3>
                        <p>Hantera dina fakturor</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Kunder</h3>
                        <p>Hantera dina kunder</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Rapporter</h3>
                        <p>Se dina rapporter</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;