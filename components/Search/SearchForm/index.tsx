import Form from 'next/form'
import { Input } from '@/components/Form/Input'
import { Button } from '@/components/SCN/button'
import { ROUTE_SEARCH } from '@/lib/constants-routes'
import { SEARCH_MAX_LENGTH } from '@/lib/dto/search'
import styles from './styles.module.scss'

type SearchFormProps = {
  /** The current term, shown back in the field. */
  q: string
}

/**
 * The search page's own form: a plain `GET /search?q=` that Next turns into a client navigation.
 * Server-rendered; the NavBar's `SiteSearch` is the one with suggestions.
 */
export const SearchForm = ({ q }: SearchFormProps) => {
  return (
    <Form action={ROUTE_SEARCH} role="search" className={styles.form}>
      <div className={styles.field}>
        <Input
          name="q"
          type="search"
          label="Search the catalog"
          placeholder="A film's title or a person's name"
          defaultValue={q}
          maxLength={SEARCH_MAX_LENGTH}
          autoComplete="off"
        />
      </div>
      <Button type="submit">Search</Button>
    </Form>
  )
}
