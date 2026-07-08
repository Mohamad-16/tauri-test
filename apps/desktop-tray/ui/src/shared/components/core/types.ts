/**
 * Prop contracts for every FluxBooks core component.
 *
 * Rules:
 * - `.vue` files import their Props interface from here — no inline types.
 * - Variant/size/color unions here mirror the class maps in `config.ts`;
 *   adding a variant means touching those two files only.
 */

/* ---------------------------------- shared --------------------------------- */

export interface SelectOption {
  value: string;
  label: string;
}

export interface RadioOption extends SelectOption {
  description?: string;
}

export interface AccordionItem {
  id: string;
  title: string;
  content?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface SearchResult {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface OcrBox {
  id: string;
  name: string;
  text: string;
  /** CSS length/percentage strings positioning the box on the canvas. */
  x: string;
  y: string;
  width: string;
  height: string;
}

export type StatusTone = "success" | "warning" | "danger" | "neutral";

/* --------------------------------- buttons --------------------------------- */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "inverted"
  | "outline"
  | "ghost"
  | "danger"
  | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
  block?: boolean;
}

/* ------------------------------- form controls ----------------------------- */

export type InputVariant = "default" | "password" | "search";

export interface InputProps {
  variant?: InputVariant;
  label?: string;
  placeholder?: string;
  modelValue?: string;
  error?: string;
  icon?: string;
  disabled?: boolean;
  type?: string;
  id?: string;
  autocomplete?: string;
  required?: boolean;
}

export type TextareaVariant = "fixed-height" | "auto-grow";

export interface TextareaProps {
  modelValue: string;
  variant?: TextareaVariant;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  characterLimit?: number;
}

export type CheckboxSize = "sm" | "md";
export type ControlColor = "primary" | "success";

export interface CheckboxProps {
  modelValue?: boolean;
  indeterminate?: boolean;
  size?: CheckboxSize;
  color?: ControlColor;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export type RadioSize = "sm" | "md" | "lg";
export type RadioColor = "primary" | "info" | "accent";
export type RadioLayout = "horizontal-row" | "vertical-stack";

export interface RadioProps {
  modelValue: string;
  options: RadioOption[];
  name: string;
  size?: RadioSize;
  color?: RadioColor;
  layout?: RadioLayout;
  disabled?: boolean;
  label?: string;
}

export type ToggleSize = "xs" | "sm" | "md";

export interface ToggleProps {
  modelValue: boolean;
  size?: ToggleSize;
  color?: ControlColor;
  disabled?: boolean;
  label?: string;
}

export type SelectVariant = "outline" | "soft";
export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps {
  modelValue: string;
  options: (string | SelectOption)[];
  variant?: SelectVariant;
  size?: SelectSize;
  label?: string;
  disabled?: boolean;
  error?: string;
  icon?: string;
  placeholder?: string;
  /** Renders a searchable custom dropdown instead of the native select. */
  customPopper?: boolean;
}

export type MultiselectVariant = "tags-inline" | "tags-wrap";
export type MultiselectSize = "sm" | "md";

export interface MultiselectProps {
  modelValue: string[];
  options: (string | SelectOption)[];
  variant?: MultiselectVariant;
  size?: MultiselectSize;
  label?: string;
  disabled?: boolean;
  maxItems?: number;
  placeholder?: string;
}

export type DatePickerVariant = "single-date" | "date-range";

export interface DatePickerPreset {
  label: string;
  value: string | DateRange;
}

export interface DatePickerProps {
  modelValue: string | DateRange;
  variant?: DatePickerVariant;
  label?: string;
  disabled?: boolean;
  /** Restrict selectable days (ISO yyyy-mm-dd, inclusive). */
  minDate?: string;
  maxDate?: string;
  presets?: DatePickerPreset[];
  /** Shows a "period locked" notice when a min/max constraint applies. */
  lockedNotice?: boolean;
}

/* --------------------------------- display --------------------------------- */

export type CardVariant = "default" | "bordered" | "elevated" | "selectable";

export interface CardProps {
  variant?: CardVariant;
  selected?: boolean;
}

export type BadgeVariant = "solid" | "subtle" | "outline";
export type BadgeColor = "primary" | "success" | "warning" | "danger" | "neutral";
export type BadgePosition = "standalone-inline" | "absolute-top-right";

export interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  position?: BadgePosition;
}

export type StatusPillVariant = "solid-fill" | "border-only" | "dashed-border";

export interface StatusPillProps {
  type: StatusTone;
  variant?: StatusPillVariant;
  text?: string;
}

export type AvatarShape = "circle" | "square";
export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  imageUrl?: string;
  initials?: string;
  shape?: AvatarShape;
  size?: AvatarSize;
}

