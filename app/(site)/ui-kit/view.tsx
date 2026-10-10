'use client'

import { X } from 'lucide-react'
import { useState, type ComponentProps, type ReactNode } from 'react'
import { toast } from 'sonner'
import { ActionButton } from '@/components/ActionButton'
import { ActionGroup } from '@/components/ActionGroup'
import { ActionLink } from '@/components/ActionLink'
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog'
import { NameDialog } from '@/components/Admin/NameDialog'
import { StatCard } from '@/components/Admin/StatCard'
import { Empty } from '@/components/Empty'
import { FileUploader } from '@/components/Form/FileUploader'
import { Input } from '@/components/Form/Input'
import { Textarea } from '@/components/Form/Textarea'
import { ButtonLink } from '@/components/ButtonLink'
import { LoadingButton } from '@/components/LoadingButton'
import { ShortcutHint } from '@/components/ShortcutHint'
import { ThemeToggle } from '@/components/ThemeToggle'
import { PageHeader } from '@/components/PageHeader'
import { MoviePoster } from '@/components/Movies/MoviePoster'
import { Headshot } from '@/components/People/Headshot'
import { PersonCard } from '@/components/People/PersonCard'
import { StarRating } from '@/components/Reviews/StarRating'
import { StarRatingInput } from '@/components/Reviews/StarRatingInput'
import { Pagination } from '@/components/Pagination'
import { ResultRow } from '@/components/Search/ResultRow'
import { AvatarUploader } from '@/components/Settings/AvatarUploader'
import { ProfileForm } from '@/components/Settings/ProfileForm'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/SCN/avatar'
import { Badge } from '@/components/SCN/badge'
import { Button } from '@/components/SCN/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/SCN/card'
import { Checkbox } from '@/components/SCN/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/SCN/dialog'
import { Label } from '@/components/SCN/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/SCN/select'
import { Separator } from '@/components/SCN/separator'
import { Spinner } from '@/components/SCN/spinner'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/SCN/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/SCN/tooltip'
import { UserAvatar } from '@/components/UserAvatar'
import { genreInput } from '@/lib/dto/genres'
import type { PersonListItem } from '@/lib/dto/people'
import type { CurrentUser } from '@/lib/dto/users'
import type { ActionResult } from '@/types/api'
import styles from './styles.module.scss'

type ButtonVariant = NonNullable<ComponentProps<typeof Button>['variant']>
type ButtonSize = NonNullable<ComponentProps<typeof Button>['size']>
type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>

const BUTTON_VARIANTS: ButtonVariant[] = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
]
const BUTTON_SIZES: ButtonSize[] = ['xs', 'sm', 'default', 'lg']
const ICON_BUTTON_SIZES: ButtonSize[] = ['icon-xs', 'icon-sm', 'icon', 'icon-lg']
const BADGE_VARIANTS: BadgeVariant[] = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
]

const SAMPLE_PERSON: PersonListItem = {
  id: '0190d1a2-0000-7000-8000-00000000000a',
  slug: 'agnes-varda',
  name: 'Agnès Varda',
  headshotUrl: null,
  creditCount: 12,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
}

