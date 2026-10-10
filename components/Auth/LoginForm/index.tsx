'use client'
// React Hook Form's `register()` must run on every render; the React Compiler would cache it.
'use no memo'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/Form/Input'
import { LoadingButton } from '@/components/LoadingButton'
import { Button } from '@/components/SCN/button'
import { ROUTE_FORGOT_PASSWORD, ROUTE_SIGNUP } from '@/lib/constants-routes'
import { signInInput, type SignInInput } from '@/lib/dto/auth'
import { applyActionErrors } from '@/lib/formErrors'
import type { ActionResult } from '@/types/api'
import styles from './styles.module.scss'

export type LoginFormProps = {
  onSubmit: (values: SignInInput) => Promise<ActionResult<unknown>>
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInInput),
    defaultValues: { email: '', password: '' },
  })

  const submit = handleSubmit(async (values) => {
    const result = await onSubmit(values)
    if (!result.ok) {
      applyActionErrors(result, ['email', 'password'], setError)
    }
  })

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        error={errors.password?.message}
        {...register('password')}
      />
      <Link className={styles.forgotLink} href={ROUTE_FORGOT_PASSWORD}>
        Forgot password?
      </Link>
      {errors.root?.server && (
        <p className={styles.formError} role="alert">
          {errors.root.server.message}
        </p>
      )}
      <LoadingButton type="submit" loading={isSubmitting}>
        Sign in
      </LoadingButton>
      {process.env.NODE_ENV !== 'production' && (
        <div className={styles.devLogins}>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setValue('email', 'leanne@example.com')
              setValue('password', 'password123')
            }}
          >
            User
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setValue('email', 'admin@example.com')
              setValue('password', 'password123')
            }}
          >
            Admin
          </Button>
        </div>
      )}
      <p className={styles.footer}>
        No account? <Link href={ROUTE_SIGNUP}>Sign up</Link>
      </p>
    </form>
  )
}
