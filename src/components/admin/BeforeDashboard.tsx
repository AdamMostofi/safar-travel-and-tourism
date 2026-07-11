'use client'

import { useState } from 'react'
import {
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  type LucideIcon,
  Luggage,
  MapPin,
  Quote,
  Settings,
  Ship,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * The Safar admin dashboard for non-technical staff: a welcome card plus branded
 * collection cards grouped as in the nav, each with an icon, a plain-language
 * description, and a "?" that reveals a short "what you can do here" note on
 * hover, focus, or click. Rendered above the default dashboard; Payload's plain
 * cards are hidden via `custom.scss`. Client component so the "?" toggles.
 */

type Card = { icon: LucideIcon; label: string; href: string; desc: string; help: string }
type Group = { title: string; cards: Card[] }

const GROUPS: Group[] = [
  {
    title: 'Catalogue',
    cards: [
      {
        icon: Luggage,
        label: 'Packages',
        href: '/admin/collections/packages',
        desc: 'The trips we sell.',
        help: 'Add and edit Packages: name, starting price, what’s included, and photos. Tick Featured to show one on the home page.',
      },
      {
        icon: MapPin,
        label: 'Destinations',
        href: '/admin/collections/destinations',
        desc: 'Places we send travellers.',
        help: 'Create the places Packages are grouped under, each with a photo. Featured Destinations show on the home page.',
      },
      {
        icon: Ship,
        label: 'Cruises',
        href: '/admin/collections/cruises',
        desc: 'Cruise holidays.',
        help: 'Add and edit Cruises, browsed on their own page separately from land Packages.',
      },
    ],
  },
  {
    title: 'Content',
    cards: [
      {
        icon: Quote,
        label: 'Testimonials',
        href: '/admin/collections/testimonials',
        desc: 'Traveller quotes.',
        help: 'Add quotes from happy travellers. Tick Featured to show one on the home page.',
      },
    ],
  },
  {
    title: 'Enquiries',
    cards: [
      {
        icon: Inbox,
        label: 'Leads',
        href: '/admin/collections/leads',
        desc: 'Enquiries from the website.',
        help: 'Enquiries people send from the site. Follow up by phone or WhatsApp; nothing here is a paid booking.',
      },
    ],
  },
  {
    title: 'Library',
    cards: [
      {
        icon: ImageIcon,
        label: 'Media',
        href: '/admin/collections/media',
        desc: 'Your photo library.',
        help: 'Upload and manage the images used across the site. Every image needs a short description for accessibility.',
      },
    ],
  },
  {
    title: 'Settings',
    cards: [
      {
        icon: Settings,
        label: 'Site Settings',
        href: '/admin/globals/site-settings',
        desc: 'Contacts, socials, assistant.',
        help: 'Phone numbers, email, address, socials, the home-page numbers, and the site assistant, all in one place.',
      },
      {
        icon: Users,
        label: 'Users',
        href: '/admin/collections/users',
        desc: 'Staff sign-in accounts.',
        help: 'The staff who can sign in to this admin panel.',
      },
    ],
  },
]

function Help({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="safar-dash-help">
      <button
        type="button"
        className="safar-dash-help__btn"
        aria-label={`What is ${label}?`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <HelpCircle size={16} aria-hidden="true" />
      </button>
      <span className={cn('safar-dash-help__pop', open && 'is-open')} role="tooltip">
        {text}
      </span>
    </span>
  )
}

export function BeforeDashboard() {
  return (
    <div className="safar-dash">
      <div className="safar-welcome">
        <h2 className="safar-welcome__title">Welcome to Safar</h2>
        <p className="safar-welcome__lead">
          Manage the trips, enquiries, and content on your website. Pick a section below, or jump
          straight in:
        </p>
        <ul className="safar-welcome__links">
          <li>
            <a href="/admin/collections/packages/create">Add a Package</a>
          </li>
          <li>
            <a href="/admin/collections/cruises/create">Add a Cruise</a>
          </li>
          <li>
            <a href="/admin/collections/leads">Review new Enquiries</a>
          </li>
        </ul>
      </div>

      {GROUPS.map((group) => (
        <section key={group.title} className="safar-dash__group">
          <h3 className="safar-dash__group-title">{group.title}</h3>
          <div className="safar-dash__grid">
            {group.cards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.href} className="safar-dash-card">
                  <a className="safar-dash-card__link" href={card.href}>
                    <span className="safar-dash-card__icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="safar-dash-card__body">
                      <span className="safar-dash-card__label">{card.label}</span>
                      <span className="safar-dash-card__desc">{card.desc}</span>
                    </span>
                  </a>
                  <Help label={card.label} text={card.help} />
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
