import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

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
    if (dayMonthKey(date) === dayMonthKey(checkDate)) {
      return true;
    }
  }

  return false;
};

const formatDayMonth = (value) => {
  if (!value) {
    return 'This Week';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'This Week';
  }

  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [weeklyBlessings, setWeeklyBlessings] = useState([]);
  const [blessingsLoading, setBlessingsLoading] = useState(false);
  const [blessingsError, setBlessingsError] = useState('');
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

  useEffect(() => {
    const fetchWeeklyBlessings = async () => {
      try {
        setBlessingsLoading(true);
        setBlessingsError('');

        const response = await axios.get(`${apiBaseUrl}/api/members/weekly-blessings`);
        const members = response.data?.blessings || [];

        const cards = members
          .flatMap((member) => {
            const events = [];
            const birthdayDate = member?.dob ? new Date(member.dob) : null;
            const anniversaryDate = member?.anniversary ? new Date(member.anniversary) : null;

            if (birthdayDate && isWithinPastWeek(birthdayDate)) {
              events.push({
                member,
                type: 'Birthday',
                icon: 'cake',
                dateLabel: formatDayMonth(member.dob),
                note: 'Celebrating life, faith, and fellowship together.',
                key: `${member._id || member.name}-birthday`,
              });
            }

            if (anniversaryDate && isWithinPastWeek(anniversaryDate)) {
              events.push({
                member,
                type: 'Anniversary',
                icon: 'favorite',
                dateLabel: formatDayMonth(member.anniversary),
                note: 'Honoring a covenant journey of love and grace.',
                key: `${member._id || member.name}-anniversary`,
              });
            }

            if (events.length === 0) {
              events.push({
                member,
                type: 'Weekly Blessing',
                icon: 'celebration',
                dateLabel: 'This Week',
                note: 'Giving thanks for God\'s ongoing work in this life.',
                key: `${member._id || member.name}-weekly`,
              });
            }

            return events;
          })
          .slice(0, 3);

        setWeeklyBlessings(cards);
      } catch (error) {
        setWeeklyBlessings([]);
        setBlessingsError(error.response?.data?.message || 'Unable to load recent joys.');
      } finally {
        setBlessingsLoading(false);
      }
    };

    fetchWeeklyBlessings();
  }, [apiBaseUrl]);

  const hasBlessings = useMemo(() => weeklyBlessings.length > 0, [weeklyBlessings]);

  return (
    <div className="bg-background font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />

      <main className="mx-auto max-w-7xl px-8 pb-20 pt-32">
        <section className="relative mb-20">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-high px-4 py-1.5">
                <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Grace &amp; Fellowship</span>
              </div>
              <h1 className="font-headline text-5xl font-bold leading-tight text-on-surface md:text-6xl">
                Welcome back, <br />
                <span className="italic text-primary">Grace Community</span>
              </h1>
              <p className="max-w-lg text-lg font-light leading-relaxed text-on-surface-variant">
                "For where two or three are gathered together in my name, there am I in the midst of them."
                A digital sanctuary for our shared journey.
              </p>
            </div>
            <div className="relative aspect-4/3 w-full flex-1 overflow-hidden rounded-xl shadow-2xl">
              <img
                alt="Sanctuary"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfhG4pfvt4Qu75fuS_Ifcx96X1qqoHVobeTX09J6_6nne1jLfD48VYO5BRfyN8n79LL27xbrs7rphqOAN9vZL5ZlmtLqj2_RPQNK4ywfbNUB-Fy3slRPhOaNarL3xZt1nXW_9--_ZuuIAa0L3M7JTLIV1pILhIOX9FlxFAtSjXoLSYS83CuqSxAQf1rxHkKDafY-6il2Pqucfii-3Mq4h160hd57TwaZ0nuh-ap3OZVuqKZ3Jkb9N7BOUJvXtihemU7mPT2yJ5xhmQ"
              />
              <div className="absolute inset-0 bg-linear-to-t from-on-surface/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 rounded-xl border border-outline-variant/30 bg-surface/90 p-6 backdrop-blur-md">
                <p className="font-headline text-xl italic text-primary">"Peace I leave with you; my peace I give to you."</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-on-surface-variant/70">John 14:27</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-10 flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="font-headline text-3xl font-bold">Recent Joys</h2>
              <p className="text-on-surface-variant">The beautiful celebrations from the past seven days.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/celebrations')}
              className="group flex items-center gap-1 font-medium text-primary transition-all hover:gap-2"
            >
              View Full Archive
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>

          {blessingsLoading ? <p className="text-on-surface-variant">Loading recent joys...</p> : null}
          {blessingsError ? <p className="text-red-600">{blessingsError}</p> : null}

          {hasBlessings ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {weeklyBlessings.map((blessing) => (
                <div key={blessing.key} className="flex min-h-70 flex-col justify-between rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-[0_12px_40px_rgba(115,92,0,0.06)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(115,92,0,0.1)]">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                      style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}
                    >
                      <span className="material-symbols-outlined">{blessing.icon}</span>
                    </div>
                    <span className="rounded bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-container">{blessing.dateLabel}</span>
                  </div>
                  <div className="mt-8">
                    <p className="text-sm font-medium text-on-surface-variant">{blessing.type}</p>
                    <h3 className="mt-1 font-headline text-2xl font-bold">{blessing.member?.name || 'Unknown Member'}</h3>
                    <div className="my-4 h-px w-12 bg-primary-container" />
                    <p className="text-sm italic text-on-surface-variant">{blessing.note}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : !blessingsLoading && !blessingsError ? (
            <p className="text-on-surface-variant">No blessings found for this week.</p>
          ) : null}
        </section>

        <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <div className="flex items-center gap-4">
              <h2 className="font-headline text-3xl font-bold">Highlights</h2>
              <div className="h-px flex-1 bg-outline-variant/30" />
            </div>

            <div className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low shadow-sm md:flex-row">
              <div className="h-64 md:h-auto md:w-1/3">
                <img
                  alt="Choir Practice"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIXdiQlMx7Gvn53GAmcr6V7NVTwzxG6vLehDO04ymIHNFP-oeGXWki-HTi53kcAkNOEv2utxIKQL_Ew1Rn-A3y_gKWsCrcyUAspaY4aetZ0avgRIKI4tDZh-kCP2W-eDdFPWzVEl_hNHvCgyrwR8ykeJSJn5iQdb8dCo6xuB1xfffKtBDcUXa9CynGJ6ID8mvWAfmxOCxNUizY1dBmBevzKN0Tv4k7XqcQtRW4kylciZ-Ed_oy1jS54ce6XcfpFLadvT8iDXcakg0q"
                />
              </div>
              <div className="space-y-4 p-10 md:w-2/3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">calendar_today</span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Sunday Morning • 10:30 AM</span>
                </div>
                <h3 className="font-headline text-3xl font-bold">Harvest Thanksgiving Service</h3>
                <p className="leading-relaxed text-on-surface-variant">
                  Join us for our annual service of gratitude. We will be welcoming five new families into our fold and
                  sharing a community meal following the benediction.
                </p>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    className="rounded-lg px-8 py-3 font-medium text-white shadow-md"
                    style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}
                  >
                    Add to Calendar
                  </button>
                  <button type="button" className="rounded-lg border border-outline-variant px-8 py-3 font-medium text-on-surface transition-colors hover:bg-surface-container">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-4">
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-sm">
              <h3 className="mb-6 font-headline text-xl font-bold">Upcoming This Week</h3>

              <div className="space-y-6">
                <div className="group flex cursor-pointer gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg border border-outline-variant/10 bg-surface-container transition-colors group-hover:bg-primary-fixed">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">Oct</span>
                    <span className="text-lg font-bold leading-none">22</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Bible Study Group</h4>
                    <p className="mt-0.5 text-xs text-on-surface-variant">Parish Hall • 6:30 PM</p>
                  </div>
                </div>

                <div className="group flex cursor-pointer gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg border border-outline-variant/10 bg-surface-container transition-colors group-hover:bg-primary-fixed">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">Oct</span>
                    <span className="text-lg font-bold leading-none">24</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Community Outreach</h4>
                    <p className="mt-0.5 text-xs text-on-surface-variant">Downtown Center • 9:00 AM</p>
                  </div>
                </div>

                <div className="group flex cursor-pointer gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg border border-outline-variant/10 bg-surface-container transition-colors group-hover:bg-primary-fixed">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">Oct</span>
                    <span className="text-lg font-bold leading-none">25</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Youth Fellowship</h4>
                    <p className="mt-0.5 text-xs text-on-surface-variant">Activity Room • 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl p-8 text-white"
              style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}
            >
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-20">church</span>
              <h3 className="relative z-10 font-headline text-2xl italic leading-snug">
                "The bridge we build between hearts is the strongest structure in the world."
              </h3>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
