/**
 * Centralized presentation configuration for the FluxBooks core components.
 *
 * Every variant / size / color class map lives here so the design system is
 * controlled from one file. All classes use semantic theme tokens
 * (`bg-surface`, `text-foreground`, `bg-primary`, ...) defined in
 * `tailwind.config.js` + `shared/config/themes/*` — which is what makes every
 * component react to light / dark / custom themes with zero per-component work.
 *
 * `.vue` files only look classes up from here; they never declare styling maps
 * of their own.
 */

import type {
  AvatarShape,
  AvatarSize,
  BadgeColor,
  BadgePosition,
  BadgeVariant,
  ButtonSize,
  ButtonVariant,
  CheckboxSize,
  ControlColor,
  DialogSize,
  DrawerAnchor,
  DrawerWidth,
  NavbarAlignment,
  NavbarFixation,
  PaginationSize,
  RadioColor,
  RadioSize,
  SelectSize,
  SelectVariant,
  StatusPillVariant,
  StatusTone,
  TableDensity,
  ToggleSize,
  TooltipPosition,
} from './types'

/* --------------------------------- button ---------------------------------- */

export const buttonConfig = {
  base: 'inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
  block: 'w-full',
  variants: {
    primary: 'bg-primary hover:bg-primary-hover text-on-primary focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary-hover text-on-secondary focus:ring-secondary-hover',
    inverted: 'bg-inverse hover:bg-inverse/90 text-inverse-foreground focus:ring-inverse',
    outline: 'bg-surface border border-border-strong hover:bg-surface-hover text-foreground focus:ring-border-strong',
    ghost: 'bg-transparent hover:bg-surface-muted text-foreground focus:ring-border',
    danger: 'bg-danger hover:bg-danger/90 text-on-primary focus:ring-danger',
    link: 'bg-transparent hover:underline text-accent p-0 focus:ring-0 rounded-none active:scale-100',
  } satisfies Record<ButtonVariant, string>,
  sizes: {
    sm: 'h-9 px-3 text-xs gap-1.5',
    md: 'h-11 px-5 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
  } satisfies Record<ButtonSize, string>,
  iconSizes: { sm: 14, md: 16, lg: 18 } satisfies Record<ButtonSize, number>,
  spinnerSizes: {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  } satisfies Record<ButtonSize, string>,
  defaults: {
    variant: 'primary' as ButtonVariant,
    size: 'md' as ButtonSize,
    iconPosition: 'left' as const,
    type: 'button' as const,
  },
}

/* ---------------------------------- input ---------------------------------- */

export const inputConfig = {
  wrapper: 'flex flex-col gap-1.5 w-full',
  label: 'font-sans text-xs font-bold text-foreground ml-0.5',
  base: 'w-full h-11 bg-surface border rounded-lg outline-none font-sans text-xs transition-all duration-200 text-foreground placeholder:text-subtle focus:ring-2 focus:ring-primary/20 disabled:bg-surface-muted disabled:text-subtle disabled:border-border disabled:cursor-not-allowed',
  states: {
    normal: 'border-border focus:border-primary',
    error: 'border-danger focus:border-danger',
  },
  iconWrap: 'absolute left-4 top-1/2 -translate-y-1/2 text-subtle group-focus-within:text-primary transition-colors pointer-events-none',
  paddings: {
    withIcon: 'pl-11',
    plain: 'pl-4',
    withToggle: 'pr-11',
    plainRight: 'pr-4',
  },
  passwordToggle: 'absolute right-4 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground focus:outline-none transition-colors cursor-pointer',
  error: 'font-sans text-[11px] text-danger font-medium ml-0.5 mt-0.5 flex items-center gap-1',
  errorDot: 'w-1.5 h-1.5 rounded-full bg-danger inline-block',
}

/* --------------------------------- textarea --------------------------------- */

