import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const highlights = [
  {
    icon: 'church',
    title: 'Sunday Worship',
    text: 'A warm gathering centered on scripture, music, and prayer.',
  },
  {
    icon: 'volunteer_activism',
    title: 'Community Care',
    text: 'Hands-on outreach that supports families across our city.',
  },
  {
    icon: 'family_restroom',
    title: 'Family Ministry',
    text: 'Programs for children, youth, and parents to grow together.',
  },
];

const upcomingEvents = [
  { day: 'Sun', date: '07', title: 'Morning Service', detail: 'Main Sanctuary • 9:30 AM' },
  { day: 'Wed', date: '10', title: 'Bible Study', detail: 'Fellowship Hall • 6:30 PM' },
  { day: 'Sat', date: '13', title: 'Outreach Drive', detail: 'Community Center • 10:00 AM' },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />

      {/* hero section */}
      <section class="relative h-screen flex items-center justify-center overflow-hidden">
<div class="absolute inset-0 z-0">
<img class="w-full h-full object-cover brightness-[0.7]" data-alt="Stunning architectural view of a modern church interior with warm sunlight streaming through high windows onto wooden pews" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe01EmLM9iSAjc7-K0kkUM8XqhW0yAwZgPo5EOoq9n9ygLZltXR2Mb-IeCPu3EUR4L2GOMx8-V1vqkB5D1p19t3EDkl1FZwiWIny6SMrfOXfmYdRsCKsvdvmaVmcaiXtimIn32zVcc5I24krmQ84WnrDOKmcPSDF_zx-uMvnosXad0KLmdoT8_5qkVnQ3YGrXuRAQ2rdL6JMSYfrTXeof5UULkoYlJVvaJ_-LHoOthGLIcrpM3ppHD5d_kko_uE9gZrX6qVqdVlGJy"/>
</div>
<div class="relative z-10 text-center px-6 max-w-4xl">
<h1 class="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-sm">A Sanctuary of Grace &amp; Community</h1>
<p class="text-xl md:text-2xl text-white/90 font-body font-light mb-10 tracking-wide max-w-2xl mx-auto">
                    Dedicated to nurturing faith, fostering hope, and building a bridge of blessing to our community and beyond.
                </p>
<div class="flex justify-center gap-4">

</div>
</div>
</section>

      <main className="overflow-hidden pt-20">
        <section className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(115,92,0,0.16),transparent_30%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-8 py-20 lg:grid-cols-1 lg:py-28">
            <div className="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-lowest px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Grace. Fellowship. Service.
              </div>

              <div className="space-y-5">
                <h1 className="font-headline text-5xl font-bold leading-tight text-on-surface md:text-6xl lg:text-7xl">
                  A digital home for faith and community.
                </h1>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
                  BlessingBridge brings worship, outreach, and family connection into one shared place.
                  Stay close to services, announcements, and the people walking alongside you.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  className="rounded-xl px-8 py-3.5 font-medium text-white shadow-lg shadow-primary/20 transition-transform duration-150 active:scale-95"
                  style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}
                  onClick={() => navigate('/dashboard')}
                >
                  Enter Dashboard
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-8 py-3.5 font-medium text-on-surface transition-colors hover:bg-surface-container"
                  onClick={() => document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Ministries
                </button>
              </div>

              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  ['1,200+', 'Community members'],
                  ['18', 'Weekly gatherings'],
                  ['9:30 AM', 'Sunday service'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-[0_12px_40px_rgba(115,92,0,0.06)]">
                    <div className="font-headline text-2xl font-bold text-primary">{value}</div>
                    <div className="mt-1 text-sm text-on-surface-variant">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="highlights" className="bg-surface-container-low px-8 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">What We Offer</p>
                <h2 className="mt-2 font-headline text-3xl font-bold text-on-surface md:text-4xl">Spaces designed for real life.</h2>
              </div>
              <p className="max-w-2xl text-on-surface-variant">
                Every part of the experience is built to help people connect, serve, and keep moving forward together.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {highlights.map((item) => (
                <article key={item.title} className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-7 shadow-[0_12px_40px_rgba(115,92,0,0.06)] transition-transform duration-200 hover:-translate-y-1">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: 'linear-gradient(45deg, #735c00 0%, #d4af37 100%)' }}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-on-surface-variant">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-8 py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12">
            <div className="rounded-4xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-[0_16px_50px_rgba(115,92,0,0.08)] lg:col-span-8">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">This Week</p>
                  <h2 className="mt-2 font-headline text-3xl font-bold text-on-surface">Upcoming gatherings</h2>
                </div>
                <button type="button" className="hidden rounded-full border border-outline-variant/30 px-4 py-2 text-sm font-medium text-on-surface-variant md:inline-flex" onClick={() => navigate('/dashboard')}>
                  View dashboard
                </button>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.title} className="flex items-center gap-4 rounded-2xl bg-surface-container-low px-4 py-4">
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">{event.day}</span>
                      <span className="font-headline text-2xl font-bold text-on-surface">{event.date}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-on-surface">{event.title}</h3>
                      <p className="text-sm text-on-surface-variant">{event.detail}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-4xl border border-outline-variant/20 bg-[linear-gradient(135deg,rgba(115,92,0,0.96),rgba(212,175,55,0.94))] p-8 text-white shadow-[0_16px_50px_rgba(115,92,0,0.18)] lg:col-span-4">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/80">Get Connected</p>
              <h2 className="mt-3 font-headline text-3xl font-bold leading-tight">Join a place where your next step is clear.</h2>
              <p className="mt-4 leading-relaxed text-white/85">
                Whether you are visiting for the first time or returning after a long season, there is room for you here.
              </p>

              <div className="mt-8 space-y-4">
                {['Prayer requests', 'Volunteer opportunities', 'Family events'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                    <span className="material-symbols-outlined text-white">check_circle</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-8 w-full rounded-xl bg-white px-6 py-3.5 font-semibold text-[#735c00] transition-transform duration-150 active:scale-95"
                onClick={() => navigate('/dashboard')}
              >
                Open Dashboard
              </button>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;