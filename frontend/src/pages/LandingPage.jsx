
import { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  DoorOpen,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Moon,
  ShieldCheck,
  Sun,
  Users,
  Wallet,
  X,
  ClipboardCheck,
  Utensils,
  Bell,
  UserRound,
  Wrench,
  Clock,
  Mail,
  Phone,
} from 'lucide-react'
import { useTheme } from '../context/useTheme'
import campusHero from '../assets/campusone-hero.png'
const platformItems = [
  { title: 'Hostel admissions', description: 'Applications and approval workflows', icon: ClipboardCheck, href: '#admissions' },
  { title: 'Room allocation', description: 'Room availability and occupancy', icon: DoorOpen, href: '#rooms' },
  { title: 'Fees and payments', description: 'Payment records and receipts', icon: Wallet, href: '#fees' },
  { title: 'Leave management', description: 'Requests and approval tracking', icon: FileText, href: '#leave' },
  { title: 'Complaints', description: 'Maintenance and issue tracking', icon: Wrench, href: '#complaints' },
  { title: 'Attendance and visitors', description: 'Entry, exit and visitor records', icon: Clock, href: '#attendance' },
  { title: 'Mess and announcements', description: 'Menus and campus updates', icon: Utensils, href: '#mess' },
]

const roleItems = [
  { title: 'For students', description: 'Manage your hostel life in one place', icon: UserRound, href: '#students' },
  { title: 'For wardens', description: 'Coordinate daily hostel operations', icon: ShieldCheck, href: '#wardens' },
  { title: 'For administrators', description: 'Oversee hostels, users and reports', icon: LayoutDashboard, href: '#administrators' },
]

const resourceItems = [
  { title: 'Help and FAQs', description: 'Answers to common questions', icon: HelpCircle, href: '#faqs' },
  { title: 'Privacy policy', description: 'Privacy, Data protection and cookie information', icon: ShieldCheck, href: '#privacy' },
  { title: 'Terms and conditions', description: 'Platform usage and responsibilities', icon: FileText, href: '#terms' },
  { title: 'Feedback', description: 'Share ideas and suggestions', icon: MessageSquare, href: '#feedback' },
]

const features = [
  {
    id: 'admissions',
    number: '01',
    title: 'Admissions without the paperwork',
    description: 'Give students a clear application journey while staff review submissions and manage approvals.',
    icon: ClipboardCheck,
    size: 'lg:col-span-2',
    label: 'APPLICATIONS',
  },
  {
    id: 'rooms',
    number: '02',
    title: 'Know your rooms',
    description: 'Organize room assignments, bed availability and hostel occupancy.',
    icon: DoorOpen,
    size: '',
    label: 'ROOMS',
  },
  {
    id: 'fees',
    number: '03',
    title: 'Keep fee records organized',
    description: 'Track dues, payment history and receipts in one place.',
    icon: CreditCard,
    size: '',
    label: 'FINANCE',
  },
  {
    id: 'leave',
    number: '04',
    title: 'Leave requests, made clearer',
    description: 'Submit requests, review decisions and keep a record of approvals.',
    icon: FileText,
    size: '',
    label: 'REQUESTS',
  },
  {
    id: 'complaints',
    number: '05',
    title: 'Turn issues into action',
    description: 'Record maintenance complaints, assign responsibility and track progress.',
    icon: Wrench,
    size: 'lg:col-span-2',
    label: 'MAINTENANCE',
  },
  {
    id: 'attendance',
    number: '06',
    title: 'Everyday operations in view',
    description: 'Keep attendance and visitor entry and exit records organized.',
    icon: Clock,
    size: '',
    label: 'OPERATIONS',
  },
  {
    id: 'mess',
    number: '07',
    title: 'Keep everyone informed',
    description: 'Share mess menus, announcements and important campus updates.',
    icon: Bell,
    size: '',
    label: 'UPDATES',
  },
]

