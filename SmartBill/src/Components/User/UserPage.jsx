import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import apiClient from '../../utils/apiClient';
import './UserPage.css';

const UserPage = () => {
  const { user, isLoading, checkAuthStatus, login } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(user?.profilePicUrl || user?.picture || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await apiClient.getCurrentUser();
        if (cancelled) return;
        // ensure global auth has freshest data
        login(me);
        setFullName(me?.fullName || '');
        setPhoneNumber(me?.phoneNumber || '');
        const existingPic = me?.profilePicUrl || me?.picture || '';
        setProfilePreview(existingPic);
      } catch (e) {
        // fallback to context user if available
        if (user) {
          setFullName(user.fullName || '');
          setPhoneNumber(user.phoneNumber || '');
          const existingPic = user.profilePicUrl || user.picture || '';
          setProfilePreview(existingPic);
        }
        setMessage({ type: 'error', text: toFriendlyError(e) });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    return () => {
      // cleanup preview object URL on unmount if created
      if (profilePreview && profilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  const toFriendlyError = (e) => {
    if (e?.status === 401) return 'Session expired. Please log in again.';
    const msg = e?.message || '';
    const looksLikeNetwork = (!e?.status && (
      /Failed to fetch|NetworkError|TypeError|ERR_NETWORK|ECONNREFUSED|SSL|CORS/i.test(msg)
    ));
    if (looksLikeNetwork) return 'Server problem. Unable to connect to the backend.';
    return msg || 'Something went wrong.';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
  const form = new FormData();
  if (fullName?.trim()) form.append('FullName', fullName.trim());
  if (phoneNumber?.trim()) form.append('PhoneNumber', phoneNumber.trim());
  if (profileFile) form.append('ProfilePic', profileFile);

  const result = await apiClient.put('/User/Update', form);
      setMessage({ type: 'success', text: 'Profile updated.' });
      // refresh auth context to reflect updated user data
      await checkAuthStatus();
    } catch (e) {
      setMessage({ type: 'error', text: toFriendlyError(e) });
    } finally {
      setSaving(false);
    }
  };

  // Render immediately without blocking loaders; background fetch will update fields when ready.

  return (
    <main className="user-page">
      <section className="user-card" aria-labelledby="user-heading">
        {message && (
          <div className={`user-banner ${message.type === 'error' ? 'error' : 'success'}`} role="status" aria-live="polite">
            {message.text}
          </div>
        )}
        <h1 id="user-heading">Your profile</h1>
        <form className="user-form" onSubmit={onSubmit}>
          <div className="user-avatar-row">
            <div className="user-avatar" aria-hidden>
              {profilePreview ? (
                <img src={profilePreview} alt="Profile" className="user-avatar-img" />
              ) : (
                <div className="user-avatar-fallback">{(fullName || 'U').charAt(0).toUpperCase()}</div>
              )}
            </div>
            <label className="user-label file">
              <span>Profile picture</span>
              <input
                type="file"
                accept="image/*"
                className="user-input file"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setProfileFile(f || null);
                  if (f) {
                    // cleanup old
                    if (profilePreview && profilePreview.startsWith('blob:')) {
                      URL.revokeObjectURL(profilePreview);
                    }
                    setProfilePreview(URL.createObjectURL(f));
                  }
                }}
              />
            </label>
          </div>

          <label className="user-label">
            <span>Full name</span>
            <input
              type="text"
              className="user-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
            />
          </label>

          <label className="user-label">
            <span>Phone number</span>
            <input
              type="tel"
              className="user-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. +4670123456"
              autoComplete="tel"
            />
          </label>

          <div className="user-actions">
            <button className="user-save" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default UserPage;