const AVATAR_SAMPLE_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#6366f1"/><circle cx="20" cy="16" r="7" fill="#e0e7ff"/><path d="M6 40c2-10 8-13 14-13s12 3 14 13z" fill="#e0e7ff"/></svg>',
)}`

const AVATAR_SIZES = ['sm', 'default', 'lg'] as const
const FRUITS = { apple: 'Apple', banana: 'Banana', cherry: 'Cherry' }

const TABLE_ROWS = [
  { id: 'INV-001', name: 'Ada Lovelace', status: 'Active' },
  { id: 'INV-002', name: 'Grace Hopper', status: 'Pending' },
  { id: 'INV-003', name: 'Alan Turing', status: 'Archived' },
]

const SAMPLE_USER: CurrentUser = {
  id: '0190d1a2-0000-7000-8000-000000000001',
  name: 'Ada Lovelace',
  username: 'ada',
  email: 'ada@example.com',
  emailVerified: true,
  image: null,
  role: 'editor',
}

const resolveAfter = <T,>(value: T, ms = 400) =>
  new Promise<T>((resolve) => {
    setTimeout(() => resolve(value), ms)
  })

const CONFIRM_OK: ActionResult<undefined> = { ok: true, data: undefined }
const CONFIRM_REFUSED: ActionResult<undefined> = {
  ok: false,
  code: 'VALIDATION',
  message: 'Remove the genre from its 3 movies first',
}
const NAME_OK: ActionResult<undefined> = { ok: true, data: undefined }
const NAME_TAKEN: ActionResult<undefined> = {
  ok: false,
  code: 'VALIDATION',
  message: 'Check the form',
  fieldErrors: { name: ['That genre already exists'] },
}

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

const Section = ({ id, eyebrow, title, description, children }: SectionProps) => {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <header className={styles.sectionHeader}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 id={`${id}-title`} className={styles.sectionTitle}>
          {title}
        </h2>
        <p className={styles.sectionDescription}>{description}</p>
      </header>
      <div className={styles.panel}>{children}</div>
    </section>
  )
}

export const UiKitView = () => {
  const [page, setPage] = useState(2)
  const [rating, setRating] = useState(3.5)

  return (
    <div className={styles.page}>
      <PageHeader
        title="UI Kit"
        description="Official shadcn primitives and application compositions, using the zippystarter theme."
        actions={<Badge variant="secondary">Next template</Badge>}
      />

      <Section
        id="button"
        eyebrow="Interaction"
        title="Button"
        description="Variants, sizes, icon treatments, and state behavior."
      >
        <div className={styles.stack}>
          <div className={styles.row}>
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
          <div className={styles.row}>
            {BUTTON_SIZES.map((size) => (
              <Button key={size} size={size}>
                {size}
              </Button>
            ))}
          </div>
          <div className={styles.row}>
            {ICON_BUTTON_SIZES.map((size) => (
              <Button key={size} size={size} variant="outline" aria-label={size}>
                <X aria-hidden="true" />
              </Button>
            ))}
          </div>
          <div className={styles.row}>
            <LoadingButton loading>Loading</LoadingButton>
            <Button disabled>Disabled</Button>
            <ButtonLink href="#button" variant="outline">
              Link
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section
        id="input"
        eyebrow="Forms"
        title="Input"
        description="Controls own their label, required marker, and error message."
      >
        <div className={styles.formGrid}>
          <Input aria-label="Plain input" placeholder="Plain input" />
          <Input label="With label" placeholder="Label above the control" />
          <Input label="Required" required placeholder="Required field" />
          <Input label="With error" error="This field is required" />
          <Input label="Disabled" disabled defaultValue="Disabled value" />
        </div>
      </Section>

      <Section
        id="textarea"
        eyebrow="Forms"
        title="Textarea"
        description="Multi-line text with the same label and error treatment as Input."
      >
        <div className={styles.formGrid}>
          <Textarea label="With label" placeholder="Write something" />
          <Textarea label="Required" required placeholder="Required field" />
          <Textarea label="With error" error="This field is required" />
        </div>
      </Section>

      <Section
        id="file-uploader"
        eyebrow="Forms"
        title="FileUploader"
        description="Picks one or many files, checks type and size from its props, and hands them to onUpload one after the other; each file shows waiting, uploading, uploaded or its error. This demo fails every file called fail."
      >
        <div className={styles.formGrid}>
          <FileUploader
            label="Add files"
            accept={['application/pdf', 'image/png', 'text/csv']}
            maxSize={1024 * 1024}
            multiple
            hint="PDF, PNG or CSV, up to 1 MB each. A file named fail.* is rejected."
            onUpload={async (file) => {
              await new Promise((resolve) => setTimeout(resolve, 800))
              if (file.name.startsWith('fail')) {
                throw new Error('The upload was rejected')
              }
            }}
          />
          <FileUploader
            label="Disabled"
            accept={['application/pdf']}
            maxSize={1024}
            disabled
            onUpload={async () => {}}
          />
        </div>
      </Section>

      <Section
        id="label"
        eyebrow="Forms"
        title="Label"
        description="The stock label is associated with a control using htmlFor."
      >
        <div className={styles.row}>
          <Label htmlFor="label-example">Example label</Label>
          <Input id="label-example" placeholder="Associated control" />
        </div>
      </Section>

      <Section
        id="checkbox"
        eyebrow="Forms"
        title="Checkbox"
        description="Checkboxes sit inside a native label so the whole row is clickable."
      >
        <div className={styles.row}>
          <label className={styles.checkboxLabel}>
            <Checkbox defaultChecked />
            Checked
          </label>
          <label className={styles.checkboxLabel}>
            <Checkbox />
            Unchecked
          </label>
          <label className={styles.checkboxLabel}>
            <Checkbox disabled />
            Disabled
          </label>
        </div>
      </Section>

      <Section
        id="select"
        eyebrow="Forms"
        title="Select"
        description="Single choice from a short list, with a placeholder."
      >
        <Select items={FRUITS}>
          <SelectTrigger aria-label="Fruit">
            <SelectValue placeholder="Pick a fruit" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FRUITS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Section>

      <Section
        id="badge"
        eyebrow="Display"
        title="Badge"
        description="Compact status and category markers."
      >
        <div className={styles.row}>
          {BADGE_VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </Section>

      <Section
        id="avatar"
        eyebrow="Display"
        title="Avatar"
        description="A picture with an initials fallback, in three sizes; also badges and groups."
      >
        <div className={styles.stack}>
          <div className={styles.row}>
            {AVATAR_SIZES.map((size) => (
              <Avatar key={size} size={size}>
                <AvatarImage src={AVATAR_SAMPLE_IMAGE} alt="" />
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
            ))}
            {AVATAR_SIZES.map((size) => (
              <Avatar key={`${size}-fallback`} size={size}>
                <AvatarFallback>GH</AvatarFallback>
              </Avatar>
            ))}
            <Avatar size="lg">
              <AvatarFallback>AT</AvatarFallback>
              <AvatarBadge />
            </Avatar>
          </div>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>GH</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </Section>

      <Section
        id="card"
        eyebrow="Display"
        title="Card"
        description="Header, content, and footer composition."
      >
        <Card>
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={styles.copy}>Card content goes here.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section
        id="separator"
        eyebrow="Display"
        title="Separator"
        description="Horizontal and vertical dividers."
      >
        <div className={styles.stack}>
          <Separator />
          <div className={styles.separatorRow}>
            <span>Left</span>
            <Separator orientation="vertical" />
            <span>Right</span>
          </div>
        </div>
      </Section>

      <Section
        id="spinner"
        eyebrow="Feedback"
        title="Spinner"
        description="Indeterminate loading indicator."
      >
        <div className={styles.row}>
          <Spinner />
        </div>
      </Section>

      <Section id="table" eyebrow="Display" title="Table" description="Semantic table primitives.">
        <Table>
          <TableCaption>A short list of people.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TABLE_ROWS.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section
        id="dialog"
        eyebrow="Overlay"
        title="Dialog"
        description="Modal dialog with title, description, and footer actions."
      >
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
              <DialogDescription>A short description of what this dialog does.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
              <DialogClose render={<Button />}>Confirm</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section
        id="tooltip"
        eyebrow="Overlay"
        title="Tooltip"
        description="Short hint shown on hover and focus."
      >
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </Section>

      <Section
        id="toast"
        eyebrow="Feedback"
        title="Toast"
        description="Transient notifications triggered with sonner."
      >
        <div className={styles.row}>
          <Button variant="outline" onClick={() => toast('Something happened')}>
            Default
          </Button>
          <Button variant="outline" onClick={() => toast.success('Saved successfully')}>
            Success
          </Button>
          <Button variant="outline" onClick={() => toast.error('Something went wrong')}>
            Error
          </Button>
        </div>
      </Section>

      <Section
        id="theme"
        eyebrow="Application components"
        title="Theme"
        description="Light, dark, or system preference. Changes persist across visits."
      >
        <ThemeToggle />
      </Section>

      <Section
        id="page-header"
        eyebrow="Application components"
        title="PageHeader"
        description="Title, description, and an actions slot."
      >
        <PageHeader
          title="Example page"
          description="A reusable application page header."
          actions={<Button size="sm">Primary action</Button>}
        />
      </Section>

      <Section
        id="empty"
        eyebrow="Application components"
        title="Empty"
        description="Placeholder for views without content."
      >
        <Empty
          title="Nothing here yet"
          description="Create your first item to get started."
          action={<Button size="sm">Create item</Button>}
        />
      </Section>

      <Section
        id="pagination"
        eyebrow="Application components"
        title="Pagination"
        description="Previous and next controls driven by local state."
      >
        <Pagination page={page} totalPages={5} onPageChange={setPage} />
      </Section>

      <Section
        id="star-rating"
        eyebrow="Application components"
        title="StarRating"
        description="A read-only rating in half stars, from ½ to 5, in three sizes. It is announced as one image."
      >
        <div className={styles.stack}>
          <div className={styles.row}>
            <StarRating rating={0} />
            <StarRating rating={0.5} />
            <StarRating rating={3.5} />
            <StarRating rating={5} />
          </div>
          <div className={styles.row}>
            <StarRating rating={4.5} size="sm" />
            <StarRating rating={4.5} size="md" />
            <StarRating rating={4.5} size="lg" />
          </div>
        </div>
      </Section>

      <Section
        id="star-rating-input"
        eyebrow="Application components"
        title="StarRatingInput"
        description="Picks a rating in half stars. Ten native radios sit over the stars, so the arrow keys work; hovering previews."
      >
        <div className={styles.stack}>
          <StarRatingInput value={rating} onChange={setRating} aria-label="Example rating" />
          <p className={styles.sectionDescription}>
            Rating: {rating === 0 ? 'none' : `${rating} stars`}
          </p>
          <StarRatingInput value={2} onChange={setRating} aria-label="Disabled rating" disabled />
          <StarRatingInput value={0} onChange={setRating} aria-label="Invalid rating" invalid />
        </div>
      </Section>

      <Section
        id="forms"
        eyebrow="Application components"
        title="Forms"
        description="React Hook Form with a Zod schema; the page owns the Server Action call."
      >
        <ProfileForm
          user={SAMPLE_USER}
          onSubmit={async (values) => {
            toast.success(`Submitted: ${values.name} (@${values.username})`)
            return { ok: true, data: null }
          }}
        />
      </Section>

      <Section
        id="record-actions"
        eyebrow="Application components"
        title="ActionButton / ActionLink / ActionGroup"
        description="A record's actions as icons with tooltips, always view, edit, delete in that order: quiet, neutral, red. ActionGroup pushes them to the end of a header, byline or table row."
      >
        <div className={styles.row}>
          <ActionGroup label="Example actions">
            <ActionLink action="view" label="View Dune" href="#record-actions" />
            <ActionButton
              action="edit"
              label="Edit Dune"
              onClick={() => toast.message('Edit clicked')}
            />
            <ActionButton
              action="delete"
              label="Delete Dune"
              onClick={() => toast.message('Delete clicked')}
            />
          </ActionGroup>
          <ActionButton
            action="delete"
            label="Delete Drama"
            disabled
            disabledReason="Remove the genre from its movies first"
          />
          <ConfirmDialog
            trigger="Delete Noir"
            triggerAction="delete"
            title="Delete Noir?"
            description="This cannot be undone."
            confirmLabel="Delete genre"
            onConfirm={() => resolveAfter(CONFIRM_OK)}
            onDone={() => toast.success('Genre deleted')}
          />
        </div>
      </Section>

      <Section
        id="shortcut-hint"
        eyebrow="Application components"
        title="ShortcutHint"
        description="Names the ⌘/Ctrl + Enter shortcut beside a submit button that submitOnShortcut presses. Appears once hydrated, never on touch screens."
      >
        <div className={styles.row}>
          <ShortcutHint action="to post comment" />
        </div>
      </Section>

      <Section
        id="confirm-dialog"
        eyebrow="Application components"
        title="ConfirmDialog"
        description="Asks before an irreversible write. A refusal is shown inside the dialog, which stays open."
      >
        <div className={styles.row}>
          <ConfirmDialog
            trigger="Delete"
            title="Delete this genre?"
            description="This cannot be undone."
            confirmLabel="Delete"
            onConfirm={() => resolveAfter(CONFIRM_OK)}
            onDone={() => toast.success('Genre deleted')}
          />
          <ConfirmDialog
            trigger="Delete (refused)"
            title="Delete this genre?"
            description="The server refuses, and the message appears here."
            confirmLabel="Delete"
            onConfirm={() => resolveAfter(CONFIRM_REFUSED)}
          />
          <ConfirmDialog
            trigger="Delete (disabled)"
            triggerTitle="Remove the genre from its movies first"
            title="Delete this genre?"
            description="This cannot be undone."
            confirmLabel="Delete"
            disabled
            onConfirm={() => resolveAfter(CONFIRM_OK)}
          />
        </div>
      </Section>

      <Section
        id="name-dialog"
        eyebrow="Application components"
        title="NameDialog"
        description="A one-field dialog that creates or renames a genre or a person, validated by the DTO schema."
      >
        <div className={styles.row}>
          <NameDialog
            trigger="Add genre"
            title="Add genre"
            label="Name"
            schema={genreInput}
            submitLabel="Create"
            onSubmit={() => resolveAfter(NAME_OK)}
            onDone={() => toast.success('Genre created')}
          />
          <NameDialog
            trigger="Rename"
            title="Rename genre"
            description="The slug follows the new name."
            label="Name"
            schema={genreInput}
            defaultName="Drama"
            submitLabel="Save"
            onSubmit={() => resolveAfter(NAME_OK)}
            onDone={() => toast.success('Genre renamed')}
          />
          <NameDialog
            trigger="Add genre (name taken)"
            title="Add genre"
            label="Name"
            schema={genreInput}
            submitLabel="Create"
            onSubmit={() => resolveAfter(NAME_TAKEN)}
          />
        </div>
      </Section>

      <Section
        id="stat-card"
        eyebrow="Application components"
        title="StatCard"
        description="One number of the dashboard overview, with an optional hint and link."
      >
        <div className={styles.statGrid}>
          <StatCard label="Movies" value={16} hint="2 without a poster" />
          <StatCard label="People" value={12345} href="#stat-card" />
          <StatCard label="Banned" value={0} />
        </div>
      </Section>

      <Section
        id="user-avatar"
        eyebrow="Application components"
        title="User avatar"
        description="A user's picture, with their initials until it loads or when there is none."
      >
        <div className={styles.row}>
          <UserAvatar name="Ada Lovelace" image={AVATAR_SAMPLE_IMAGE} size="lg" />
          <UserAvatar name="Grace Hopper" image={null} size="lg" />
        </div>
      </Section>

      <Section
        id="headshot"
        eyebrow="Application components"
        title="Headshot"
        description="A person's round photo, or their initials on a tinted disc, in the three catalog sizes."
      >
        <div className={styles.row}>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Headshot
              key={size}
              person={{ name: 'Agnès Varda', headshotUrl: AVATAR_SAMPLE_IMAGE }}
              size={size}
            />
          ))}
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Headshot key={size} person={{ name: 'Agnès Varda', headshotUrl: null }} size={size} />
          ))}
        </div>
      </Section>

      <Section
        id="person-card"
        eyebrow="Application components"
        title="PersonCard"
        description="A person on the people grid, linking to their page with their credit count."
      >
        <div className={styles.statGrid}>
          <PersonCard person={SAMPLE_PERSON} />
          <PersonCard
            person={{ ...SAMPLE_PERSON, headshotUrl: AVATAR_SAMPLE_IMAGE, creditCount: 1 }}
          />
        </div>
      </Section>

      <Section
        id="result-row"
        eyebrow="Application components"
        title="ResultRow"
        description="A search result: a poster or headshot, the title and a line of details, the whole row a link."
      >
        <ul className={styles.stack}>
          <li>
            <ResultRow
              href="#result-row"
              media={<MoviePoster movie={{ title: 'Cléo from 5 to 7', posterUrl: null }} />}
              title="Cléo from 5 to 7"
              details={['1962', 'Drama']}
            />
          </li>
          <li>
            <ResultRow
              href="#result-row"
              media={<Headshot person={SAMPLE_PERSON} size="sm" />}
              title={SAMPLE_PERSON.name}
              details={['12 credits']}
            />
          </li>
        </ul>
      </Section>

      <Section
        id="avatar-uploader"
        eyebrow="Application components"
        title="Avatar uploader"
        description="Picks a file, asks for a presigned upload ticket, sends it to storage, then attaches it. The catalog's handlers refuse, so nothing is uploaded."
      >
        <AvatarUploader
          name="Ada Lovelace"
          image={null}
          onCreateUpload={async () => ({
            ok: false,
            code: 'FORBIDDEN',
            message: 'Uploads are disabled in the catalog.',
          })}
          onAttach={async () => ({
            ok: false,
            code: 'FORBIDDEN',
            message: 'Uploads are disabled in the catalog.',
          })}
        />
      </Section>
    </div>
  )
}