const roles = [
  {
    id: 'students',
    number: '01',
    title: 'Students',
    subtitle: 'Your hostel, in your hands.',
    description: 'Apply for accommodation, check room details, review fee records, request leave and raise complaints.',
    items: ['Application tracking', 'Room information', 'Leave requests', 'Complaints and updates'],
    icon: UserRound,
  },
  {
    id: 'wardens',
    number: '02',
    title: 'Wardens',
    subtitle: 'Less chasing. More clarity.',
    description: 'Review student requests, coordinate room assignments, monitor hostel activity and manage issues.',
    items: ['Admissions and approvals', 'Occupancy overview', 'Leave decisions', 'Maintenance tracking'],
    icon: ShieldCheck,
  },
  {
    id: 'administrators',
    number: '03',
    title: 'Administrators',
    subtitle: 'A clearer view of the whole operation.',
    description: 'Manage hostel records, users, rooms, fee oversight and operational reports from a central workspace.',
    items: ['Hostel and room management', 'User and role management', 'Fee oversight', 'Reports and insights'],
    icon: LayoutDashboard,
  },
]

const faqs = [
  {
    question: 'Who is CampusOne designed for?',
    answer: 'CampusOne is designed for colleges and hostel-management institutions, with separate experiences for students, wardens and administrators.',
  },
  {
    question: 'Can different users have different permissions?',
    answer: 'Yes. The intended platform design uses role-based access. Permissions must be enforced by the backend, not just hidden in the interface.',
  },
  {
    question: 'Does CampusOne offer monthly and annual subscriptions?',
    answer: 'Monthly and annual subscription options are planned for institutions. Final prices, package limits and billing terms will be published when the plans are finalized.',
  },
  {
    question: 'Can our institution manage multiple hostels?',
    answer: 'The platform is being designed to organize hostel, room and occupancy information centrally. Exact multi-hostel plan limits will depend on the finalized subscription packages.',
  },
]

