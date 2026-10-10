import Link from 'next/link'
import { Headshot } from '@/components/People/Headshot'
import { personPath } from '@/lib/constants-routes'
import type { PersonListItem } from '@/lib/dto/people'
import styles from './styles.module.scss'

type PersonCardProps = {
  person: PersonListItem
}

/** A person on the people grid: headshot, name and how many credits they hold. */
export const PersonCard = ({ person }: PersonCardProps) => {
  return (
    <Link href={personPath(person.slug)} className={styles.card}>
      <Headshot person={person} />
      {/* The space keeps the accessible name from running "Amy Adams4 credits" together. */}
      <span className={styles.name}>{person.name}</span>{' '}
      <span className={styles.credits}>
        {person.creditCount} {person.creditCount === 1 ? 'credit' : 'credits'}
      </span>
    </Link>
  )
}
