import { useId } from 'react'
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { cn } from '../../lib/cn'

const CONTROL =
  'w-full rounded-[var(--radius-input)] border bg-surface px-3.5 text-[15px] text-fg placeholder:text-fg-subtle transition-colors duration-200 focus:border-accent focus:outline-none'

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-fg">
      {children}
    </label>
  )
}

function Message({
  error,
  helper,
  id,
}: {
  error?: string
  helper?: string
  id: string
}) {
  if (error) {
    return (
      <p id={id} className="text-xs font-medium text-danger">
        {error}
      </p>
    )
  }
  if (helper) {
    return (
      <p id={id} className="text-xs text-fg-subtle">
        {helper}
      </p>
    )
  }
  return null
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  helper?: string
  error?: string
}

export function TextField({
  label,
  helper,
  error,
  className,
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const msgId = `${fieldId}-msg`
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={helper || error ? msgId : undefined}
        className={cn(
          CONTROL,
          'h-11',
          error ? 'border-danger' : 'border-border-strong',
          className,
        )}
        {...rest}
      />
      <Message error={error} helper={helper} id={msgId} />
    </div>
  )
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  helper?: string
  error?: string
}

export function TextArea({
  label,
  helper,
  error,
  className,
  id,
  ...rest
}: TextAreaProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const msgId = `${fieldId}-msg`
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <textarea
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={helper || error ? msgId : undefined}
        className={cn(
          CONTROL,
          'min-h-[120px] resize-y py-3 leading-relaxed',
          error ? 'border-danger' : 'border-border-strong',
          className,
        )}
        {...rest}
      />
      <Message error={error} helper={helper} id={msgId} />
    </div>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  helper?: string
  error?: string
}

export function SelectField({
  label,
  helper,
  error,
  className,
  id,
  children,
  ...rest
}: SelectFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const msgId = `${fieldId}-msg`
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <select
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={helper || error ? msgId : undefined}
        className={cn(
          CONTROL,
          'h-11 appearance-none bg-[length:16px] pr-10 bg-[right_0.85rem_center] bg-no-repeat',
          error ? 'border-danger' : 'border-border-strong',
          className,
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 256 256'%3E%3Cpath fill='%236f858c' d='M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32Z'/%3E%3C/svg%3E\")",
        }}
        {...rest}
      >
        {children}
      </select>
      <Message error={error} helper={helper} id={msgId} />
    </div>
  )
}
