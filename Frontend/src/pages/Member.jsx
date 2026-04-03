import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import logo from '../assets/logo.png';

const emptyMember = {
  id: '',
  role: 'Member',
  name: 'No member selected',
  quote: 'Search for a member to view details.',
  email: '-',
  phone: '-',
  addressLine1: '-',
  addressLine2: '-',
  birthday: '-',
  anniversary: '-',
  songTitle: 'N/A',
  songDescription: 'No details available.',
  prayer: 'No prayer note available.',
  updatedAt: 'Not available',
  image:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=900&q=80',
  history: [],
};

const formatDate = (value) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const mapApiMemberToUi = (member) => {
  const spouseName = member?.spouse?.name;
  const category = member?.category || 'Elders';

  return {
    id: member?._id || '',
    role: category,
    name: member?.name || [member?.firstName, member?.lastName].filter(Boolean).join(' ') || 'Unknown Member',
    quote: spouseName ? `Spouse: ${spouseName}` : 'Walking in grace and fellowship.',
    email: member?.email || '-',
    phone: member?.phone || '-',
    addressLine1: member?.familyName || '-',
    addressLine2: member?.gender ? `Gender: ${member.gender}` : '-',
    birthday: formatDate(member?.dob),
    anniversary: formatDate(member?.anniversary),
    songTitle: 'Faith Journey',
    songDescription: `Serving in ${category}.`,
    prayer: 'Praying for growth, peace, and guidance.',
    updatedAt: member?.updatedAt ? `Updated ${new Date(member.updatedAt).toLocaleDateString()}` : 'Updated recently',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80',
    history: [
      {
        day: '01',
        title: 'Member Profile Updated',
        date: member?.updatedAt ? new Date(member.updatedAt).toLocaleDateString() : 'Recently',
        description: `${member?.name || 'Member'} profile synced from backend records.`,
      },
    ],
  };
};