export const textareaConfig = {
  wrapper: 'w-full text-left font-sans',
  header: 'flex items-center justify-between mb-1.5 select-none',
  label: 'block text-xs font-bold text-foreground uppercase tracking-wider',
  counter: { normal: 'text-subtle', exceeded: 'text-danger' },
  base: 'w-full rounded-lg border text-xs sm:text-sm font-medium p-3.5 transition-all outline-none resize-none bg-surface text-foreground placeholder:text-subtle focus:ring-2 focus:ring-primary/15 focus:border-primary',
  states: {
    normal: 'border-border-strong',
    error: 'border-danger focus:border-danger focus:ring-danger/10',
    disabled: 'bg-surface-muted border-border text-subtle pointer-events-none',
  },
  error: 'text-xs text-danger font-semibold mt-1',
  rows: { 'fixed-height': 4, 'auto-grow': 2 },
}

/* --------------------------------- checkbox --------------------------------- */

export const checkboxConfig = {
  wrapper: 'flex items-start gap-2.5 font-sans select-none',
  disabled: 'opacity-50 pointer-events-none',
  enabled: 'cursor-pointer',
  input: 'rounded focus:ring-2 focus:ring-offset-2 transition-all border-border-strong bg-surface',
  colors: {
    primary: 'text-primary focus:ring-primary',
    success: 'text-success focus:ring-success',
  } satisfies Record<ControlColor, string>,
  sizes: {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  } satisfies Record<CheckboxSize, string>,
  label: 'text-xs font-bold text-foreground block',
  description: 'text-[10px] text-subtle block font-medium leading-relaxed',
}

/* ---------------------------------- radio ----------------------------------- */

export const radioConfig = {
  wrapper: 'font-sans text-left',
  groupLabel: 'block text-xs font-bold text-foreground uppercase tracking-wider mb-2 select-none',
  layouts: {
    'horizontal-row': 'flex flex-row flex-wrap gap-3',
    'vertical-stack': 'flex flex-col gap-3',
  },
  option: {
    base: 'flex items-start gap-3 p-3 rounded-xl border transition-all select-none',
    selected: 'bg-primary/5 border-primary/30',
    unselected: 'bg-surface border-border hover:bg-surface-hover',
  },
  input: 'rounded-full focus:ring-2 focus:ring-offset-2 border-border-strong bg-surface',
  colors: {
    primary: 'text-primary focus:ring-primary',
    info: 'text-info focus:ring-info',
    accent: 'text-accent focus:ring-accent',
  } satisfies Record<RadioColor, string>,
  sizes: {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  } satisfies Record<RadioSize, string>,
  optionLabel: { selected: 'text-foreground', unselected: 'text-muted' },
  optionDescription: 'text-[10px] text-subtle block font-medium leading-relaxed',
}

/* ---------------------------------- toggle ---------------------------------- */

export const toggleConfig = {
  wrapper: 'inline-flex items-center gap-3 font-sans select-none',
  track: 'rounded-full flex items-center transition-colors duration-200 relative shadow-inner',
  trackOff: 'bg-border',
  trackOn: {
    primary: 'bg-primary',
    success: 'bg-success',
  } satisfies Record<ControlColor, string>,
  trackSizes: {
    xs: 'w-7 h-4',
    sm: 'w-9 h-5',
    md: 'w-11 h-6',
  } satisfies Record<ToggleSize, string>,
  dot: 'bg-surface rounded-full transition-transform duration-200 shadow-md transform',
  dotSizes: {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  } satisfies Record<ToggleSize, string>,
  dotOff: 'translate-x-0.5',
  dotOn: {
    xs: 'translate-x-[14px]',
    sm: 'translate-x-[18px]',
    md: 'translate-x-[22px]',
  } satisfies Record<ToggleSize, string>,
  label: 'text-xs font-bold text-foreground',
}

/* ---------------------------------- select ---------------------------------- */

