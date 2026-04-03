import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const initialFormData = {
  firstName: '',
  lastName: '',
  familyName: '',
  email: '',
  phone: '',
  gender: '',
  category: 'Member',
  dob: '',
  anniversary: '',
};

const toDateInputValue = (value) => {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString().slice(0, 10);
};

const AddMember = () => {
  const location = useLocation();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

  useEffect(() => {
    const incomingMember = location.state?.member;
    if (!incomingMember) {
      return;
    }

    const [splitFirstName = '', ...lastNameParts] = (incomingMember.name || '').trim().split(' ');
    const incomingFirstName = incomingMember.firstName || splitFirstName;
    const incomingLastName = incomingMember.lastName || lastNameParts.join(' ');

    setFormData({
      firstName: incomingFirstName || '',
      lastName: incomingLastName || '',
      familyName: incomingMember.familyName || '',
      email: incomingMember.email || '',
      phone: incomingMember.phone || '',
      gender: incomingMember.gender || '',
      category: incomingMember.category || 'Member',
      dob: toDateInputValue(incomingMember.dob),
      anniversary: toDateInputValue(incomingMember.anniversary),
    });
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const memberPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        familyName: formData.familyName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        category: formData.category,
        dob: formData.dob,
        anniversary: formData.anniversary,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      };

      await axios.post(`${apiBaseUrl}/api/members`, memberPayload);
      setFormData(initialFormData);
      alert('Member added successfully.');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error saving member';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-8 pb-20 pt-32">
        <header className="mb-12 text-center md:text-left">
          <h1 className="font-headline text-4xl font-bold italic text-primary md:text-5xl">Expand the Community</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            Add a new member to BlessingBridge. Every name recorded is another story of grace and belonging.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-4">
            <div className="relative overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low p-7">
              <span className="material-symbols-outlined mb-3 block text-4xl text-primary">auto_awesome</span>
              <h2 className="font-headline text-2xl font-bold">Member Details</h2>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                Use accurate dates so the church family can celebrate birthdays and anniversaries together.
              </p>
              <span className="material-symbols-outlined pointer-events-none absolute -bottom-3 -right-3 text-8xl text-primary/10">church</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-outline-variant/20 shadow-[0_12px_40px_rgba(115,92,0,0.06)]">
              <img
                alt="A calm river with trees at sunset"
                className="h-80 w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaHyIAFxntxbyoMTXwaqxT_aQH0MBcAAAujYk5wRqK7b0aslYNORKawS9_BSTHylpVYQBZr4gcuaO8aYOaKIUWaxDtSeUkJ_dZxcRJEw8V-PWnHJdTIwM-lUuJ4bY7kfTramzzT30dP76fAKyVSnbbgdUT03iErLyowewX7qnNKd38mmHv7yLooehUcFCHUcadbmMDkzfigZly07UIs3zN43yAhQv778AN1YpAHCDgWluG2oQmGaOO4D3Ck2_dXgh_4q8UfmPwmnWY"
              />
            </div>
          </aside>

          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-[0_12px_40px_rgba(115,92,0,0.04)] lg:col-span-8 md:p-10">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <section>
                <h2 className="mb-5 border-b border-outline-variant/15 pb-2 text-xs font-semibold uppercase tracking-[0.22em] text-outline">
                  Personal Identity
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-outline-variant">First Name</span>
                    <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary" placeholder="Gabriel" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-outline-variant">Last Name</span>
                    <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary" placeholder="Thorne" />
                  </label>
                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-outline-variant">Family Name</span>
                    <input name="familyName" type="text" value={formData.familyName} onChange={handleChange} className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary" placeholder="The Thorne Household" />
                  </label>
                </div>
              </section>

              <section>
                <h2 className="mb-5 border-b border-outline-variant/15 pb-2 text-xs font-semibold uppercase tracking-[0.22em] text-outline">
                  Reach & Connection
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-outline-variant">Email Address</span>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary" placeholder="grace@example.com" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-outline-variant">Phone Number</span>
                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary" placeholder="+94 77 123 4567" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-outline-variant">Gender</span>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-outline-variant">Category</span>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary"
                    >
                      <option value="Member">Member</option>
                      <option value="Elders">Elders</option>
                      <option value="Youth">Youth</option>
                      <option value="Choir">Choir</option>
                      <option value="Pastoral Care">Pastoral Care</option>
                    </select>
                  </label>
                </div>
              </section>

              <section>
                <h2 className="mb-5 border-b border-outline-variant/15 pb-2 text-xs font-semibold uppercase tracking-[0.22em] text-outline">
                  Life Milestones
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-outline-variant">Date of Birth</span>
                    <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-outline-variant">Anniversary Date (Optional)</span>
                    <input name="anniversary" type="date" value={formData.anniversary} onChange={handleChange} className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none transition-colors focus:border-primary" />
                  </label>
                </div>
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/15 pt-6 sm:flex-row sm:justify-end">
                <button type="button" className="rounded-xl border border-outline-variant/30 px-6 py-3 font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-7 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(115,92,0,0.2)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AddMember;