const Member = () => {
  const location = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [isEditTabOpen, setIsEditTabOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    familyName: '',
    gender: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

  useEffect(() => {
    const incomingMember = location.state?.member;

    if (!incomingMember) {
      return;
    }

    const mappedMember = mapApiMemberToUi(incomingMember);
    setMembers([mappedMember]);
    setSelectedMemberId(mappedMember.id);
    setSearchInput(mappedMember.name === 'Unknown Member' ? '' : mappedMember.name);
    setSearchQuery('');
    setErrorMessage('');
  }, [location.state]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      if (location.state?.member) {
        setLoading(false);
        return undefined;
      }

      setMembers([]);
      setSelectedMemberId('');
      setErrorMessage('');
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await axios.get(`${apiBaseUrl}/api/members/search`, {
          params: { name: trimmedQuery },
          signal: controller.signal,
        });

        const mappedMembers = (response.data?.members || []).map(mapApiMemberToUi);
        setMembers(mappedMembers);

        if (mappedMembers.length > 0) {
          setSelectedMemberId((currentId) => (currentId && mappedMembers.some((member) => member.id === currentId) ? currentId : mappedMembers[0].id));
        } else {
          setSelectedMemberId('');
        }
      } catch (error) {
        if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
          return;
        }

        setMembers([]);
        setSelectedMemberId('');
        setErrorMessage(error.response?.data?.message || 'Unable to fetch members from backend.');
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [apiBaseUrl, searchQuery, location.state]);

  const selectedMember = members.find((member) => member.id === selectedMemberId) || members[0] || emptyMember;
  const isInitialState = !searchQuery.trim() && members.length === 0 && !loading && !errorMessage;
  const noSearchResults = searchQuery.trim() && !loading && members.length === 0 && !errorMessage;
  const showEmptyState = isInitialState || noSearchResults;

  useEffect(() => {
    setEditForm({
      name: selectedMember.name === emptyMember.name ? '' : selectedMember.name,
      email: selectedMember.email === '-' ? '' : selectedMember.email,
      phone: selectedMember.phone === '-' ? '' : selectedMember.phone,
      familyName: selectedMember.addressLine1 === '-' ? '' : selectedMember.addressLine1,
      gender: selectedMember.addressLine2.startsWith('Gender: ') ? selectedMember.addressLine2.replace('Gender: ', '') : '',
      category: selectedMember.role === emptyMember.role ? '' : selectedMember.role,
    });
    setIsEditTabOpen(false);
    setSaveMessage('');
    setSaveError('');
  }, [selectedMember.id]);

  const handleSearch = () => {
    const trimmedQuery = searchInput.trim();
    setSearchQuery(trimmedQuery);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const handleEditSave = async (event) => {
    event.preventDefault();

    if (!selectedMember.id) {
      return;
    }

    setSaveLoading(true);
    setSaveMessage('');
    setSaveError('');

    const [firstName = '', ...lastNameParts] = editForm.name.trim().split(' ');
    const lastName = lastNameParts.join(' ');

    const payload = {
      name: editForm.name.trim(),
      firstName,
      lastName,
      email: editForm.email.trim() || undefined,
      phone: editForm.phone.trim() || undefined,
      familyName: editForm.familyName.trim() || undefined,
      gender: editForm.gender.trim() || undefined,
      category: editForm.category.trim() || undefined,
    };

    try {
      await axios.put(`${apiBaseUrl}/api/members/${selectedMember.id}`, payload);

      setMembers((currentMembers) =>
        currentMembers.map((member) =>
          member.id === selectedMember.id
            ? {
                ...member,
                name: editForm.name || member.name,
                email: editForm.email || '-',
                phone: editForm.phone || '-',
                addressLine1: editForm.familyName || '-',
                addressLine2: editForm.gender ? `Gender: ${editForm.gender}` : '-',
                role: editForm.category || member.role,
                songDescription: `Serving in ${editForm.category || member.role}.`,
              }
            : member
        )
      );

      setSaveMessage('Member updated successfully.');
      setIsEditTabOpen(false);
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Failed to update member.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember.id || deleteLoading) {
      return;
    }

    const isConfirmed = window.confirm(`Delete ${selectedMember.name}? This action cannot be undone.`);
    if (!isConfirmed) {
      return;
    }

    setDeleteLoading(true);
    setSaveMessage('');
    setSaveError('');

    try {
      await axios.delete(`${apiBaseUrl}/api/members/${selectedMember.id}`);

      setMembers((currentMembers) => {
        const filteredMembers = currentMembers.filter((member) => member.id !== selectedMember.id);
        setSelectedMemberId(filteredMembers[0]?.id || '');
        return filteredMembers;
      });

      setIsEditTabOpen(false);
      setSaveMessage('Member deleted successfully.');
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Failed to delete member.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />

      <main className="mx-auto mt-32 mb-20 w-full max-w-7xl grow px-8">
        <section className="mb-10 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(115,92,0,0.05)]">
          <div className="mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">search</span>
            <h2 className="font-headline text-2xl font-bold">Search Members</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative grow">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60">manage_search</span>
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Type member name to search backend"
              className="w-full rounded-xl border border-outline-variant/30 bg-surface px-11 py-3 outline-none transition-colors focus:border-primary"
            />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading || !searchInput.trim()}
              className="rounded-xl px-6 py-3 font-semibold text-white shadow-[0_10px_24px_rgba(115,92,0,0.2)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}
            >
              Search
            </button>
          </div>

          {loading ? <p className="mt-3 text-sm text-on-surface-variant">Searching members...</p> : null}
          {errorMessage ? <p className="mt-3 text-sm text-red-600">{errorMessage}</p> : null}
          {saveMessage ? <p className="mt-3 text-sm text-emerald-700">{saveMessage}</p> : null}
          {saveError ? <p className="mt-3 text-sm text-red-600">{saveError}</p> : null}

          <div className="mt-4 flex flex-wrap gap-3">
            {members.length > 0 ? (
              members.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setSelectedMemberId(member.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedMember.id === member.id
                      ? 'border-primary bg-primary text-white'
                      : 'border-outline-variant/30 bg-surface-container-low text-on-surface hover:border-primary hover:text-primary'
                  }`}
                >
                  {member.name}
                </button>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant">Type a name and click Search.</p>
            )}
          </div>
        </section>

        {showEmptyState ? (
          <section className="mb-16 flex min-h-95 items-center justify-center rounded-3xl border border-dashed border-outline-variant/35 bg-surface-container-low">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-primary/70">{isInitialState ? 'group' : 'person_off'}</span>
              <h3 className="mt-4 font-headline text-3xl font-bold text-on-surface">{isInitialState ? 'Search Members' : 'No Member Found'}</h3>
              <p className="mt-2 text-on-surface-variant">
                {isInitialState
                  ? 'Search for members by name to view their profiles and details. Start by typing a name in the search box above and clicking the Search button.'
                  : `"${searchQuery}" didn't match any members. Please try a different name or check for typos and search again.`}
              </p>
            </div>
          </section>
        ) : (
          <>
            <section className="relative mb-16">
              <div className="flex flex-col items-center gap-10 md:flex-row md:items-end">
                <div className="relative group">
                  <div
                    className="h-48 w-48 rounded-full p-1.5 shadow-xl"
                    style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}
                  >
                    <div className="h-full w-full overflow-hidden rounded-full border-4 border-surface-container-lowest bg-surface-container-low">
                      <img
                        alt="BlessingBridge Logo"
                        className="h-full w-full rounded-full object-cover"
                        src={logo}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest p-2 text-primary shadow-lg transition-transform hover:scale-105"
                    onClick={() => setIsEditTabOpen((prev) => !prev)}
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>

                <div className="grow space-y-2 text-center md:text-left">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">{selectedMember.role}</span>
                  <h1 className="font-headline text-5xl font-bold tracking-tight">{selectedMember.name}</h1>
                  <p className="font-headline text-lg italic text-on-surface-variant">"{selectedMember.quote}"</p>
                </div>

                <div className="flex gap-4 pb-2">
                  <button
                    type="button"
                    className="border-b-2 border-outline-variant px-6 py-2 font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
                  >
                    Send Message
                  </button>
                  <button
                    type="button"
                    className="rounded-lg px-6 py-2 font-medium text-white shadow-md transition-all active:scale-95"
                    style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}
                  >
                    Request prayer
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteMember}
                    disabled={!selectedMember.id || deleteLoading}
                    className="rounded-lg bg-red-600 px-6 py-2 font-medium text-white shadow-md transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete Member'}
                  </button>
                </div>
              </div>
            </section>

            {isEditTabOpen ? (
              <section className="mb-10 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(115,92,0,0.05)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-headline text-2xl font-bold text-on-surface">Edit Member</h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Edit Tab</span>
                </div>

                <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleEditSave}>
                  <label className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Full Name</span>
                    <input
                      name="name"
                      type="text"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Email</span>
                    <input
                      name="email"
                      type="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Phone</span>
                    <input
                      name="phone"
                      type="text"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Family Name</span>
                    <input
                      name="familyName"
                      type="text"
                      value={editForm.familyName}
                      onChange={handleEditChange}
                      className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary"
                    />
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Gender</span>
                    <input
                      name="gender"
                      type="text"
                      value={editForm.gender}
                      onChange={handleEditChange}
                      placeholder="Male / Female"
                      className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary"
                    />
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Category</span>
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary"
                    >
                      <option value="">Select category</option>
                      <option value="Member">Member</option>
                      <option value="Elders">Elders</option>
                      <option value="Youth">Youth</option>
                      <option value="Choir">Choir</option>
                      <option value="Pastoral Care">Pastoral Care</option>
                    </select>
                  </label>

                  <div className="mt-2 flex gap-3 md:col-span-2 md:justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditTabOpen(false)}
                      className="rounded-xl border border-outline-variant/30 px-5 py-2.5 font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="rounded-xl px-5 py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}
                    >
                      {saveLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </section>
            ) : null}

            <section className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="space-y-8 md:col-span-4">
            <article className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-[0_12px_40px_rgba(115,92,0,0.06)]">
              <h3 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
                Special Occasions
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Birthday</p>
                    <p className="font-headline text-lg">{selectedMember.birthday}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary">cake</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Anniversary</p>
                    <p className="font-headline text-lg">{selectedMember.anniversary}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary">favorite</span>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-[0_12px_40px_rgba(115,92,0,0.06)]">
              <h3 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold">
                <span className="material-symbols-outlined text-primary">contact_page</span>
                Connection
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant/60">mail</span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant">Email</p>
                    <p>{selectedMember.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant/60">call</span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant">Phone</p>
                    <p>{selectedMember.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant/60">location_on</span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant">Details</p>
                    <p>
                      {selectedMember.addressLine1}
                      <br />
                      {selectedMember.addressLine2}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="space-y-8 md:col-span-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <article className="relative overflow-hidden rounded-xl bg-surface-container-low p-8">
                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-on-surface/5">music_note</span>
                <h3 className="mb-4 font-headline text-lg font-bold text-primary">Heart&apos;s Song</h3>
                <p className="font-headline text-2xl italic">"{selectedMember.songTitle}"</p>
                <p className="mt-4 leading-relaxed text-on-surface-variant">{selectedMember.songDescription}</p>
              </article>

              <article className="rounded-xl border-l-4 border-primary bg-surface-container-low p-8 shadow-sm">
                <h3 className="mb-4 font-headline text-lg font-bold text-primary">Current Prayer</h3>
                <p className="font-medium italic text-on-surface">"{selectedMember.prayer}"</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs">history</span>
                  {selectedMember.updatedAt}
                </div>
              </article>
            </div>

            <article className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-[0_12px_40px_rgba(115,92,0,0.06)]">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="font-headline text-2xl font-bold">Blessing History</h3>
                <button type="button" className="text-sm font-semibold text-primary hover:underline">
                  View Full Archive
                </button>
              </div>

              <div className="space-y-6">
                {selectedMember.history.length > 0 ? (
                  selectedMember.history.map((item, index) => (
                    <div key={item.title} className="group flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container font-headline text-lg font-bold text-primary">
                          {item.day}
                        </div>
                        {index < selectedMember.history.length - 1 ? <div className="my-2 w-0.5 grow bg-outline-variant/20" /> : null}
                      </div>
                      <div className={index < selectedMember.history.length - 1 ? 'grow pb-8' : 'grow'}>
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-headline text-lg font-semibold transition-colors group-hover:text-primary">{item.title}</h4>
                          <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold text-on-surface-variant">{item.date}</span>
                        </div>
                        <p className="mt-2 leading-relaxed text-on-surface-variant">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-on-surface-variant">No history entries available for this member.</p>
                )}
              </div>
            </article>
          </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Member;
