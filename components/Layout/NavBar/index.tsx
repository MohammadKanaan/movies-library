'use client'

import clsx from 'clsx'
import { Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useEffectEvent, useState } from 'react'
import { SignOutButton } from '@/components/Auth/SignOutButton'
import { ButtonLink } from '@/components/ButtonLink'
import { SiteSearch } from '@/components/Layout/SiteSearch'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserAvatar } from '@/components/UserAvatar'
import { useScrollLock } from '@/hooks/useScrollLock'
import { BREAKPOINTS } from '@/lib/constants-breakpoints'
import {
  ROUTE_ADMIN,
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_MOVIES,
  ROUTE_PEOPLE,
  ROUTE_SETTINGS,
} from '@/lib/constants-routes'
import type { CurrentUser } from '@/lib/dto/users'
import { env } from '@/lib/env'
import styles from './styles.module.scss'

const MOBILE_NAV_ID = 'mobile-nav'
const MOBILE_SEARCH_ID = 'mobile-search'

const NAV_LINKS = [
  { label: 'Movies', href: ROUTE_MOVIES },
  { label: 'People', href: ROUTE_PEOPLE },
]

/** Only for admins; the page itself is guarded by the DAL, this just hides the link. */
const ADMIN_LINK = { label: 'Admin', href: ROUTE_ADMIN }

type NavLink = (typeof NAV_LINKS)[number]

type NavLinksProps = {
  links: NavLink[]
}

const NavLinks = ({ links }: NavLinksProps) => {
  const pathname = usePathname()
  const matches = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  // The most specific link wins, so a nested link does not also light up its parent.
  const activeHref = links
    .filter((link) => matches(link.href))
    .reduce<string | null>(
      (best, link) => (best === null || link.href.length > best.length ? link.href : best),
      null,
    )
  const isActive = (href: string) => href === activeHref

  return links.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className={clsx(styles.navLink, isActive(link.href) && styles.navLinkActive)}
    >
      <span>{link.label}</span>
    </Link>
  ))
}

type AccountActionsProps = {
  user: CurrentUser | null
}

const AccountActions = ({ user }: AccountActionsProps) => {
  if (!user) {
    return (
      <ButtonLink href={ROUTE_LOGIN} size="sm">
        Log in
      </ButtonLink>
    )
  }
  return (
    <>
      <Link href={ROUTE_SETTINGS} className={styles.profileLink} aria-label="Account settings">
        <UserAvatar name={user.name} image={user.image} size="sm" />
        <span className={styles.userName}>{user.name}</span>
      </Link>
      <SignOutButton />
    </>
  )
}

type NavBarProps = {
  user: CurrentUser | null
}

export const NavBar = ({ user }: NavBarProps) => {
  const { lockScroll, unlockScroll } = useScrollLock()
  const links = [...NAV_LINKS, ...(user?.role === 'admin' ? [ADMIN_LINK] : [])]
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    unlockScroll()
  }

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu()
      return
    }

    // One thing open at a time: the search bar gives way to the menu.
    setIsMobileSearchOpen(false)
    setIsMobileMenuOpen(true)
    lockScroll()
  }

  const toggleMobileSearch = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu()
    }
    setIsMobileSearchOpen((open) => !open)
  }

  const closeOnDesktop = useEffectEvent(() => {
    if (window.matchMedia(`(min-width: ${BREAKPOINTS.md})`).matches) {
      closeMobileMenu()
      setIsMobileSearchOpen(false)
    }
  })

  useEffect(() => {
    const handleResize = () => closeOnDesktop()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href={ROUTE_HOME} className={styles.brand}>
          {env.appName}
        </Link>

        <div className={styles.desktopSearch}>
          <SiteSearch slashShortcut />
        </div>

        <div className={styles.desktopNav}>
          <NavLinks links={links} />
          <div className={styles.accountArea}>
            <ThemeToggle />
            <AccountActions user={user} />
          </div>
        </div>

        <div className={styles.mobileButtons}>
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-label="Toggle search"
            aria-expanded={isMobileSearchOpen}
            aria-controls={MOBILE_SEARCH_ID}
            onClick={toggleMobileSearch}
          >
            {isMobileSearchOpen ? <X aria-hidden="true" /> : <Search aria-hidden="true" />}
          </button>
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls={MOBILE_NAV_ID}
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        {/* Below the header on small screens; the suggestions pop over the page from there. */}
        {isMobileSearchOpen ? (
          <div id={MOBILE_SEARCH_ID} className={styles.mobileSearch}>
            <SiteSearch autoFocus onNavigate={() => setIsMobileSearchOpen(false)} />
          </div>
        ) : null}

        <div
          className={clsx(styles.mobileNavOverlay, isMobileMenuOpen && styles.active)}
          aria-hidden="true"
          onClick={closeMobileMenu}
        />

        <div
          id={MOBILE_NAV_ID}
          className={clsx(styles.mobileNav, isMobileMenuOpen && styles.active)}
          inert={!isMobileMenuOpen}
        >
          <div className={styles.mobileNavHeader}>{env.appName}</div>
          <div className={styles.mobileNavLinks}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className={styles.mobileAccountArea}>
            <ThemeToggle />
            {/* Account actions close the menu; theme choices keep it open. */}
            <div className={styles.accountArea} onClick={closeMobileMenu}>
              <AccountActions user={user} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
