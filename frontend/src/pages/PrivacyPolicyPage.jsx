
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ShieldCheck,
  Cookie,
  LockKeyhole,
  Database,
  UserRound,
  ChevronRight,
  CheckCircle2,
  Settings2,
} from 'lucide-react'


const sections = [
  {
    id: 'information',
    title: 'Information We Collect',
    icon: Database,
    content: [
      {
        heading: 'Account information',
        text: 'CampusOne may collect information such as your name, email address, phone number, college ID, and account role when an account is created or activated.',
      },
      {
        heading: 'Hostel and academic information',
        text: 'Depending on your role and use of the platform, information may include admission details, hostel and room allocation, fee records, leave requests, complaints, and other hostel-related records.',
      },
      {
        heading: 'Documents and uploads',
        text: 'Users may submit documents or images required for admission, verification, complaints, and other platform workflows.',
      },
    ],
  },
  {
    id: 'usage',
    title: 'How Information Is Used',
    icon: UserRound,
    content: [
      {
        heading: 'Platform operations',
        text: 'Information is used to provide account access and support hostel administration, admissions, room allocation, payments, leave management, complaints, and communication.',
      },
      {
        heading: 'Communication',
        text: 'Contact information may be used for account-related messages, verification, notifications, and important service updates.',
      },
      {
        heading: 'Security',
        text: 'Information may be used to protect accounts, investigate suspicious activity, maintain audit records, and help prevent unauthorized access.',
      },
    ],
  },
  {
    id: 'storage',
    title: 'Data Storage and Security',
    icon: LockKeyhole,
    content: [
      {
        heading: 'Storage',
        text: 'CampusOne is designed to use its configured application services and database to store account and platform information.',
      },
      {
        heading: 'Access control',
        text: 'Access to information should be limited according to assigned roles and permissions. Administrators and Wardens should only access records permitted by their responsibilities.',
      },
      {
        heading: 'Security limitations',
        text: 'We take reasonable steps to protect information, but no internet-based service or storage system can be guaranteed to be completely secure.',
      },
    ],
  },
  {
    id: 'sharing',
    title: 'Data Sharing and Retention',
    icon: ShieldCheck,
    content: [
      {
        heading: 'Authorized users',
        text: 'Information may be visible to authorized college administrators, Wardens, and other users where necessary to provide the platform’s services.',
      },
      {
        heading: 'Service providers',
        text: 'Information may be processed by third-party services used to operate platform features, such as authentication, database hosting, email delivery, and payment processing.',
      },
      {
        heading: 'Retention',
        text: 'Information should be retained only for as long as required for platform operations, legitimate institutional requirements, and applicable legal obligations.',
      },
    ],
  },
  {
    id: 'rights',
    title: 'Your Choices and Rights',
    icon: UserRound,
    content: [
      {
        heading: 'Review and correction',
        text: 'You may contact your college administrator to request access to or correction of personal information associated with your account.',
      },
      {
        heading: 'Account assistance',
        text: 'For account-related questions, access issues, or privacy requests, contact the CampusOne team using the contact details provided by your institution.',
      },
    ],
  },
]

const cookieTypes = [
  {
    name: 'Essential cookies',
    status: 'Required',
    description:
      'These are necessary for core platform functions, such as maintaining secure sessions and supporting authentication. They cannot be disabled through this page.',
  },
]

