import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const storedUser = localStorage.getItem('lexa_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Sync with lexa_active_sessions
            const active = JSON.parse(localStorage.getItem('lexa_active_sessions') || '[]');
            if (!active.some(u => u.email.toLowerCase() === parsedUser.email.toLowerCase())) {
                active.push(parsedUser);
                localStorage.setItem('lexa_active_sessions', JSON.stringify(active));
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        let loggedInUser = null;
        if (password === 'password') {
            if (email === 'admin@lexa.com') {
                loggedInUser = { id: 1, name: 'Administrator', email: 'admin@lexa.com', role: 'admin', plan: 'enterprise' };
            } else if (email === 'user@lexa.com') {
                loggedInUser = { id: 2, name: 'Rizky Pratama', email: 'user@lexa.com', role: 'user', plan: 'free' };
            } else if (email === 'rachel@lexa.com') {
                loggedInUser = { id: 3, name: 'Rachel', email: 'rachel@lexa.com', role: 'user', plan: 'free' };
            }
        }

        if (!loggedInUser) {
            const storedUsers = JSON.parse(localStorage.getItem('lexa_registered_users') || '[]');
            const existingUser = storedUsers.find(u => u.email === email && u.password === password);
            if (existingUser) {
                const { password, ...userSession } = existingUser;
                loggedInUser = userSession;
            }
        }

        if (loggedInUser) {
            setUser(loggedInUser);
            localStorage.setItem('lexa_user', JSON.stringify(loggedInUser));

            // Sync to active sessions list
            const active = JSON.parse(localStorage.getItem('lexa_active_sessions') || '[]');
            if (!active.some(u => u.email.toLowerCase() === loggedInUser.email.toLowerCase())) {
                active.push(loggedInUser);
                localStorage.setItem('lexa_active_sessions', JSON.stringify(active));
            }
            return { success: true };
        }

        return { success: false, message: 'Email atau password yang Anda masukkan salah.' };
    };

    const register = async (name, email, password) => {
        const storedUsers = JSON.parse(localStorage.getItem('lexa_registered_users') || '[]');
        
        if (storedUsers.some(u => u.email === email) || email === 'admin@lexa.com' || email === 'user@lexa.com') {
            return { success: false, message: 'Email sudah terdaftar.' };
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role: 'user',
            plan: 'free',
            created_at: new Date().toISOString(),
        };

        storedUsers.push(newUser);
        localStorage.setItem('lexa_registered_users', JSON.stringify(storedUsers));

        const { password: _, ...userSession } = newUser;
        setUser(userSession);
        localStorage.setItem('lexa_user', JSON.stringify(userSession));

        // Sync to active sessions list
        const active = JSON.parse(localStorage.getItem('lexa_active_sessions') || '[]');
        if (!active.some(u => u.email.toLowerCase() === userSession.email.toLowerCase())) {
            active.push(userSession);
            localStorage.setItem('lexa_active_sessions', JSON.stringify(active));
        }

        return { success: true };
    };

    const logout = (emailToLogout = null) => {
        const targetEmail = emailToLogout || user?.email;
        if (!targetEmail) return;

        let active = JSON.parse(localStorage.getItem('lexa_active_sessions') || '[]');
        active = active.filter(u => u.email.toLowerCase() !== targetEmail.toLowerCase());
        localStorage.setItem('lexa_active_sessions', JSON.stringify(active));

        // If the logged out user is the current active user
        if (user && user.email.toLowerCase() === targetEmail.toLowerCase()) {
            if (active.length > 0) {
                // Switch to the first remaining active session
                const nextUser = active[0];
                setUser(nextUser);
                localStorage.setItem('lexa_user', JSON.stringify(nextUser));
            } else {
                // No more active sessions, clear everything
                setUser(null);
                localStorage.removeItem('lexa_user');
                localStorage.removeItem('lexa_active_sessions');
            }
        } else {
            // Trigger a re-render of user to refresh dropdown items
            setUser({ ...user });
        }
    };

    const upgradePlan = (newPlan) => {
        if (user) {
            const updatedUser = { ...user, plan: newPlan };
            setUser(updatedUser);
            localStorage.setItem('lexa_user', JSON.stringify(updatedUser));
            
            // Sync inside lexa_active_sessions as well
            const active = JSON.parse(localStorage.getItem('lexa_active_sessions') || '[]');
            const idx = active.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
            if (idx !== -1) {
                active[idx] = updatedUser;
                localStorage.setItem('lexa_active_sessions', JSON.stringify(active));
            }
        }
    };

    const updateUser = (updatedFields) => {
        if (user) {
            const updatedUser = { ...user, ...updatedFields };
            setUser(updatedUser);
            localStorage.setItem('lexa_user', JSON.stringify(updatedUser));
            
            // Sync inside lexa_active_sessions
            const active = JSON.parse(localStorage.getItem('lexa_active_sessions') || '[]');
            const idx = active.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
            if (idx !== -1) {
                active[idx] = updatedUser;
                localStorage.setItem('lexa_active_sessions', JSON.stringify(active));
            }

            // Also update in registered users array if present
            const storedUsers = JSON.parse(localStorage.getItem('lexa_registered_users') || '[]');
            const index = storedUsers.findIndex(u => u.email === user.email);
            if (index !== -1) {
                storedUsers[index] = { ...storedUsers[index], ...updatedFields };
                localStorage.setItem('lexa_registered_users', JSON.stringify(storedUsers));
            }
        }
    };

    const switchAccount = (email) => {
        const active = JSON.parse(localStorage.getItem('lexa_active_sessions') || '[]');
        const targetUser = active.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (targetUser) {
            setUser(targetUser);
            localStorage.setItem('lexa_user', JSON.stringify(targetUser));
            return true;
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, upgradePlan, updateUser, switchAccount }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