export const selectConfig = {
  wrapper: 'w-full text-left font-sans',
  label: 'block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5 select-none',
  base: 'w-full flex items-center justify-between rounded-lg border text-left font-sans transition-all focus:outline-none focus:ring-2 focus:ring-primary/20',
  sizes: {
    sm: 'h-9 px-3 text-xs',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  } satisfies Record<SelectSize, string>,
  variants: {
    outline: {
      normal: 'bg-surface border-border-strong hover:border-primary/50 text-foreground focus:border-primary',
      error: 'bg-surface border-danger text-foreground',
    },
    soft: {
      normal: 'bg-surface-muted border-transparent hover:bg-surface-hover text-foreground focus:bg-surface focus:border-primary',
      error: 'bg-danger/10 border-danger/40 text-foreground',
    },
  } satisfies Record<SelectVariant, { normal: string; error: string }>,
  disabled: 'opacity-50 pointer-events-none bg-surface-muted border-border text-subtle',
  enabled: 'cursor-pointer',
  chevron: 'w-4 h-4 text-subtle transition-transform duration-200',
  dropdown: 'absolute z-50 left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-xl overflow-hidden max-h-64 flex flex-col animate-fade-in',
  dropdownSearch: 'p-2 border-b border-border flex items-center bg-surface-muted',
  dropdownSearchInput: 'w-full bg-transparent border-none text-xs focus:outline-none p-1 text-foreground placeholder:text-subtle',
  option: {
    base: 'w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-surface-hover transition-colors',
    selected: 'text-primary bg-primary/5',
    unselected: 'text-muted',
  },
  optionDot: 'w-1.5 h-1.5 rounded-full bg-primary',
  empty: 'px-4 py-3 text-xs text-subtle text-center',
  error: 'text-xs text-danger font-semibold mt-1 flex items-center gap-1',
}

/* -------------------------------- multiselect ------------------------------- */

export const multiselectConfig = {
  wrapper: 'w-full text-left font-sans',
  label: selectConfig.label,
  control: 'w-full flex items-center justify-between rounded-lg border bg-surface text-left text-xs sm:text-sm transition-all focus-within:ring-2 focus-within:ring-primary/10 cursor-pointer min-h-[44px] p-1.5',
  controlStates: {
    normal: 'border-border-strong hover:border-primary/50',
    disabled: 'opacity-50 pointer-events-none bg-surface-muted border-border',
  },
  placeholder: 'text-subtle font-medium px-2 py-1',
  tag: 'flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md border border-primary/15 shrink-0 max-w-full',
  tagRemove: 'hover:text-danger cursor-pointer p-0.5 rounded-sm hover:bg-danger/10',
  overflowTag: 'bg-surface-muted border border-border text-muted text-xs font-bold px-2 py-1 rounded-md shrink-0',
  /** Max chips shown before collapsing in the tags-wrap variant. */
  wrapVisibleCount: 2,
  dropdown: selectConfig.dropdown,
  dropdownSearch: selectConfig.dropdownSearch,
  dropdownSearchInput: selectConfig.dropdownSearchInput,
  empty: selectConfig.empty,
  maxNotice: 'px-4 py-1.5 bg-warning/10 text-warning text-[10px] font-bold text-center border-b border-warning/20 select-none',
  option: {
    base: 'w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors disabled:opacity-40 cursor-pointer',
    selected: 'bg-primary/5 text-primary',
    unselected: 'text-muted hover:bg-surface-hover',
  },
  optionBox: {
    base: 'w-3.5 h-3.5 rounded border flex items-center justify-center transition-all',
    checked: 'border-primary bg-primary',
    unchecked: 'border-border-strong',
  },
}

/* -------------------------------- datepicker -------------------------------- */

export const datePickerConfig = {
  wrapper: 'w-full text-left font-sans',
  label: selectConfig.label,
  trigger: 'w-full flex items-center justify-between rounded-lg border h-11 px-4 text-xs sm:text-sm font-semibold transition-all focus:ring-2 focus:ring-primary/15 text-foreground bg-surface text-left cursor-pointer',
  triggerStates: {
    normal: 'border-border-strong hover:border-primary/50',
    disabled: 'opacity-50 pointer-events-none bg-surface-muted border-border',
  },
  popover: 'absolute z-50 mt-2 bg-surface border border-border rounded-xl shadow-xl p-4 w-72 animate-fade-in right-0 sm:left-0',
  header: 'flex items-center justify-between mb-3 border-b border-border pb-2',
  navButton: 'p-1 hover:bg-surface-muted rounded-lg text-subtle cursor-pointer disabled:opacity-40 disabled:pointer-events-none',
  monthLabel: 'text-xs font-bold text-foreground',
  preset: 'px-2 py-1 bg-surface-muted hover:bg-primary/10 border border-border hover:border-primary/30 rounded text-[10px] font-bold text-muted hover:text-primary cursor-pointer transition-colors',
  lockedNotice: 'mb-2 px-2 py-1 bg-warning/10 text-warning text-[9px] font-bold rounded border border-warning/20 text-center uppercase tracking-wider select-none',
  weekday: 'grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-subtle mb-1',
  day: {
    base: 'h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer',
    selected: 'bg-primary text-on-primary shadow',
    inRange: 'bg-primary/10 text-primary',
    normal: 'text-muted hover:bg-surface-muted',
    disabled: 'text-subtle/50 pointer-events-none',
  },
}

