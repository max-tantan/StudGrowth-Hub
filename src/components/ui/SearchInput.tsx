import { Icon } from './Icon'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3.5 focus-within:border-accent">
      <Icon name="search" size={18} className="text-fg-subtle" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder ?? 'Cari'}
        className="h-11 flex-1 bg-transparent text-[15px] text-fg placeholder:text-fg-subtle focus:outline-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Hapus pencarian"
          onClick={() => onChange('')}
          className="text-fg-subtle hover:text-fg"
        >
          <Icon name="close" size={16} weight="bold" />
        </button>
      )}
    </div>
  )
}
