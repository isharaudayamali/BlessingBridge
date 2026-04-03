import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const formatDate = (value) => {
  if (!value) {
    return 'Unknown Date';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown Date';
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const dayMonthKey = (date) => `${date.getMonth() + 1}-${date.getDate()}`;

const isWithinPastWeek = (date, anchorDate = new Date()) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return false;
  }

  const startDate = new Date(anchorDate);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 6);

  for (let offset = 0; offset <= 6; offset += 1) {
    const checkDate = new Date(startDate);
    checkDate.setDate(startDate.getDate() + offset);

    if (dayMonthKey(checkDate) === dayMonthKey(date)) {
      return true;
    }
  }

  return false;
};

const buildArchiveEvents = (members) => {
  const events = members.flatMap((member) => {
    const result = [];
    const memberName = member?.name || [member?.firstName, member?.lastName].filter(Boolean).join(' ') || 'Unknown Member';

    const birthdayDate = member?.dob ? new Date(member.dob) : null;
    if (birthdayDate && isWithinPastWeek(birthdayDate)) {
      result.push({
        key: `${member._id || memberName}-birthday`,
        member,
        type: 'Birthday',
        icon: 'cake',
        memberName,
        dateLabel: formatDate(member.dob),
        category: member?.category || 'Elders',
        note: 'Celebrating life, faith, and fellowship together.',
      });
    }

    const anniversaryDate = member?.anniversary ? new Date(member.anniversary) : null;
    if (anniversaryDate && isWithinPastWeek(anniversaryDate)) {
      result.push({
        key: `${member._id || memberName}-anniversary`,
        member,
        type: 'Anniversary',
        icon: 'favorite',
        memberName,
        dateLabel: formatDate(member.anniversary),
        category: member?.category || 'Elders',
        note: 'Honoring a covenant journey of love and grace.',
      });
    }

    return result;
  });

  return events.sort((left, right) => left.dateLabel.localeCompare(right.dateLabel));
};

const Celebrations = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

  useEffect(() => {
    const loadArchive = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(`${apiBaseUrl}/api/members/weekly-blessings`);
        const members = response.data?.blessings || [];
        setEvents(buildArchiveEvents(members));
      } catch (requestError) {
        setEvents([]);
        setError(requestError.response?.data?.message || 'Unable to load celebration archive.');
      } finally {
        setLoading(false);
      }
    };

    loadArchive();
  }, [apiBaseUrl]);

  const summary = useMemo(() => {
    const birthdays = events.filter((event) => event.type === 'Birthday').length;
    const anniversaries = events.filter((event) => event.type === 'Anniversary').length;

    return {
      total: events.length,
      birthdays,
      anniversaries,
    };
  }, [events]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-8 pb-16 pt-28">
        <section className="mb-10 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-[0_12px_40px_rgba(115,92,0,0.06)] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Celebrations</p>
          <h1 className="mt-3 font-headline text-4xl font-bold md:text-5xl">Full Archive</h1>
          <p className="mt-3 max-w-2xl text-on-surface-variant">
            A full list of this week&apos;s birthdays and anniversaries gathered from member records.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Total Events</p>
              <p className="mt-2 font-headline text-3xl font-bold text-primary">{summary.total}</p>
            </div>
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Birthdays</p>
              <p className="mt-2 font-headline text-3xl font-bold text-primary">{summary.birthdays}</p>
            </div>
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Anniversaries</p>
              <p className="mt-2 font-headline text-3xl font-bold text-primary">{summary.anniversaries}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-[0_12px_40px_rgba(115,92,0,0.06)] md:p-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-headline text-2xl font-bold">Archive Timeline</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">This Week</span>
          </div>

          {loading ? <p className="text-on-surface-variant">Loading archive...</p> : null}
          {error ? <p className="text-red-600">{error}</p> : null}

          {!loading && !error && events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-outline-variant/35 bg-surface-container-low p-10 text-center">
              <span className="material-symbols-outlined text-5xl text-primary/70">event_busy</span>
              <p className="mt-4 text-on-surface-variant">No celebration events found for this week.</p>
            </div>
          ) : null}

          {!loading && !error && events.length > 0 ? (
            <div className="space-y-5">
              {events.map((event, index) => (
                <button
                  key={event.key}
                  type="button"
                  onClick={() => navigate('/members', { state: { member: event.member } })}
                  className="w-full rounded-2xl border border-outline-variant/15 bg-surface-container-low p-5 text-left transition-all hover:border-primary/40 hover:shadow-[0_10px_24px_rgba(115,92,0,0.12)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}
                      >
                        <span className="material-symbols-outlined">{event.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{event.type}</p>
                        <h3 className="mt-1 font-headline text-2xl font-bold">{event.memberName}</h3>
                        <p className="mt-2 text-on-surface-variant">{event.note}</p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm font-semibold text-on-surface">{event.dateLabel}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-on-surface-variant">{event.category}</p>
                      <p className="mt-2 text-xs text-on-surface-variant">Record #{index + 1}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Celebrations;