/* --------------------------------- data table ------------------------------- */

export const dataTableConfig = {
  wrapper: 'w-full border border-border rounded-xl overflow-hidden bg-surface shadow-sm font-sans text-left',
  scroll: 'overflow-x-auto relative max-h-[500px] scrollbar-thin',
  table: 'w-full text-xs sm:text-sm text-left border-collapse',
  thead: 'sticky top-0 bg-surface-muted border-b border-border z-10 text-muted font-bold uppercase select-none',
  th: 'py-3 px-5 text-[10px] sm:text-xs font-black text-muted uppercase tracking-wider whitespace-nowrap',
  sortButton: 'flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer',
  tbody: 'divide-y divide-border font-medium text-muted',
  row: {
    base: 'hover:bg-surface-hover transition-colors group cursor-pointer',
    selected: 'bg-primary/5',
    striped: 'bg-surface-muted/40',
  },
  expandButton: 'p-1 hover:bg-surface-muted rounded text-subtle hover:text-primary transition-colors cursor-pointer',
  cell: 'whitespace-nowrap',
  cellText: 'font-semibold text-foreground',
  densities: {
    compact: 'py-2 px-3.5',
    comfortable: 'py-4 px-5',
  } satisfies Record<TableDensity, string>,
  expandedRow: 'bg-surface-muted/40',
  expandedPanel: 'px-6 py-4 border border-dashed border-border rounded-xl bg-surface shadow-inner animate-fade-in',
  empty: 'text-center p-12 text-subtle font-bold select-none',
}

/* -------------------------------- pagination -------------------------------- */

export const paginationConfig = {
  wrapper: 'flex items-center justify-between font-sans select-none w-full',
  metrics: 'text-[10px] sm:text-xs text-muted font-bold',
  metricsValue: 'text-foreground font-extrabold',
  arrowButton: 'border border-border bg-surface rounded-lg hover:bg-surface-hover text-muted transition-all cursor-pointer disabled:opacity-45 disabled:pointer-events-none flex items-center gap-1.5 font-bold',
  arrowSizes: {
    sm: 'px-2.5 py-1.5 text-[10px]',
    md: 'px-4 py-2.5 text-xs',
  } satisfies Record<PaginationSize, string>,
  iconButton: 'border border-border bg-surface hover:bg-surface-hover rounded-lg p-2 text-muted disabled:opacity-45 disabled:pointer-events-none cursor-pointer transition-colors',
  page: {
    base: 'rounded-lg font-bold flex items-center justify-center transition-all cursor-pointer border',
    active: 'bg-primary border-primary text-on-primary shadow-sm font-black',
    inactive: 'bg-surface border-border hover:bg-surface-hover text-muted',
  },
  pageSizes: {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
  } satisfies Record<PaginationSize, string>,
  ellipsis: 'px-2 text-subtle font-extrabold text-sm',
}

/* -------------------------------- search bar -------------------------------- */

