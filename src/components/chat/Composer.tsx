import { useState } from 'react'
import { cn } from '../../lib/cn'
import { IconButton } from '../ui/Button'

interface ComposerProps {
  onSend: (text: string) => void
  disabled?: boolean
  placeholder?: string
}

export function Composer({
  onSend,
  disabled = false,
  placeholder = 'Tulis apa yang kamu rasakan atau pikirkan…',
}: ComposerProps) {
  const [text, setText] = useState('')
  const canSend = text.trim().length > 0 && !disabled

  const submit = () => {
    if (!canSend) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-bg/90 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md">
      <div className="flex items-end gap-2 rounded-[22px] border border-border-strong bg-surface p-1.5 pl-3.5 focus-within:border-accent">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          rows={1}
          placeholder={placeholder}
          aria-label="Tulis pesan"
          className={cn(
            'max-h-32 min-h-[24px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-snug text-fg placeholder:text-fg-subtle focus:outline-none',
          )}
        />
        <IconButton
          name="send"
          label="Kirim"
          variant="primary"
          onClick={submit}
          disabled={!canSend}
          className={cn(!canSend && 'opacity-40')}
        />
      </div>
      <p className="mt-1.5 px-1 text-center text-[10.5px] text-fg-subtle">
        Asisten ini simulasi (mock) untuk prototipe, bukan pengganti bantuan
        profesional.
      </p>
    </div>
  )
}
