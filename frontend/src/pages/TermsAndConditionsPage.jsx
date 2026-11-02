
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  UserRound,
  ShieldCheck,
  CreditCard,
  Building2,
  Ban,
  AlertTriangle,
  Scale,
  ChevronRight,
  GraduationCap,
} from 'lucide-react'


const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: FileText,
    content: [
      {
        heading: 'Agreement',
        text: 'By accessing or using CampusOne, you agree to follow these Terms and Conditions. If you do not agree with these terms, you should not use the platform.',
      },
      {
        heading: 'Eligibility',
        text: 'CampusOne is intended for authorized users associated with participating educational institutions, including college administrators, Wardens, and students.',
      },
      {
        heading: 'Institutional authority',
        text: 'Your access and permissions are determined by your institution and the role assigned to your account.',
      },
    ],
  },
  {
    id: 'accounts',
    title: 'Accounts and Responsibilities',
    icon: UserRound,
    content: [
      {
        heading: 'Account accuracy',
        text: 'You must provide accurate and up-to-date information when creating or maintaining your account. You are responsible for correcting information that becomes inaccurate.',
      },
      {
        heading: 'Account security',
        text: 'You are responsible for keeping your login credentials confidential and for activities performed through your account. Notify your institution if you suspect unauthorized access.',
      },
      {
        heading: 'Authorized access',
        text: 'You must not share accounts, impersonate another person, attempt to access restricted records, or use another user’s credentials.',
      },
    ],
  },
  {
    id: 'roles',
    title: 'User Roles and Platform Usage',
    icon: Building2,
    content: [
      {
        heading: 'College Administrators',
        text: 'College Administrators are responsible for managing their institution’s authorized users, hostel information, admissions, fee configurations, room allocations, and other administrative activities within their assigned permissions.',
      },
      {
        heading: 'Wardens',
        text: 'Wardens must use CampusOne for responsibilities assigned to them, such as managing hostel records, reviewing student requests, monitoring hostel activities, and handling complaints. Their access is limited to the hostels and records assigned to them.',
      },
      {
        heading: 'Students',
        text: 'Students are responsible for maintaining accurate profile information, submitting genuine documents and requests, following hostel procedures, and using the platform for its intended purposes.',
      },
    ],
  },
  {
    id: 'admissions',
    title: 'Admissions and Hostel Allocation',
    icon: GraduationCap,
    content: [
      {
        heading: 'Admission applications',
        text: 'Submitting an admission application does not guarantee admission or hostel accommodation. Applications are subject to the institution’s review and approval process.',
      },
      {
        heading: 'Verification',
        text: 'The institution may verify submitted personal information and documents before approving an application.',
      },
      {
        heading: 'Room allocation',
        text: 'Hostel and room allocation depends on approval, applicable eligibility requirements, payment status where required, and available accommodation.',
      },
      {
        heading: 'Changes and transfers',
        text: 'Room changes, hostel transfers, renewals, and checkout requests are subject to the applicable institutional approval process.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Fees and Payments',
    icon: CreditCard,
    content: [
      {
        heading: 'Applicable fees',
        text: 'Students must pay the fees and charges communicated by their institution, according to the applicable payment schedule and institutional policies.',
      },
      {
        heading: 'Online payments',
        text: 'Where online payment functionality is available, transactions may be processed through an authorized third-party payment service provider. Its terms and policies may also apply.',
      },
      {
        heading: 'Payment confirmation',
        text: 'A payment should be treated as successful only after the platform or institution confirms the transaction. Users should retain their payment receipts and transaction references.',
      },
      {
        heading: 'Refunds and adjustments',
        text: 'Refund eligibility, refundable deposits, deductions, cancellations, and payment adjustments are governed by the applicable institution’s published fee and refund policies.',
      },
    ],
  },
  {
    id: 'conduct',
    title: 'Acceptable Use',
    icon: ShieldCheck,
    content: [
      {
        heading: 'Permitted use',
        text: 'You may use CampusOne only for legitimate educational, administrative, and hostel-management activities for which you have been authorized.',
      },
      {
        heading: 'Prohibited activities',
        text: 'You must not misuse the platform, submit fraudulent information, upload unlawful or harmful content, interfere with platform operations, attempt unauthorized access, or introduce malicious software.',
      },
      {
        heading: 'Respectful communication',
        text: 'Complaints, feedback, messages, and uploaded content must be genuine, relevant, and respectful. Harassment, threats, and knowingly false reports are not permitted.',
      },
    ],
  },
  {
    id: 'content',
    title: 'Documents and User Content',
    icon: FileText,
    content: [
      {
        heading: 'Your submissions',
        text: 'You remain responsible for the accuracy, legality, and appropriateness of the information and files you submit through CampusOne.',
      },
      {
        heading: 'Permission to process',
        text: 'You authorize the platform and the relevant institution to store, process, and display submitted information as reasonably necessary to provide the requested platform functionality and institutional services.',
      },
      {
        heading: 'Document authenticity',
        text: 'Submitting forged, misleading, altered, or unauthorized documents may result in institutional review and action under applicable rules.',
      },
    ],
  },
  {
    id: 'availability',
    title: 'Platform Availability',
    icon: AlertTriangle,
    content: [
      {
        heading: 'Service changes',
        text: 'CampusOne may be updated, modified, or temporarily unavailable for maintenance, security updates, technical issues, or operational reasons.',
      },
      {
        heading: 'No uninterrupted-service guarantee',
        text: 'We aim to provide a reliable platform but cannot guarantee uninterrupted access, error-free operation, or availability at all times.',
      },
      {
        heading: 'Third-party services',
        text: 'Some features may depend on external services, such as authentication, email delivery, hosting, databases, or payment providers. Their availability may affect related CampusOne features.',
      },
    ],
  },
  {
    id: 'suspension',
    title: 'Suspension and Termination',
    icon: Ban,
    content: [
      {
        heading: 'Access restrictions',
        text: 'Access may be restricted, suspended, or disabled where required for account security, suspected misuse, institutional instructions, or compliance with applicable requirements.',
      },
      {
        heading: 'Institutional decisions',
        text: 'Decisions concerning student admission, hostel eligibility, disciplinary matters, fees, and accommodation remain subject to the relevant institution’s policies and authorized processes.',
      },
      {
        heading: 'Account concerns',
        text: 'If you believe that your account has been incorrectly restricted, contact your institution’s authorized administrator.',
      },
    ],
  },
  {
    id: 'liability',
    title: 'Limitations and Responsibilities',
    icon: Scale,
    content: [
      {
        heading: 'User responsibility',
        text: 'Users are responsible for the accuracy of their submissions, the security of their accounts, and their compliance with institutional rules.',
      },
      {
        heading: 'Institutional policies',
        text: 'CampusOne supports administrative workflows but does not replace the official rules, decisions, notices, or procedures of the participating institution.',
      },
      {
        heading: 'Applicable law',
        text: 'Nothing in these terms is intended to exclude rights or responsibilities that cannot legally be excluded under applicable law.',
      },
    ],
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    icon: FileText,
    content: [
      {
        heading: 'Updates',
        text: 'These Terms and Conditions may be updated as CampusOne features, institutional requirements, or applicable obligations change.',
      },
      {
        heading: 'Continued use',
        text: 'The updated version will be published on this page with a revised date. Continued use after an update may constitute acceptance where permitted by applicable law.',
      },
    ],
  },
]

export default function TermsAndConditionsPage() {
  

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
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--color-primary)] ${muted}`}
          >
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
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] shadow-[var(--shadow-card)] backdrop-blur-xl">
            <Scale size={16} />
            Platform rules and responsibilities
          </div>

          <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl ${heading}`}>
            Terms &amp; Conditions
          </h1>

          <p className={`mt-5 max-w-2xl text-base leading-8 sm:text-lg ${muted}`}>
            These terms explain the responsibilities and conditions that apply
            when using CampusOne. Please read them carefully before accessing
            the platform.
          </p>

          <p className={`mt-4 text-sm ${muted}`}>
            Last updated: November 2, 2026
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit lg:sticky lg:top-8">
            <div className={`p-5 ${card}`}>
              <p className={`mb-4 text-xs font-bold uppercase tracking-widest ${muted}`}>
                On this page
              </p>

              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-[var(--glow-primary)] hover:text-[var(--color-primary)] ${muted}`}
                  >
                    <span>{section.title}</span>
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
                  className={`scroll-mt-8 p-6 sm:p-8 ${card}`}
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-[var(--glow-primary)] p-3 text-[var(--color-primary)]">
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

            <section className={`p-6 sm:p-8 ${card}`}>
              <h2 className={`text-xl font-bold ${heading}`}>
                Questions about these terms?
              </h2>

              <p className={`mt-3 text-sm leading-7 ${muted}`}>
                Contact your institution’s authorized CampusOne administrator
                if you have questions about account access, hostel procedures,
                payments, or the application of these terms.
              </p>

              <Link
                to="/"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
              >
                Return to homepage
                <ChevronRight size={16} />
              </Link>
            </section>

            <div className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 ${card}`}>
              <div>
                <p className={`font-semibold ${heading}`}>
                  Your privacy matters too.
                </p>
                <p className={`mt-1 text-sm ${muted}`}>
                  Learn how CampusOne handles personal information.
                </p>
              </div>

              <Link
                to="/privacy-policy"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              >
                Privacy Policy
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] px-5 py-7 text-center text-sm text-[var(--color-text-muted)]">
        © {new Date().getFullYear()} CampusOne. All rights reserved.
      </footer>
    </main>
  )
}