export const searchBarConfig = {
  wrapper: 'w-full font-sans select-none',
  input: 'w-full h-11 pl-10 pr-12 rounded-lg border border-border-strong hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 text-xs sm:text-sm font-medium outline-none bg-surface transition-all text-foreground placeholder:text-subtle',
  inputIcon: 'absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none',
  kbd: 'hidden sm:inline-flex items-center gap-0.5 h-6 px-1.5 rounded border border-border bg-surface-muted text-[9px] font-black text-subtle shadow-sm uppercase tracking-widest',
  paletteTrigger: 'w-full h-11 px-4 rounded-lg border border-border hover:border-primary/50 bg-surface-muted hover:bg-surface text-left text-xs sm:text-sm font-semibold text-subtle flex items-center justify-between cursor-pointer shadow-inner transition-all',
  overlay: 'fixed inset-0 bg-overlay/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 animate-fade-in',
  palette: 'bg-surface border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[480px]',
  paletteHeader: 'p-4 border-b border-border flex items-center justify-between gap-3 bg-surface-muted',
  paletteInput: 'w-full bg-transparent border-none text-sm font-bold text-foreground focus:outline-none p-1 placeholder:text-subtle',
  resultsPane: 'flex-1 overflow-y-auto p-2.5 space-y-3 max-h-[350px] scrollbar-thin',
  result: 'w-full text-left p-3 hover:bg-primary/5 rounded-xl flex items-center justify-between group transition-colors cursor-pointer border border-transparent hover:border-primary/10',
  resultCategory: 'text-[9px] uppercase tracking-wider font-extrabold text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20',
  resultTitle: 'text-xs font-extrabold text-foreground group-hover:text-primary',
  resultSubtitle: 'text-[10px] text-subtle font-medium pl-1',
  resultAction: 'opacity-0 group-hover:opacity-100 transition-all text-xs text-accent font-extrabold flex items-center gap-1',
  emptyTitle: 'text-xs font-bold text-foreground',
  emptyHint: 'text-[10px] text-subtle mt-1',
  spinner: 'animate-spin text-accent',
  debounceMs: 250,
}

/* -------------------------------- upload zone ------------------------------- */

export const uploadZoneConfig = {
  wrapper: 'w-full font-sans text-center',
  zone: 'border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden select-none cursor-pointer',
  zoneStates: {
    idle: 'border-border-strong hover:border-primary/50 bg-surface-muted/40',
    dragOver: 'border-info bg-info/5 scale-[1.02] shadow-lg shadow-info/10',
  },
  iconWrap: {
    idle: 'p-3.5 rounded-2xl transition-transform duration-300 bg-primary/10 text-primary',
    dragOver: 'p-3.5 rounded-2xl transition-transform duration-300 bg-info/10 text-info scale-110',
    processing: 'p-3 bg-primary/10 rounded-full text-primary animate-spin',
    success: 'p-3.5 bg-success/10 rounded-2xl text-success animate-scale-up',
  },
  title: 'text-xs sm:text-sm font-black text-foreground',
  hint: 'text-[10px] sm:text-xs text-subtle font-bold mt-1',
  processingTitle: 'text-xs font-black text-foreground uppercase tracking-widest',
  processingHint: 'text-[10px] text-subtle font-bold',
  completeTitle: 'text-xs sm:text-sm font-extrabold text-foreground uppercase tracking-wider',
  fileRow: 'flex items-center gap-2.5 p-2.5 bg-surface border border-border rounded-xl text-left shadow-sm animate-fade-in',
  fileName: 'text-xs font-extrabold text-foreground truncate',
  fileSize: 'text-[9px] text-subtle font-bold',
}

/* ---------------------------------- badge ----------------------------------- */

export const badgeConfig = {
  base: 'font-sans uppercase tracking-wider shadow-sm',
  variants: {
    solid: {
      primary: 'bg-primary text-on-primary',
      success: 'bg-success text-on-primary',
      warning: 'bg-warning text-on-primary',
      danger: 'bg-danger text-on-primary',
      neutral: 'bg-muted text-on-primary',
    },
    subtle: {
      primary: 'bg-primary/10 text-primary border border-primary/15',
      success: 'bg-success/10 text-success border border-success/20',
      warning: 'bg-warning/10 text-warning border border-warning/20',
      danger: 'bg-danger/10 text-danger border border-danger/20',
      neutral: 'bg-surface-muted text-muted border border-border',
    },
    outline: {
      primary: 'bg-surface border border-primary text-primary',
      success: 'bg-surface border border-success text-success',
      warning: 'bg-surface border border-warning text-warning',
      danger: 'bg-surface border border-danger text-danger',
      neutral: 'bg-surface border border-border-strong text-muted',
    },
  } satisfies Record<BadgeVariant, Record<BadgeColor, string>>,
  positions: {
    'standalone-inline': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold select-none',
    'absolute-top-right': 'absolute -top-1.5 -right-1.5 z-10 translate-x-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[9px] font-black',
  } satisfies Record<BadgePosition, string>,
}

/* -------------------------------- status pill ------------------------------- */