function DropdownMenu({ label, items, activeMenu, setActiveMenu }) {
  const isOpen = activeMenu === label

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setActiveMenu(isOpen ? null : label)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setActiveMenu(null)
        }}
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        {label}
        <ChevronDown
          size={15}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[70] mt-3 w-[min(340px,calc(100vw-32px))] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-2xl">
          {items.map(({ title, description, icon: Icon, href }) => (
            <a
              key={title}
              href={href}
              onClick={() => setActiveMenu(null)}
              className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[var(--color-surface-raised)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-section)] text-[var(--color-primary)]">
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{title}</span>
                <span className="mt-1 block text-xs leading-5 text-[var(--color-text-muted)]">
                  {description}
                </span>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
        {eyebrow}
      </p>
      <h2 className="display-heading mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  const closeNavigation = () => {
    setActiveMenu(null)
    setMobileMenuOpen(false)
  }
const headline = 'Hostel operations, finally in sync.'
const [typedHeadline, setTypedHeadline] = useState('')

useEffect(() => {
  let index = 0

  const typingInterval = window.setInterval(() => {
    index += 1
    setTypedHeadline(headline.slice(0, index))

    if (index >= headline.length) {
      window.clearInterval(typingInterval)
    }
  }, 55)

  return () => window.clearInterval(typingInterval)
}, [])
  return (
    <main className="min-h-screen overflow-x-clip">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--glass-bg)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            onClick={() => {
    closeNavigation()
    window.setTimeout(() => {
      document.getElementById('hero')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }}
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-lg">
              <Building2 size={23} />
            </span>
           <span className="text-lg font-bold tracking-tight sm:text-3xl">
  <span className="brand-campus">Campus</span>
  <span className="brand-one">One</span>
  <span className="ml-1 text-(--color-primary)">.</span>
</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            <a
              href="#why-campusone"
              onClick={closeNavigation}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]"
            >
              Why CampusOne
            </a>
            <DropdownMenu
              label="Platform"
              items={platformItems}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
            <DropdownMenu
              label="Solutions by Role"
              items={roleItems}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
            <DropdownMenu
              label="Resources"
              items={resourceItems}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
            <a
              href="#pricing"
              onClick={closeNavigation}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]"
            >
              Pricing
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <Link
              to="/login"
              className="hidden rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:text-[var(--color-primary)] sm:inline-flex"
            >
              Log in
            </Link>

            <a
              href="#contact"
              className="hidden items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90 sm:inline-flex"
            >
              Talk to us <ArrowUpRight size={16} />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] lg:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {[
                { title: 'Platform', items: platformItems },
                { title: 'Solutions by Role', items: roleItems },
                { title: 'Resources', items: resourceItems },
              ].map((group) => (
                <div key={group.title} className="border-b border-[var(--color-border)] py-1">
                  <button
                    type="button"
                    onClick={() => setActiveMenu(activeMenu === group.title ? null : group.title)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold"
                    aria-expanded={activeMenu === group.title}
                  >
                    {group.title}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${activeMenu === group.title ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {activeMenu === group.title && (
                    <div className="pb-2 pl-2">
                      {group.items.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          onClick={closeNavigation}
                          className="block rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]"
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <a href="#pricing" onClick={closeNavigation} className="rounded-lg px-3 py-3 text-sm font-semibold">
                Pricing
              </a>
              <Link to="/login" onClick={closeNavigation} className="rounded-lg px-3 py-3 text-sm font-semibold">
                Log in
              </Link>
              <a href="#pricing" onClick={closeNavigation} className="mt-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-center text-sm font-semibold text-white">
                Talk to us <ArrowRight className="ml-1 inline" size={16} />
              </a>
            </div>
          </div>
        )}
      </header>

            {/* HERO */}
      <section
  id="hero"
  className="relative isolate flex min-h-[calc(100svh-76px)] items-center overflow-hidden bg-[#eaf1fa] text-[#182433] transition-colors duration-500 dark:bg-[#101b2b] dark:text-white"
  style={{
    backgroundImage: `url(${campusHero})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }}
>
  {/* Background overlays */}
  <div className="absolute inset-0 -z-10 bg-[#eaf1fa]/35 transition-colors duration-500 dark:bg-[#101b2b]/30" />

  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#eaf1fa]/95 via-[#eaf1fa]/75 to-[#eaf1fa]/20 transition-all duration-500 dark:from-[#101b2b]/75 dark:via-[#101b2b]/35 dark:to-[#101b2b]/10" />

  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#eaf1fa]/65 via-transparent to-[#eaf1fa]/20 transition-all duration-500 dark:from-[#101b2b]/70 dark:to-[#101b2b]/10" />

  <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
    <div className="max-w-3xl">
      {/* Badge */}
      <div className="inline-flex animate-[fadeInUp_0.7s_ease-out_both] items-center gap-2 rounded-full border border-[#182433]/15 bg-white/55 px-4 py-2 text-xs font-semibold tracking-wide text-[#182433] shadow-sm backdrop-blur-xl transition-colors duration-500 dark:border-white/20 dark:bg-white/10 dark:text-white/90 sm:text-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#2585e8] dark:bg-[#65b5ff]" />
        A smarter way to manage campus living
      </div>

      {/* Heading */}
      <h1
        className="display-heading mt-6 max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight text-[#182433] transition-colors duration-500 dark:text-white sm:text-6xl lg:text-7xl"
        aria-label="Hostel operations, finally in sync."
      >
        <span>
          {typedHeadline.slice(0, Math.min(typedHeadline.length, 18))}
        </span>

        {typedHeadline.length > 18 && (
          <span className="mt-2 block text-[#2478d4] dark:text-[var(--color-primary)]">
            {typedHeadline.slice(18)}
          </span>
        )}
      </h1>

      {/* Description */}
      <p className="mt-7 max-w-2xl animate-[fadeInUp_0.8s_ease-out_0.2s_both] text-base leading-8 text-[#34465c] transition-colors duration-500 dark:text-white/80 sm:text-lg">
        Connect administration, hostel management and mess operations
        through one organized platform. Less paperwork, clearer
        workflows and a better campus experience for everyone.
      </p>

      {/* Actions */}
      <div className="mt-9 flex flex-wrap gap-4 animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-xl border border-[#2478d4] bg-[#2478d4] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#2478d4]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1766bd] dark:border-white/30 dark:bg-white/10 dark:text-white dark:shadow-none dark:backdrop-blur-xl dark:hover:bg-white/20"
        >
          Get Started <ArrowRight size={18} />
        </Link>

        <a
          href="#platform"
          className="inline-flex items-center gap-2 rounded-xl border border-[#182433]/20 bg-white/45 px-6 py-3.5 font-semibold text-[#182433] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          Explore CampusOne <ArrowDownRight size={18} />
        </a>
      </div>
    </div>
  </div>

  {/* Scroll indicator */}
  <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs tracking-widest text-[#182433]/60 transition-colors duration-500 dark:text-white/55 md:flex">
    <span className="h-8 w-px bg-[#182433]/40 dark:bg-white/40" />
    SCROLL TO EXPLORE
  </div>
</section>

      {/* WHY CAMPUSONE */}
      <section id="why-campusone" className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Why CampusOne"
            title="Less administrative friction. More organized campus living."
            description="Hostel management touches students, staff, rooms, payments and daily operations. CampusOne brings these workflows together instead of scattering them across separate processes."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: LayoutDashboard, title: 'One connected workspace', text: 'Keep essential hostel workflows organized in one platform.' },
              { icon: Clock, title: 'Clearer workflows', text: 'Make requests, approvals and follow-ups easier to track.' },
              { icon: Users, title: 'Built around roles', text: 'Give students, wardens and administrators relevant experiences.' },
              { icon: ShieldCheck, title: 'Accountability by design', text: 'Design workflows around access controls and clear responsibility.' },
            ].map(({ icon: Icon, title, text }, index) => (
              <article key={title} className={`rounded-2xl border border-[var(--color-border)] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${index === 0 ? 'bg-[var(--color-section)]' : 'bg-[var(--glass-bg)] backdrop-blur-lg'}`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)]">
                  <Icon size={23} />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section id="platform" className="bg-[var(--color-section)] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="The platform"
            title="The everyday details, all in one place."
            description="Explore the core workflows CampusOne is designed to bring together for hostel teams and residents."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ id, number, title, description, icon: Icon, size, label }) => (
              <article
                key={id}
                id={id}
                className={`group scroll-mt-28 rounded-2xl border border-[var(--color-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${size}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)]">
                    <Icon size={22} />
                  </span>
                  <span className="text-xs font-semibold tracking-widest text-[var(--color-text-muted)]">{label}</span>
                </div>
                <p className="mt-7 text-xs font-semibold tracking-widest text-[var(--color-primary)]">{number}</p>
                <h3 className="display-heading mt-2 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
                <a href="#pricing" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
                  Explore plans <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS BY ROLE */}
      <section id="solutions" className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Solutions by role"
            title="Different responsibilities. One shared platform."
            description="Each role gets a purpose-built workflow, with access controlled according to its responsibilities."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {roles.map(({ id, number, title, subtitle, description, items, icon: Icon }) => (
              <article key={id} id={id} className="scroll-mt-28 flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-section)] text-[var(--color-primary)]">
                    <Icon size={24} />
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-text-muted)]">{number}</span>
                </div>
                <h3 className="display-heading mt-7 text-3xl font-semibold">{title}</h3>
                <p className="mt-2 font-medium text-[var(--color-primary)]">{subtitle}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
                <ul className="mt-6 space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <Check size={17} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="#pricing" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
                  See institutional plans <ArrowRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section
  id="pricing"
  className="bg-[var(--color-section)] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
>
  <div className="mx-auto max-w-7xl">
    <div className="mx-auto max-w-2xl text-center">
      <SectionHeading
        eyebrow="Institutional pricing"
        title="Simple plans. Smarter campus management."
        description="Choose a CampusOne subscription that suits your institution. Paid plans include a 30-day free trial."
      />
    </div>

    <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {[
        {
          name: 'FREE',
          description: 'Get started with CampusOne.',
          monthly: '₹0',
          annual: '₹0',
          trial: false,
          featured: false,
        },
        {
          name: 'BASIC',
          description: 'For institutions getting started.',
          monthly: '₹299',
          annual: '₹2,999',
          trial: true,
          featured: false,
        },
        {
          name: 'PRO',
          description: 'For institutions ready to grow.',
          monthly: '₹499',
          annual: '₹5,499',
          trial: true,
          featured: true,
        },
        {
          name: 'ENTERPRISE',
          description: 'For institutions seeking an advanced plan.',
          monthly: '₹799',
          annual: '₹9,499',
          trial: true,
          featured: false,
        },
      ].map((plan) => (
        <div
          key={plan.name}
          className={`relative flex flex-col rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
            plan.featured
              ? 'border-[var(--color-primary)] bg-[var(--color-surface)] shadow-lg shadow-[var(--color-primary)]/10'
              : 'border-[var(--color-border)] bg-[var(--color-surface)]'
          }`}
        >
          {plan.featured && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-xs font-bold tracking-wide text-white">
              MOST POPULAR
            </span>
          )}

          <div className="flex items-center justify-between gap-2">
            <h3 className="display-heading text-xl font-bold">
              {plan.name}
            </h3>

            {plan.trial && (
              <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-[10px] font-bold text-[var(--color-primary)]">
                30-DAY TRIAL
              </span>
            )}
          </div>

          <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--color-text-muted)]">
            {plan.description}
          </p>

          <div className="my-7 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Monthly billing
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                {plan.monthly}
                <span className="ml-1 text-sm font-medium text-[var(--color-text-muted)]">
                  /month
                </span>
              </p>
            </div>

            <div className="border-t border-[var(--color-border)] pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Annual billing
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight">
                {plan.annual}
                <span className="ml-1 text-sm font-medium text-[var(--color-text-muted)]">
                  /year
                </span>
              </p>
            </div>
          </div>

          <div className="mt-auto">
            <div className="mb-5 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Check
                size={17}
                className="shrink-0 text-[var(--color-primary)]"
              />
              {plan.trial
                ? '30-day free trial included'
                : 'Free plan — no trial required'}
            </div>

            <a
              href="#contact"
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                plan.featured
                  ? 'bg-[var(--color-primary)] text-white hover:opacity-90'
                  : 'border border-[var(--color-border)] bg-[var(--color-section)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {plan.name === 'FREE' ? 'Get started' : 'Choose plan'}
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      ))}
    </div>

    <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-[var(--color-text-muted)]">
      All prices are in INR. Paid subscriptions include a 30-day free trial.
      Plan-specific features, capacity limits and billing conditions will be
      displayed once finalized.
    </p>
  </div>
</section>

      {/* FAQ */}
      <section id="faqs" className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Frequently asked questions"
            title="A few things you might be wondering."
            description="A quick introduction to who CampusOne serves and how the platform is intended to work."
          />

          <div className="space-y-3">
            {faqs.map(({ question, answer }, index) => (
              <article key={question} className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--glass-bg)]">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  aria-expanded={openFaq === index}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"
                >
                  <span>{question}</span>
                  <ChevronDown size={18} className={`shrink-0 text-[var(--color-primary)] transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <p className="px-5 pb-5 text-sm leading-7 text-[var(--color-text-muted)]">
                    {answer}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCES PREVIEW */}
      <section id="resources" className="bg-[var(--color-section)] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Resources and transparency"
            title="Useful information, easy to find."
            description="Clear documentation and a feedback channel are important parts of a trustworthy platform."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { id: 'privacy', icon: ShieldCheck, title: 'Privacy policy', text: 'Understand how information is intended to be handled.' },
              { id: 'terms', icon: FileText, title: 'Terms and conditions', text: 'Review the rules and responsibilities for using CampusOne.' },
              { id: 'feedback', icon: MessageSquare, title: 'Feedback', text: 'Share suggestions to help shape the platform.' },
              { id: 'help', icon: HelpCircle, title: 'Help center', text: 'Find answers and guidance as the platform develops.' },
            ].map(({ id, icon: Icon, title, text }) => (
              <article key={id} id={id} className="scroll-mt-28 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <Icon size={23} className="text-[var(--color-primary)]" />
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{text}</p>
                {id === 'privacy' ? (
  <Link
    to="/privacy-policy"
    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
  >
    Read privacy policy <ArrowRight size={15} />
  </Link>
) : id === 'feedback' ? (
  <a
    href="mailto:feedback@campusone.example"
    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
  >
    Provide feedback <ArrowRight size={15} />
  </a>
) : id === 'terms' ? (
  <Link
    to="/terms-and-conditions"
    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
  >
    Read terms and conditions <ArrowRight size={15} />
  </Link>
) : id === 'help' ? (
  <Link
    to="/help"
    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
  >
    Visit help center <ArrowRight size={15} />
  </Link>
) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      {/* CONTACT SECTION */}
<section id="contact" className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
  <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 sm:px-12 sm:py-16">
    <div className="grid items-center gap-12 md:grid-cols-[1fr_1fr]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Get in touch
        </p>

        <h2 className="display-heading mt-4 max-w-xl text-3xl font-semibold leading-tight text-[var(--color-text)] sm:text-5xl">
          Let's make campus life simpler.
        </h2>

        <p className="mt-5 max-w-xl leading-7 text-[var(--color-muted)]">
          Have questions about CampusOne or want to explore how it can support
          your institution? We'd love to hear from you.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <Mail size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-muted)]">
              Email us
            </p>
            <a
              href="mailto:saiavinashpasumarthy2005@gmail.com"
              className="mt-1 block break-all font-semibold text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
            >
              saiavinashpasumarthy2005@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <Phone size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-muted)]">
              Call us
            </p>
            <a
              href="tel:+91 8179263417"
              className="mt-1 block font-semibold text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
            >
              +91 8179263417
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 pb-8 pt-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
            <div>
              <Link to="/" className="inline-flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
                  <Building2 size={22} />
                </span>
                <span className="text-xl font-bold">CampusOne<span className="text-[var(--color-primary)]">.</span></span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--color-text-muted)]">
                A connected workspace for modern college hostel management.
              </p>
              <p className="mt-4 text-xs text-[var(--color-text-muted)]">Built for institutions. Designed around people.</p>
            </div>

            {[
              { title: 'Platform', items: platformItems },
              { title: 'Solutions', items: roleItems },
              { title: 'Resources', items: resourceItems },
            ].map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-bold">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.title}>
                      <a href={item.href} className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="text-sm font-bold">Get started</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#pricing" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">Pricing</a></li>
                <li><Link to="/login" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">Log in</Link></li>
                <li><a href="#contact" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">Contact Us</a></li>
                <li><a href="#faqs" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">FAQs</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} CampusOne. All rights reserved.</p>
            <div className="flex flex-wrap gap-5">
              <Link to="/privacy-policy" className="hover:text-[var(--color-primary)]">
  Privacy Policy
</Link>
              <a href="#terms" className="hover:text-[var(--color-primary)]">Terms</a>
              <a href="#feedback" className="hover:text-[var(--color-primary)]">Feedback</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