export interface IconProps {
  name: string;
  size?: number | string;
  colorClass?: string;
}

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  text: string;
  position?: TooltipPosition;
}

export type ProgressBarVariant = "default" | "segmented";

export interface ProgressBarProps {
  variant?: ProgressBarVariant;
  /** 0 to 100 */
  progress?: number;
  segmentsCount?: number;
}

export type AccordionVariant = "single-open" | "multi-expand";

export interface AccordionProps {
  items: AccordionItem[];
  variant?: AccordionVariant;
}

export type BreadcrumbSeparator = "chevron" | "slash" | "arrow";

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: BreadcrumbSeparator;
  collapsedMobile?: boolean;
}

/* ----------------------------------- data ---------------------------------- */

export type TableDensity = "compact" | "comfortable";

export interface DataTableProps {
  columns: TableColumn[];
  items: Array<Record<string, unknown>>;
  density?: TableDensity;
  striped?: boolean;
  selectable?: boolean;
  selectedKeys?: string[];
  /** Enables the expandable details column. */
  expandable?: boolean;
}

export type PaginationVariant = "numeric-steps" | "simple-arrows";
export type PaginationSize = "sm" | "md";

export interface PaginationProps {
  modelValue: number;
  totalPages: number;
  variant?: PaginationVariant;
  size?: PaginationSize;
}

export type SearchBarVariant = "inline-input" | "command-palette-modal";

export interface SearchBarProps {
  variant?: SearchBarVariant;
  placeholder?: string;
  results?: SearchResult[];
  isLoading?: boolean;
}

export interface UploadZoneProps {
  accept?: string;
  multiple?: boolean;
  /** Externally-controlled processing state (validation/upload in flight). */
  processing?: boolean;
}

/* ---------------------------------- overlay --------------------------------- */

export type DialogSize = "sm" | "md" | "lg" | "xl" | "fullscreen";

export interface DialogProps {
  modelValue: boolean;
  title?: string;
  size?: DialogSize;
  backdropClickAllowed?: boolean;
  escapeKeyLocked?: boolean;
}

export type DrawerAnchor = "slide-from-right" | "slide-from-left";
export type DrawerWidth = "md" | "xl";

export interface DrawerProps {
  modelValue: boolean;
  title?: string;
  anchor?: DrawerAnchor;
  width?: DrawerWidth;
}

/* ---------------------------------- layout ---------------------------------- */

export type NavbarFixation = "sticky-top" | "static";
export type NavbarAlignment = "left-aligned-links" | "centered-brand" | "split-ends";

export interface NavbarProps {
  fixation?: NavbarFixation;
  alignment?: NavbarAlignment;
}

export type SidebarLayout = "full-rail" | "mini-icon-rail" | "collapsible";

export interface SidebarProps {
  modelValue: boolean;
  layoutStyle?: SidebarLayout;
}

/* --------------------------------- domain-ish ------------------------------- */

export type OfflineQueueStatus = "clear" | "pending-upload" | "local-cache-warning";

export interface OfflineQueueProps {
  status: OfflineQueueStatus;
  pendingCount?: number;
}

export interface OcrCanvasProps {
  boxes?: OcrBox[];
  title?: string;
}