export const statusPillConfig = {
  base: 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black font-sans uppercase tracking-wider select-none shadow-sm transition-all',
  variants: {
    'solid-fill': {
      success: 'bg-success text-on-primary',
      warning: 'bg-warning text-on-primary',
      danger: 'bg-danger text-on-primary',
      neutral: 'bg-muted text-on-primary',
    },
    'border-only': {
      success: 'bg-success/10 border border-success/40 text-success',
      warning: 'bg-warning/10 border border-warning/40 text-warning',
      danger: 'bg-danger/10 border border-danger/40 text-danger',
      neutral: 'bg-surface-muted border border-border-strong text-muted',
    },
    'dashed-border': {
      success: 'bg-surface border border-dashed border-success/60 text-success',
      warning: 'bg-surface border border-dashed border-warning/60 text-warning',
      danger: 'bg-surface border border-dashed border-danger/60 text-danger',
      neutral: 'bg-surface border border-dashed border-border-strong text-subtle',
    },
  } satisfies Record<StatusPillVariant, Record<StatusTone, string>>,
  /** Lucide icon per tone; text defaults come from i18n `core.statusPill.*`. */
  icons: {
    success: 'CheckCircle2',
    warning: 'AlertTriangle',
    danger: 'AlertOctagon',
    neutral: 'CornerDownRight',
  } satisfies Record<StatusTone, string>,
}

/* ---------------------------------- avatar ---------------------------------- */

export const avatarConfig = {
  base: 'flex items-center justify-center font-bold font-sans overflow-hidden bg-primary/5 text-primary border border-primary/10 shrink-0 shadow-inner',
  sizes: {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
  } satisfies Record<AvatarSize, string>,
  shapes: {
    circle: 'rounded-full',
    square: 'rounded-xl',
  } satisfies Record<AvatarShape, string>,
  initials: 'font-extrabold uppercase select-none tracking-wider',
  placeholderIcon: 'w-1/2 h-1/2 text-subtle stroke-[2.5px]',
}

/* ---------------------------------- tooltip --------------------------------- */

export const tooltipConfig = {
  wrapper: 'relative inline-block font-sans',
  body: 'absolute z-50 bg-inverse text-inverse-foreground text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap animate-fade-in pointer-events-none select-none',
  positions: {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  } satisfies Record<TooltipPosition, string>,
  arrows: {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-inverse border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-inverse border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-inverse border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-inverse border-y-transparent border-l-transparent',
  } satisfies Record<TooltipPosition, string>,
  arrowBase: 'absolute border-4',
}

/* -------------------------------- progress bar ------------------------------ */

export const progressBarConfig = {
  wrapper: 'w-full font-sans',
  track: 'w-full h-2.5 bg-surface-muted rounded-full overflow-hidden',
  fill: 'h-full bg-primary transition-all duration-500 ease-out rounded-full',
  segmentTrack: 'h-2 flex-1 bg-surface-muted rounded-sm overflow-hidden relative',
  segmentFill: 'h-full bg-primary transition-all duration-300 ease-out',
  segmentGap: 'flex gap-1.5 w-full',
}

/* --------------------------------- accordion -------------------------------- */

export const accordionConfig = {
  wrapper: 'space-y-2 w-full font-sans text-left',
  item: 'border border-border rounded-xl bg-surface overflow-hidden shadow-sm transition-all',
  trigger: 'w-full flex items-center justify-between p-4 bg-surface-muted/50 hover:bg-surface-hover text-left cursor-pointer focus:outline-none',
  title: 'text-xs sm:text-sm font-extrabold text-foreground',
  chevron: 'w-4 h-4 text-subtle transition-transform duration-200 shrink-0',
  chevronOpen: 'rotate-180 text-primary',
  body: 'p-4 border-t border-border bg-surface text-xs sm:text-sm text-muted font-medium leading-relaxed animate-fade-in',
}

/* -------------------------------- breadcrumb -------------------------------- */

export const breadcrumbConfig = {
  wrapper: 'flex items-center font-sans select-none',
  list: 'flex items-center gap-1.5 sm:gap-2.5 flex-wrap',
  item: 'flex items-center gap-1.5 sm:gap-2.5',
  link: 'text-xs font-bold text-muted hover:text-primary transition-colors',
  current: 'text-xs font-extrabold text-foreground',
  ellipsis: 'text-subtle font-bold px-1 select-none',
  separator: 'w-3.5 h-3.5 text-subtle stroke-[2.5px] shrink-0',
  separatorIcons: {
    chevron: 'ChevronRight',
    slash: 'Slash',
    arrow: 'ArrowRight',
  },
}

