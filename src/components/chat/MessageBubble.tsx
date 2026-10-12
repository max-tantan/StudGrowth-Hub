import type { ChatMessage } from '../../types'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'
import { RiskNotice } from './RiskNotice'

const SUGGESTION_ICON: Record<string, IconName> = {
  aksi: 'lightning',
  jurnal: 'note',
  sumber: 'book',
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isAi = message.role === 'ai'
  return (
    <div className={cn('flex', isAi ? 'justify-start' : 'justify-end')}>
      <div className="max-w-[87%]">
        {isAi && (
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-fg-subtle">
            <Icon name="sparkle" size={13} weight="fill" />
            Asisten Ruang Tumbuh
          </div>
        )}
        <div
          className={cn(
            'whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed',
            isAi
              ? 'rounded-tl-md border border-border bg-surface text-fg'
              : 'rounded-tr-md bg-accent text-fg-on-accent',
          )}
        >
          {message.text}
        </div>

        {message.risk && <RiskNotice message={message} />}

        {message.suggestion && (
          <div className="mt-2 flex items-start gap-2 rounded-2xl rounded-tl-md border border-accent/20 bg-accent-tint px-3 py-2.5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-accent-strong">
              <Icon
                name={SUGGESTION_ICON[message.suggestion.kind] ?? 'sparkle'}
                size={14}
                weight="fill"
              />
            </span>
            <div className="min-w-0">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-accent-strong">
                Saran {message.suggestion.kind}
              </p>
              <p className="text-[13px] text-fg text-pretty">
                {message.suggestion.text}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
