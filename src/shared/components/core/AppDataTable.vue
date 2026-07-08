<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-vue-next'
import AppCheckbox from './AppCheckbox.vue'
import type { DataTableProps } from './types'
import { dataTableConfig } from './config'
import { useI18n } from '@/shared/composables/useI18n'

const props = withDefaults(defineProps<DataTableProps>(), {
  density: 'comfortable',
  striped: false,
  selectable: false,
  selectedKeys: () => [],
  expandable: false,
})

const emit = defineEmits<{
  (e: 'update:selectedKeys', keys: string[]): void
  (e: 'row-click', item: Record<string, unknown>): void
  (e: 'sort', key: string): void
}>()

const { t } = useI18n()

const expandedRows = ref<string[]>([])

const toggleExpand = (rowId: string) => {
  if (expandedRows.value.includes(rowId)) {
    expandedRows.value = expandedRows.value.filter(id => id !== rowId)
  } else {
    expandedRows.value.push(rowId)
  }
}

const allSelected = computed(
  () => props.items.length > 0 && props.selectedKeys.length === props.items.length,
)

const someSelected = computed(
  () => props.selectedKeys.length > 0 && props.selectedKeys.length < props.items.length,
)

const getItemKey = (item: Record<string, unknown>, fallbackIndex = 0): string => {
  const key = item.id ?? item.key ?? fallbackIndex
  return String(key)
}

const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    emit('update:selectedKeys', props.items.map((item, idx) => getItemKey(item, idx)))
  } else {
    emit('update:selectedKeys', [])
  }
}

const toggleSelectRow = (rowId: string, checked: boolean) => {
  if (checked) {
    emit('update:selectedKeys', [...props.selectedKeys, rowId])
  } else {
    emit('update:selectedKeys', props.selectedKeys.filter(key => key !== rowId))
  }
}

const colSpanCount = computed(
  () => props.columns.length + (props.selectable ? 1 : 0) + (props.expandable ? 1 : 0),
)

const rowClass = (item: Record<string, unknown>, idx: number) => [
  dataTableConfig.row.base,
  props.selectedKeys.includes(getItemKey(item, idx)) ? dataTableConfig.row.selected : '',
  props.striped && idx % 2 === 1 ? dataTableConfig.row.striped : '',
]
</script>

<template>
  <div :class="dataTableConfig.wrapper">
    <div :class="dataTableConfig.scroll">
      <table :class="dataTableConfig.table">
        <thead :class="dataTableConfig.thead">
          <tr>
            <th v-if="selectable" class="p-4 w-12 text-center">
              <AppCheckbox
                :model-value="allSelected"
                :indeterminate="someSelected"
                size="sm"
                :aria-label="t('core.table.selectAll')"
                @update:model-value="toggleSelectAll"
              />
            </th>

            <th v-if="expandable" class="w-8" />

            <th v-for="col in columns" :key="col.key" :class="dataTableConfig.th">
              <button
                v-if="col.sortable"
                type="button"
                :class="dataTableConfig.sortButton"
                @click="emit('sort', col.key)"
              >
                <span>{{ col.label }}</span>
                <ArrowUpDown class="w-3.5 h-3.5 text-subtle shrink-0" />
              </button>
              <span v-else>{{ col.label }}</span>
            </th>
          </tr>
        </thead>

        <tbody :class="dataTableConfig.tbody">
          <template v-for="(item, idx) in items" :key="getItemKey(item, idx)">
            <tr :class="rowClass(item, idx)" @click="emit('row-click', item)">
              <td v-if="selectable" class="p-4 text-center shrink-0" @click.stop>
                <AppCheckbox
                  :model-value="selectedKeys.includes(getItemKey(item, idx))"
                  size="sm"
                  :aria-label="t('core.table.selectRow')"
                  @update:model-value="toggleSelectRow(getItemKey(item, idx), $event)"
                />
              </td>

              <td
                v-if="expandable"
                class="text-center w-8"
                @click.stop="toggleExpand(getItemKey(item, idx))"
              >
                <button
                  type="button"
                  :class="dataTableConfig.expandButton"
                  :aria-label="t('core.table.expandRow')"
                >
                  <ChevronDown
                    v-if="expandedRows.includes(getItemKey(item, idx))"
                    class="w-3.5 h-3.5"
                  />
                  <ChevronRight v-else class="w-3.5 h-3.5" />
                </button>
              </td>

              <td
                v-for="col in columns"
                :key="col.key"
                :class="[dataTableConfig.densities[density], dataTableConfig.cell]"
              >
                <slot :name="`cell(${col.key})`" :item="item" :value="item[col.key]">
                  <span :class="dataTableConfig.cellText">{{ item[col.key] }}</span>
                </slot>
              </td>
            </tr>

            <tr
              v-if="expandable && expandedRows.includes(getItemKey(item, idx))"
              :class="dataTableConfig.expandedRow"
            >
              <td :colspan="colSpanCount" class="p-4">
                <div :class="dataTableConfig.expandedPanel">
                  <slot name="expanded" :item="item" />
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="items.length === 0">
            <td :colspan="colSpanCount" :class="dataTableConfig.empty">
              {{ t('core.table.empty') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