/* ---------------------------------- dialog ---------------------------------- */

export const dialogConfig = {
  root: 'fixed inset-0 z-50 overflow-y-auto flex items-center justify-center font-sans',
  backdrop: 'fixed inset-0 bg-overlay/40 backdrop-blur-sm transition-opacity',
  panel: 'bg-surface border border-border shadow-2xl relative z-10 flex flex-col overflow-hidden animate-scale-up',
  panelRounded: 'rounded-2xl max-h-[90vh]',
  panelFullscreen: 'h-full',
  sizes: {
    sm: 'max-w-sm w-full m-4',
    md: 'max-w-md w-full m-4',
    lg: 'max-w-lg w-full m-4',
    xl: 'max-w-2xl w-full m-4',
    fullscreen: 'fixed inset-0 w-full h-full rounded-none',
  } satisfies Record<DialogSize, string>,
  header: 'px-5 py-4 border-b border-border flex items-center justify-between bg-surface-muted shrink-0',
  title: 'text-xs sm:text-sm font-black text-foreground uppercase tracking-widest',
  closeButton: 'p-1.5 hover:bg-secondary-hover rounded-lg text-subtle hover:text-foreground transition-colors cursor-pointer',
  body: 'flex-1 overflow-y-auto p-6 scrollbar-thin text-xs sm:text-sm text-muted font-medium leading-relaxed',
  footer: 'px-5 py-3.5 border-t border-border bg-surface-muted flex items-center justify-end gap-3 shrink-0',
}

/* ---------------------------------- drawer ---------------------------------- */

export const drawerConfig = {
  root: 'fixed inset-0 z-50 overflow-hidden flex font-sans',
  backdrop: dialogConfig.backdrop,
  panel: 'bg-surface shadow-2xl fixed z-10 flex flex-col h-full',
  anchors: {
    'slide-from-left': 'left-0 top-0 bottom-0 h-full border-r border-border animate-slide-right',
    'slide-from-right': 'right-0 top-0 bottom-0 h-full border-l border-border animate-slide-left',
  } satisfies Record<DrawerAnchor, string>,
  widths: {
    md: 'max-w-md w-full',
    xl: 'max-w-xl w-full',
  } satisfies Record<DrawerWidth, string>,
  header: dialogConfig.header,
  title: dialogConfig.title,
  closeButton: dialogConfig.closeButton,
  body: dialogConfig.body,
  footer: 'px-5 py-4 border-t border-border bg-surface-muted flex items-center justify-end gap-3 shrink-0',
}

/* ---------------------------------- navbar ---------------------------------- */

export const navbarConfig = {
  base: 'w-full h-16 shrink-0 transition-all font-sans select-none px-4 sm:px-6 flex items-center',
  inner: 'w-full max-w-7xl mx-auto',
  fixations: {
    'sticky-top': 'sticky top-0 z-40 bg-surface/90 backdrop-blur-md shadow-sm border-b border-border',
    static: 'bg-surface border-b border-border',
  } satisfies Record<NavbarFixation, string>,
  alignments: {
    'left-aligned-links': 'flex items-center gap-8 justify-start',
    'centered-brand': 'flex items-center justify-between sm:grid sm:grid-cols-3',
    'split-ends': 'flex items-center justify-between',
  } satisfies Record<NavbarAlignment, string>,
  brand: 'flex items-center gap-3',
  links: 'flex items-center gap-1.5 sm:gap-4',
  actions: 'flex items-center gap-3',
}

/* ---------------------------------- sidebar --------------------------------- */

export const sidebarConfig = {
  base: 'h-full bg-surface border-r border-border text-foreground flex flex-col transition-all duration-300 relative font-sans shrink-0',
  widths: {
    expanded: 'w-64',
    mini: 'w-20',
    collapsed: 'w-0 overflow-hidden border-none',
  },
  header: 'h-16 px-4 flex items-center justify-between border-b border-border shrink-0 select-none',
  toggle: 'p-1.5 bg-surface-muted hover:bg-surface-hover border border-border rounded-lg text-muted hover:text-foreground transition-all cursor-pointer shadow-sm',
  body: 'flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin',
  footer: 'p-4 border-t border-border shrink-0 bg-surface-muted/50',
}

