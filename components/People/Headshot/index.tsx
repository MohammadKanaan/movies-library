import { getInitials } from '@/lib/getInitials'
import styles from './styles.module.scss'

type HeadshotProps = {
  person: { name: string; headshotUrl: string | null }
  /** `sm` on a credit card, `md` on the people grid, `lg` heading the person's page. */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * A person's round photo, or their initials on a tinted disc when there is none. Decoration only:
 * the name is always rendered beside it, so it is hidden from assistive tech.
 */
export const Headshot = ({ person, size = 'md' }: HeadshotProps) => {
  return (
    <span className={`${styles.headshot} ${styles[size]}`} aria-hidden="true">
      {person.headshotUrl ? (
        // Headshots are plain public bucket URLs, like posters: no `next/image` loader.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.image}
          src={person.headshotUrl}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : (
        getInitials(person.name)
      )}
    </span>
  )
}
