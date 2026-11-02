
import { useMemo, useState } from 'react'
import {
  Search,
  GraduationCap,
  ShieldCheck,
  Users,
  CreditCard,
  BedDouble,
  FileText,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  LifeBuoy,
  BookOpen,
  Mail,
  Clock,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react'
import { Link } from 'react-router-dom'
const categories = [
  {
    id: 'student',
    title: 'Student Help',
    description: 'Admissions, payments, rooms and student services.',
    icon: GraduationCap,
    count: 5,
  },
  {
    id: 'warden',
    title: 'Warden Help',
    description: 'Hostel operations, approvals and student management.',
    icon: ShieldCheck,
    count: 4,
  },
  {
    id: 'admin',
    title: 'Admin Help',
    description: 'College management, users, hostels and reports.',
    icon: Users,
    count: 4,
  },
]

const faqs = [
  {
    id: 1,
    category: 'student',
    question: 'How do I activate my CampusOne account?',
    answer:
      'Open the account activation link sent to your registered email address. Follow the instructions to create your password and activate your account. If the link has expired, contact your college administrator.',
    tags: ['account', 'activation', 'login'],
  },
  {
    id: 2,
    category: 'student',
    question: 'How can I apply for hostel admission?',
    answer:
      'Sign in to CampusOne and open the admissions section. Complete your personal details, provide the required documents and submit your application. Your application will go through the configured approval process.',
    tags: ['admission', 'application', 'hostel'],
  },
  {
    id: 3,
    category: 'student',
    question: 'How do I pay my hostel fees?',
    answer:
      'Open the Fees section in your student dashboard, review your outstanding amount and follow the available payment instructions. Keep your payment receipt for future reference.',
    tags: ['fees', 'payment', 'receipt'],
  },
  {
    id: 4,
    category: 'student',
    question: 'Where can I view my room allocation?',
    answer:
      'After your admission and payment requirements are completed and your room is allocated, you can view your hostel and room details from your student dashboard.',
    tags: ['room', 'allocation', 'hostel'],
  },
  {
    id: 5,
    category: 'student',
    question: 'How can I submit a leave request?',
    answer:
      'Open the Leave section, enter your leave details and submit your request. You can check its status from the same section.',
    tags: ['leave', 'request', 'approval'],
  },
  {
    id: 6,
    category: 'warden',
    question: 'How can I review student admission applications?',
    answer:
      'Open the Admissions section in your Warden dashboard. Review the submitted application and supporting information, then record your decision according to the college approval workflow.',
    tags: ['admission', 'approval', 'students'],
  },
  {
    id: 7,
    category: 'warden',
    question: 'How do I manage rooms and beds?',
    answer:
      'Use the hostel management section to view your assigned hostel, rooms and bed availability. Your access is limited to the hostel assigned to your account.',
    tags: ['rooms', 'beds', 'hostel'],
  },
  {
    id: 8,
    category: 'warden',
    question: 'Where can I review leave requests?',
    answer:
      'Open the Leave Management section to view submitted requests, review their details and process them according to your permissions.',
    tags: ['leave', 'requests', 'management'],
  },
  {
    id: 9,
    category: 'warden',
    question: 'How can I manage student complaints?',
    answer:
      'Open the Complaints section to review complaints associated with your assigned hostel. Update their progress and coordinate resolution through the available workflow.',
    tags: ['complaints', 'maintenance', 'students'],
  },
  {
    id: 10,
    category: 'admin',
    question: 'How do I add a warden?',
    answer:
      'Open the user management section, create a Warden account and assign the appropriate hostel. The Warden will receive the relevant account instructions.',
    tags: ['warden', 'users', 'account'],
  },
  {
    id: 11,
    category: 'admin',
    question: 'How can I manage hostel fee structures?',
    answer:
      'Open the fee management section to configure the applicable hostel and term fee categories. Review your changes before making them available.',
    tags: ['fees', 'hostel', 'configuration'],
  },
  {
    id: 12,
    category: 'admin',
    question: 'Where can I view reports?',
    answer:
      'Use the Reports section to review available occupancy, financial and operational information. Report availability depends on your account permissions.',
    tags: ['reports', 'occupancy', 'finance'],
  },
  {
    id: 13,
    category: 'admin',
    question: 'How do I manage hostel information?',
    answer:
      'Open Hostel Management to create and maintain hostel details, rooms, facilities and related information for your institution.',
    tags: ['hostel', 'rooms', 'management'],
  },
]

const popularTopics = [
  { label: 'Admissions', icon: FileText, search: 'admission' },
  { label: 'Fee payments', icon: CreditCard, search: 'payment' },
  { label: 'Room allocation', icon: BedDouble, search: 'room' },
  { label: 'Leave requests', icon: BookOpen, search: 'leave' },
]

export default function HelpCenterPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [openFaq, setOpenFaq] = useState(null)

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase()

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === 'all' || faq.category === activeCategory

      const searchableText = [
        faq.question,
        faq.answer,
        ...faq.tags,
      ].join(' ').toLowerCase()

      return matchesCategory && (!query || searchableText.includes(query))
    })
  }, [search, activeCategory])

  const handleCategorySelect = (category) => {
    setActiveCategory(category)
    setOpenFaq(null)
  }

  const handleTopicSearch = (value) => {
    setSearch(value)
    setActiveCategory('all')
    setOpenFaq(null)
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 lg:pb-20 lg:pt-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
            <ArrowLeft size={16} />
            Back to home
          </Link>
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--color-primary)] opacity-[0.09] blur-3xl" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[var(--color-primary)] opacity-[0.09] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[var(--color-primary)] opacity-[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-primary)]">
            <LifeBuoy size={16} />
            CampusOne Help Center
          </div>
          

          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            How can we help
            <span className="brand-campus"> you </span>
            today?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
            Find answers, explore helpful guides and get the support you need
            to make the most of CampusOne.
          </p>

          <div className="glass-panel mx-auto mt-9 flex max-w-2xl items-center gap-3 rounded-2xl p-2">
            <Search className="ml-3 shrink-0 text-[var(--color-text-muted)]" size={21} />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setOpenFaq(null)
              }}
              placeholder="Search for answers, topics or keywords..."
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
              aria-label="Search help articles"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="rounded-xl px-3 py-2 text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-xs text-[var(--color-text-muted)]">
              Popular:
            </span>
            {popularTopics.map((topic) => (
              <button
                key={topic.label}
                type="button"
                onClick={() => handleTopicSearch(topic.search)}
                className="glass-interactive inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <topic.icon size={13} />
                {topic.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Browse by role
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              What do you need help with?
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Choose your role to find the most relevant answers.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    handleCategorySelect(isActive ? 'all' : category.id)
                  }
                  className={`glass-panel glass-interactive group rounded-2xl p-6 text-left transition duration-300 hover:-translate-y-1 ${
                    isActive
                      ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/15'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-section)] text-[var(--color-primary)]">
                      <Icon size={23} />
                    </div>
                    <ArrowRight
                      size={19}
                      className="text-[var(--color-text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--color-primary)]"
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">
                    {category.title}
                  </h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--color-text-muted)]">
                    {category.description}
                  </p>
                  <p className="mt-4 text-xs font-medium text-[var(--color-primary)]">
                    {category.count} help articles
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                Knowledge base
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Frequently asked questions
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Quick answers to help you get things done.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveCategory('all')
                setSearch('')
                setOpenFaq(null)
              }}
              className="self-start text-sm font-medium text-[var(--color-primary)] hover:underline sm:self-auto"
            >
              View all questions
            </button>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeCategory === 'all'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'glass-panel text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
              }`}
            >
              All topics
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategorySelect(category.id)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeCategory === category.id
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'glass-panel text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                }`}
              >
                {category.title.replace(' Help', '')}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id

                return (
                  <article
                    key={faq.id}
                    className="glass-panel overflow-hidden rounded-2xl"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-start gap-3">
                        <HelpCircle
                          size={19}
                          className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                        />
                        <span className="font-medium leading-6">
                          {faq.question}
                        </span>
                      </span>
                      <ChevronDown
                        size={19}
                        className={`shrink-0 text-[var(--color-text-muted)] transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-[var(--color-border)] px-5 pb-6 pt-4 sm:px-6">
                        <p className="pl-8 text-sm leading-7 text-[var(--color-text-muted)]">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </article>
                )
              })
            ) : (
              <div className="glass-panel rounded-2xl px-6 py-12 text-center">
                <Search
                  size={30}
                  className="mx-auto text-[var(--color-text-muted)]"
                />
                <h3 className="mt-4 font-semibold">No matching answers found</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Try another keyword or browse all available topics.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setActiveCategory('all')
                  }}
                  className="mt-5 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-[var(--color-text-muted)]">
            Showing {filteredFaqs.length} of {faqs.length} help articles
          </p>
        </div>
      </section>

      {/* Support */}
      <section className="px-5 py-16 sm:px-8">
        <div className="glass-panel mx-auto max-w-6xl overflow-hidden rounded-3xl">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:p-12">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-section)] text-[var(--color-primary)]">
                <MessageCircle size={23} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                Still need a hand?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-text-muted)]">
                Can't find what you're looking for? Reach out to the CampusOne
                support team and we'll help you find the right solution.
              </p>
              <a
                href="mailto:saiavinashpasumarthy2005@gmail.com"
                className="glass-button-primary mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
              >
                Contact Support
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="space-y-5 rounded-2xl bg-[var(--color-section)] p-6">
              <div className="flex gap-3">
                <div className="mt-0.5 text-[var(--color-primary)]">
                  <Mail size={19} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Email support</p>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    saiavinashpasumarthy2005@gmail.com
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 text-[var(--color-primary)]">
                  <Clock size={19} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Support availability</p>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Contact the support team for assistance.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 text-[var(--color-primary)]">
                  <BookOpen size={19} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Help resources</p>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Browse the guides and FAQs above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <footer className="border-t border-[var(--color-border)] px-5 py-6 text-center sm:px-8">
        <p className="text-xs text-[var(--color-text-muted)]">
          CampusOne Help Center · Support for a more connected campus.
        </p>
      </footer>
    </main>
  )
}