export default function PrivacyPolicyPage() {
  const [showCookieSettings, setShowCookieSettings] = useState(false)

  const page = 'min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]'
const card = 'glass-panel glass-interactive rounded-2xl'
const muted = 'text-[var(--color-text-muted)]'
const heading = 'text-[var(--color-text)]'

  return (
    <main className={page}>
      <header className="border-b border-[var(--color-border)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link
            to="/"
 className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--color-primary)] ${muted}`}         >
            <ArrowLeft size={17} />
            Back to CampusOne
          </Link>

          <span className="text-lg font-bold tracking-tight">
  <span className="brand-campus">Campus</span>
  <span className="brand-one">One</span>
</span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] backdrop-blur-xl dark:border-white/30 dark:bg-blue-500/10 dark:text-[var(--color-primary)] dark:hover:bg-white/20">
            <ShieldCheck size={16} />
            Privacy and transparency
          </div>

          <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl ${heading}`}>
            Privacy Policy
          </h1>

          <p className={`mt-5 max-w-2xl text-base leading-8 sm:text-lg ${muted}`}>
            Your privacy matters. This page explains what information CampusOne
            may handle, why it is used, and how essential cookies support the
            platform.
          </p>

          <p className={`mt-4 text-sm ${muted}`}>
            Last updated: November 2, 2026
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit lg:sticky lg:top-8">
            <div className={`rounded-2xl border p-5 ${card}`}>
              <p className={`mb-4 text-xs font-bold uppercase tracking-widest ${muted}`}>
                On this page
              </p>

              <nav className="space-y-1">
                {[
                  ...sections.map((section) => ({
                    id: section.id,
                    title: section.title,
                  })),
                  { id: 'cookies', title: 'Cookie Policy' },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-blue-500/10 hover:text-[#65b5ff] ${muted}`}
                  >
                    {item.title}
                    <ChevronRight size={15} />
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon

              return (
                <section
                  id={section.id}
                  key={section.id}
                  className={`scroll-mt-8 rounded-2xl border p-6 sm:p-8 ${card}`}
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-blue-500/10 p-3 text-[var(--color-primary)]">
                      <Icon size={21} />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${muted}`}>
                        SECTION {String(index + 1).padStart(2, '0')}
                      </p>
                      <h2 className={`mt-1 text-xl font-bold ${heading}`}>
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {section.content.map((item) => (
                      <div key={item.heading}>
                        <h3 className={`font-semibold ${heading}`}>
                          {item.heading}
                        </h3>
                        <p className={`mt-2 text-sm leading-7 ${muted}`}>
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}

            <section
              id="cookies"
              className={`scroll-mt-8 rounded-2xl border p-6 sm:p-8 ${card}`}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-3 text-[var(--color-primary)]">
                  <Cookie size={21} />
                </div>
                <div>
                  <p className={`text-xs font-semibold ${muted}`}>
                    SECTION 06
                  </p>
                  <h2 className={`mt-1 text-xl font-bold ${heading}`}>
                    Cookie Policy
                  </h2>
                </div>
              </div>

              <p className={`text-sm leading-7 ${muted}`}>
                Cookies and similar technologies may help websites remember
                information and maintain secure sessions. CampusOne currently
                documents only essential cookie functionality. Analytics and
                advertising cookies are not currently part of this policy.
              </p>

              <div className="mt-6 space-y-4">
                {cookieTypes.map((cookie) => (
                  <div
  key={cookie.name}
  className="glass-panel-subtle rounded-xl p-5"
>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className={`font-semibold ${heading}`}>
                        {cookie.name}
                      </h3>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                        {cookie.status}
                      </span>
                    </div>
                    <p className={`mt-3 text-sm leading-7 ${muted}`}>
                      {cookie.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="glass-panel-subtle mt-6 rounded-xl p-5">
                <h3 className={`font-semibold ${heading}`}>
                  Managing cookies
                </h3>
                <p className={`mt-2 text-sm leading-7 ${muted}`}>
                  You can manage or clear cookies through your browser
                  settings. Blocking essential cookies may affect sign-in or
                  other core platform functionality.
                </p>

                <button
                  type="button"
                  onClick={() => setShowCookieSettings((current) => !current)}
className="glass-button-primary mt-4 px-5 py-3 text-sm font-semibold">
                  <Settings2 size={16} />
                  {showCookieSettings ? 'Hide cookie information' : 'Cookie settings'}
                  </button>

                {showCookieSettings && (
                  <div className="glass-panel-subtle mt-4 rounded-xl p-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 size={17} className="text-emerald-500" />
                      Essential cookies
                      <span className={`ml-auto text-xs ${muted}`}>Always active</span>
                    </div>
                    <p className={`mt-2 text-sm leading-6 ${muted}`}>
                      Essential cookies support core functionality. This
                      information panel is explanatory only; it does not
                      currently change cookie preferences or store consent.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className={`rounded-2xl border p-6 sm:p-8 ${card}`}>
              <h2 className={`text-xl font-bold ${heading}`}>
                Questions about privacy?
              </h2>
              <p className={`mt-3 text-sm leading-7 ${muted}`}>
                For privacy questions or requests, contact your institution's
                authorized CampusOne administrator.
              </p>
              <Link
                to="/"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              >
                Return to homepage
                <ChevronRight size={16} />
              </Link>
            </section>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] px-5 py-7 text-center text-sm text-[var(--color-text-muted)]">
        © {new Date().getFullYear()} CampusOne. All rights reserved.
      </footer>
    </main>
  )
}