/* -------------------------------- offline queue ----------------------------- */

export const offlineQueueConfig = {
  base: 'border rounded-xl p-4 flex items-start gap-3.5 font-sans select-none shadow-sm transition-all duration-300',
  iconWrap: 'p-2 bg-surface rounded-lg shadow-sm border border-border shrink-0',
  title: 'text-xs font-black uppercase tracking-wider text-foreground',
  body: 'text-[10px] text-muted font-bold leading-relaxed',
  connectionPill: 'flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border',
  connection: {
    online: 'bg-success/10 text-success border-success/30',
    offline: 'bg-danger/10 text-danger border-danger/30',
  },
  statuses: {
    clear: { container: 'bg-success/5 border-success/20', icon: 'text-success', iconName: 'Cloud' },
    'pending-upload': { container: 'bg-primary/5 border-primary/20 animate-pulse', icon: 'text-primary', iconName: 'CloudLightning' },
    'local-cache-warning': { container: 'bg-warning/5 border-warning/20', icon: 'text-warning', iconName: 'Database' },
  },
}

/* --------------------------------- ocr canvas ------------------------------- */

export const ocrCanvasConfig = {
  wrapper: 'border border-border rounded-xl overflow-hidden bg-inverse font-sans shadow-xl flex flex-col h-[420px]',
  toolbar: 'bg-inverse border-b border-inverse-foreground/10 px-4 py-3 flex items-center justify-between gap-4 select-none shrink-0',
  toolbarTitle: 'text-xs font-black text-inverse-foreground/80 uppercase tracking-wider',
  toolButton: 'p-1.5 hover:bg-inverse-foreground/10 rounded-lg text-inverse-foreground/50 hover:text-inverse-foreground transition-colors cursor-pointer',
  zoomLabel: 'text-[10px] font-bold text-inverse-foreground/50 w-10 text-center select-none',
  layersButton: {
    base: 'p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold px-2.5 border',
    on: 'bg-primary/20 text-inverse-foreground border-primary/40',
    off: 'bg-inverse-foreground/5 text-inverse-foreground/50 border-inverse-foreground/10',
  },
  stage: 'flex-1 overflow-auto relative p-6 flex items-center justify-center bg-inverse/60 scrollbar-thin',
  document: 'relative transition-transform duration-200 bg-surface shadow-2xl rounded-lg border border-border max-w-sm w-full aspect-[3/4] overflow-hidden',
  documentImage: 'absolute inset-0 w-full h-full object-cover',
  box: {
    base: 'absolute border transition-all duration-150 flex items-center justify-center outline-none cursor-help',
    active: 'bg-success/20 border-success ring-2 ring-success/20',
    idle: 'bg-accent/10 border-accent/40',
  },
  boxLabel: 'absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-inverse text-inverse-foreground text-[8px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap z-50 uppercase tracking-widest',
  footer: 'bg-inverse border-t border-inverse-foreground/10 px-4 py-2.5 flex items-center justify-between text-[10px] text-inverse-foreground/50 font-bold select-none shrink-0',
  matched: 'text-success animate-pulse font-black uppercase tracking-wider',
  zoom: { min: 0.5, max: 2.5, step: 0.2 },
}

/* ----------------------------------- card ----------------------------------- */

export const cardConfig = {
  base: 'p-6 rounded-2xl transition-all duration-300 font-sans',
  variants: {
    default: 'bg-surface-muted/50 border border-border',
    bordered: 'bg-surface border-2 border-border',
    elevated: 'bg-surface border border-border shadow-md hover:shadow-lg hover:-translate-y-0.5',
    selectable: 'bg-surface border-2 cursor-pointer',
  },
  selectable: {
    selected: 'border-primary ring-4 ring-primary/5',
    unselected: 'border-border hover:border-border-strong',
  },
}

/* ----------------------------------- icon ----------------------------------- */

export const iconConfig = {
  base: 'shrink-0 transition-colors',
  defaultColorClass: 'text-muted',
  defaultSize: 16,
  fallbackIcon: 'HelpCircle',
}
