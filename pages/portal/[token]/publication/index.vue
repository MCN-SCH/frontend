<template>
  <div class="publications-manager">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Publications Management</h1>
        <p class="text-gray-500 mt-1">
          Manage and organize research publications
        </p>
      </div>
      <div class="flex gap-3">
        <el-button @click="resetFilters" :disabled="!hasActiveFilters">
          Reset Filters
        </el-button>
        <el-button type="primary" @click="navigateToCreate">
          <Plus /> Create Publication
        </el-button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div
        class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 text-white"
      >
        <div class="text-sm opacity-90">Total Publications</div>
        <div class="text-2xl font-bold mt-1">
          {{ stats.total_publications || 0 }}
        </div>
      </div>
      <div
        class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-4 text-white"
      >
        <div class="text-sm opacity-90">Total Citations</div>
        <div class="text-2xl font-bold mt-1">
          {{ stats.total_citations || 0 }}
        </div>
      </div>
      <div
        class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-4 text-white"
      >
        <div class="text-sm opacity-90">Featured Publications</div>
        <div class="text-2xl font-bold mt-1">
          {{ stats.featured_count || 0 }}
        </div>
      </div>
      <div
        class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-4 text-white"
      >
        <div class="text-sm opacity-90">Average Citations</div>
        <div class="text-2xl font-bold mt-1">
          {{ stats.avg_citations || 0 }}
        </div>
      </div>
    </div>

    <!-- Search Bar - Always Visible -->
    <el-card class="mb-4" shadow="hover">
      <div class="flex gap-4 items-center">
        <el-input
          v-model="filters.search"
          placeholder="Search by title, abstract, keywords, journal..."
          clearable
          size="large"
          @clear="applyFilters"
          @keyup.enter="applyFilters"
          class="flex-1"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button
          type="primary"
          :icon="filtersVisible ? 'ArrowUp' : 'ArrowDown'"
          @click="toggleFilters"
        >
          {{
            filtersVisible ? 'Hide Advanced Filters' : 'Show Advanced Filters'
          }}
        </el-button>

        <el-badge
          :value="activeFiltersCount"
          :hidden="activeFiltersCount === 0"
          type="primary"
        >
          <el-button @click="resetFilters" :disabled="!hasActiveFilters">
            Reset All
          </el-button>
        </el-badge>
      </div>
    </el-card>

    <!-- Advanced Filters Panel - Collapsible -->
    <el-collapse-transition>
      <el-card v-show="filtersVisible" class="mb-6" shadow="hover">
        <template #header>
          <div class="flex justify-between items-center w-full">
            <span class="font-semibold">
              <el-icon><Filter /></el-icon> Advanced Filters
            </span>
            <el-button
              v-if="hasActiveFilters"
              type="text"
              @click="resetFilters"
              size="small"
            >
              Clear All Filters
            </el-button>
          </div>
        </template>

        <el-form :model="filters" label-position="top" size="default">
          <el-row :gutter="16">
            <!-- Publication Type -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Publication Type">
                <el-select
                  v-model="filters.type"
                  placeholder="All Types"
                  clearable
                  @change="applyFilters"
                  style="width: 100%"
                >
                  <el-option label="Journal" value="journal" />
                  <el-option label="Conference" value="conference" />
                  <el-option label="Book Chapter" value="chapter" />
                  <el-option label="Book" value="book" />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Badge -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Category/Badge">
                <el-select
                  v-model="filters.badge"
                  placeholder="All Categories"
                  clearable
                  @change="applyFilters"
                  style="width: 100%"
                >
                  <el-option
                    v-for="badge in filterOptions.badges"
                    :key="badge"
                    :label="badge"
                    :value="badge"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Year -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Year">
                <el-select
                  v-model="filters.year"
                  placeholder="All Years"
                  clearable
                  @change="applyFilters"
                  style="width: 100%"
                >
                  <el-option
                    v-for="year in filterOptions.years"
                    :key="year"
                    :label="year"
                    :value="year"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Year Range Slider -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Year Range">
                <div class="year-range-slider">
                  <el-slider
                    v-model="filters.yearRange"
                    range
                    :min="minYear"
                    :max="maxYear"
                    :step="1"
                    :marks="yearMarks"
                    @change="applyFilters"
                    :height="40"
                  />
                  <div class="flex justify-between mt-3 text-xs text-gray-500">
                    <span class="font-medium">{{ filters.yearRange[0] || minYear }}</span>
                    <span>to</span>
                    <span class="font-medium">{{ filters.yearRange[1] || maxYear }}</span>
                  </div>
                </div>
              </el-form-item>
            </el-col>

            <!-- Citations Range -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Citations Range">
                <div class="flex gap-2">
                  <el-input-number
                    v-model="filters.minCitations"
                    :min="0"
                    placeholder="Min"
                    controls-position="right"
                    style="width: 100%"
                    @change="applyFilters"
                  />
                  <span class="self-center">-</span>
                  <el-input-number
                    v-model="filters.maxCitations"
                    :min="0"
                    placeholder="Max"
                    controls-position="right"
                    style="width: 100%"
                    @change="applyFilters"
                  />
                </div>
              </el-form-item>
            </el-col>

            <!-- Journal -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Journal/Conference">
                <el-select
                  v-model="filters.journal"
                  placeholder="Select Journal"
                  filterable
                  allow-create
                  clearable
                  @change="applyFilters"
                  style="width: 100%"
                >
                  <el-option
                    v-for="journal in filterOptions.journals"
                    :key="journal"
                    :label="journal"
                    :value="journal"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Publisher -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Publisher">
                <el-select
                  v-model="filters.publisher"
                  placeholder="Select Publisher"
                  filterable
                  allow-create
                  clearable
                  @change="applyFilters"
                  style="width: 100%"
                >
                  <el-option
                    v-for="publisher in filterOptions.publishers"
                    :key="publisher"
                    :label="publisher"
                    :value="publisher"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Author -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Author">
                <el-input
                  v-model="filters.author"
                  placeholder="Author name"
                  clearable
                  @clear="applyFilters"
                  @keyup.enter="applyFilters"
                />
              </el-form-item>
            </el-col>

            <!-- Additional Options -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Additional Options">
                <div class="space-y-2">
                  <el-checkbox
                    v-model="filters.isFeatured"
                    @change="applyFilters"
                  >
                    <el-icon><Star /></el-icon> Featured Only
                  </el-checkbox>
                  <el-checkbox v-model="filters.hasDoi" @change="applyFilters">
                    <el-icon><Link /></el-icon> Has DOI
                  </el-checkbox>
                  <el-checkbox v-model="filters.hasPdf" @change="applyFilters">
                    <el-icon><Document /></el-icon> Has PDF
                  </el-checkbox>
                </div>
              </el-form-item>
            </el-col>

            <!-- Sort By -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Sort By">
                <el-select
                  v-model="filters.sortBy"
                  @change="applyFilters"
                  style="width: 100%"
                >
                  <el-option label="Publication Date" value="date" />
                  <el-option label="Citations" value="citations" />
                  <el-option label="Title" value="title" />
                  <el-option label="Created Date" value="created_at" />
                  <el-option label="Display Order" value="order" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Sort Order">
                <el-select
                  v-model="filters.sortOrder"
                  @change="applyFilters"
                  style="width: 100%"
                >
                  <el-option label="Descending (Newest First)" value="desc" />
                  <el-option label="Ascending (Oldest First)" value="asc" />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Items Per Page -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="Items Per Page">
                <el-select
                  v-model="perPage"
                  @change="fetchPublications"
                  style="width: 100%"
                >
                  <el-option :value="10" label="10 items" />
                  <el-option :value="20" label="20 items" />
                  <el-option :value="50" label="50 items" />
                  <el-option :value="100" label="100 items" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- Quick Filter Chips -->
          <div class="mt-4 pt-3 border-t">
            <div class="text-sm text-gray-600 mb-2">Quick Filters:</div>
            <div class="flex flex-wrap gap-2">
              <el-button
                size="small"
                :type="
                  filters.year === new Date().getFullYear().toString()
                    ? 'primary'
                    : 'default'
                "
                @click="
                  setQuickFilter('year', new Date().getFullYear().toString())
                "
              >
                This Year
              </el-button>
              <el-button
                size="small"
                :type="
                  filters.year === (new Date().getFullYear() - 1).toString()
                    ? 'primary'
                    : 'default'
                "
                @click="
                  setQuickFilter(
                    'year',
                    (new Date().getFullYear() - 1).toString(),
                  )
                "
              >
                Last Year
              </el-button>
              <el-button
                size="small"
                @click="setQuickFilter('highCitations', null)"
              >
                High Citations (>100)
              </el-button>
              <el-button size="small" @click="setQuickFilter('recent', null)">
                Last 5 Years
              </el-button>
            </div>
          </div>

          <!-- Active Filters Display -->
          <div v-if="activeFiltersList.length > 0" class="mt-4 pt-3 border-t">
            <div class="text-sm text-gray-600 mb-2">Active Filters:</div>
            <div class="flex flex-wrap gap-2">
              <el-tag
                v-for="filter in activeFiltersList"
                :key="filter.key"
                closable
                size="small"
                type="info"
                effect="plain"
                @close="removeFilter(filter.key)"
              >
                <el-icon class="mr-1"><Filter /></el-icon>
                {{ filter.label }}: {{ filter.value }}
              </el-tag>
            </div>
          </div>
        </el-form>
      </el-card>
    </el-collapse-transition>

    <!-- Publications Table -->
    <el-card shadow="never">
      <div class="mb-4 flex justify-between items-center">
        <div class="text-gray-600">
          <el-icon><DataBoard /></el-icon>
          Showing {{ publications.from || 0 }} - {{ publications.to || 0 }} of
          {{ publications.total || 0 }} publications
        </div>
        <el-button size="small" @click="fetchPublications" :loading="loading">
          <el-icon><Refresh /></el-icon> Refresh
        </el-button>
      </div>

      <el-table :data="publications.data" stripe v-loading="loading">
        <el-table-column prop="title" label="Title" min-width="250">
          <template #default="{ row }">
            <div>
              <div class="font-medium">{{ row.title }}</div>
              <div class="text-xs text-gray-500 mt-1">
                {{ row.journal }} • {{ formatDate(row.date) }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="Type" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)" size="small">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="authors" label="Authors" width="200">
          <template #default="{ row }">
            <div class="text-sm">
              {{ formatAuthors(row.authors) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="citations"
          label="Citations"
          width="130"
          align="center"
        >
          <template #default="{ row }">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200">
              <el-icon class="w-3.5 h-3.5 text-blue-600">
                <DocumentCopy />
              </el-icon>
              <span class="text-sm font-bold text-blue-700">{{ row.citations }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="date" label="Year" width="80" align="center">
          <template #default="{ row }">
            {{ new Date(row.date).getFullYear() }}
          </template>
        </el-table-column>

        <el-table-column label="Badge" width="150">
          <template #default="{ row }">
            <el-tag
              v-if="row.badge"
              :type="getBadgeType(row.badge)"
              size="small"
              effect="plain"
            >
              {{ row.badge }}
            </el-tag>
            <el-tag
              v-if="row.is_featured"
              type="warning"
              size="small"
              effect="dark"
              class="ml-1"
            >
              Featured
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="180" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" @click="viewPublication(row.id)">
                <el-icon><View /></el-icon>
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="editPublication(row.id)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="deletePublication(row.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="perPage"
          :total="publications.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchPublications"
          @current-change="fetchPublications"
        />
      </div>
    </el-card>

    <!-- View Publication Dialog -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="viewPublicationData?.title || 'Publication Details'"
      width="70%"
      :close-on-click-modal="false"
      class="publication-view-dialog"
    >
      <div v-if="viewPublicationData" v-loading="viewLoading" class="publication-details">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Title" :span="2">
            <span class="font-semibold">{{ viewPublicationData.title }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="Type">
            <el-tag :type="getTypeTagType(viewPublicationData.type)" size="small">
              {{ getTypeLabel(viewPublicationData.type) }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="Publication Date">
            {{ formatDate(viewPublicationData.date) }}
          </el-descriptions-item>

          <el-descriptions-item label="Journal/Conference">
            {{ viewPublicationData.journal || 'N/A' }}
          </el-descriptions-item>

          <el-descriptions-item label="Volume">
            {{ viewPublicationData.volume || 'N/A' }}
          </el-descriptions-item>

          <el-descriptions-item label="Issue">
            {{ viewPublicationData.issue || 'N/A' }}
          </el-descriptions-item>

          <el-descriptions-item label="Pages">
            {{ viewPublicationData.pages || 'N/A' }}
          </el-descriptions-item>

          <el-descriptions-item label="Publisher">
            {{ viewPublicationData.publisher || 'N/A' }}
          </el-descriptions-item>

          <el-descriptions-item label="DOI">
            <span v-if="viewPublicationData.doi" class="text-blue-600">
              <el-link :href="`https://doi.org/${viewPublicationData.doi}`" target="_blank">
                {{ viewPublicationData.doi }}
              </el-link>
            </span>
            <span v-else>N/A</span>
          </el-descriptions-item>

          <el-descriptions-item label="ISBN/ISSN">
            {{ viewPublicationData.isbn || viewPublicationData.issn || 'N/A' }}
          </el-descriptions-item>

          <el-descriptions-item label="Citations">
            <div class="inline-flex items-center gap-2">
              <el-icon class="text-blue-600"><DocumentCopy /></el-icon>
              <span class="font-bold text-blue-700">{{ viewPublicationData.citations || 0 }}</span>
            </div>
          </el-descriptions-item>

          <el-descriptions-item label="Featured">
            <el-tag :type="viewPublicationData.is_featured ? 'warning' : 'info'" size="small">
              {{ viewPublicationData.is_featured ? 'Yes' : 'No' }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="Badge" :span="2">
            <el-tag
              v-if="viewPublicationData.badge"
              :type="getBadgeType(viewPublicationData.badge)"
              size="small"
              effect="plain"
            >
              {{ viewPublicationData.badge }}
            </el-tag>
            <span v-else>No badge</span>
          </el-descriptions-item>

          <el-descriptions-item label="Abstract" :span="2">
            <div class="abstract-text">
              {{ viewPublicationData.abstract || 'No abstract available' }}
            </div>
          </el-descriptions-item>

          <el-descriptions-item label="Keywords" :span="2">
            <div class="flex flex-wrap gap-1">
              <el-tag
                v-for="keyword in viewPublicationData.keywords"
                :key="keyword"
                size="small"
                type="info"
                effect="plain"
              >
                {{ keyword }}
              </el-tag>
              <span v-if="!viewPublicationData.keywords?.length">No keywords</span>
            </div>
          </el-descriptions-item>

          <el-descriptions-item label="Authors" :span="2">
            <div class="authors-list">
              <div
                v-for="(author, index) in viewPublicationData.authors"
                :key="index"
                class="author-item"
              >
                <span class="author-name">{{ author.author_name }}</span>
                <span v-if="author.orcid" class="orcid-id">
                  <el-link :href="`https://orcid.org/${author.orcid}`" target="_blank" type="info">
                    ORCID: {{ author.orcid }}
                  </el-link>
                </span>
                <span v-if="author.email" class="author-email">{{ author.email }}</span>
              </div>
              <div v-if="!viewPublicationData.authors?.length">No authors listed</div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item label="PDF Document" :span="2" v-if="viewPublicationData.pdf_url">
            <div class="pdf-section">
              <el-button type="primary" size="small" @click="downloadPdf(viewPublicationData.pdf_url)">
                <el-icon><Download /></el-icon> Download PDF
              </el-button>
              <el-button size="small" @click="viewPdf(viewPublicationData.pdf_url)">
                <el-icon><View /></el-icon> View PDF
              </el-button>
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <!-- Additional Metadata -->
        <div v-if="viewPublicationData.metadata" class="mt-4">
          <el-divider content-position="left">Additional Metadata</el-divider>
          <el-table :data="Object.entries(viewPublicationData.metadata)" size="small" border>
            <el-table-column prop="0" label="Field" width="200" />
            <el-table-column prop="1" label="Value" />
          </el-table>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewDialogVisible = false">Close</el-button>
          <el-button type="primary" @click="editPublication(viewPublicationData?.id)">
            <el-icon><Edit /></el-icon> Edit
          </el-button>
          <el-button type="danger" @click="deleteFromDialog(viewPublicationData?.id)">
            <el-icon><Delete /></el-icon> Delete
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// Watch for search with debounce
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DataBoard,
  Delete,
  Document,
  DocumentCopy,
  Download,
  Edit,
  Filter,
  Link,
  Plus,
  Refresh,
  Search,
  Star,
  View,
} from '@element-plus/icons-vue'
import { usePublicationStore } from '~/store/publication.js'

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

useSeoMeta({
  title: 'Publications Management',
  description: 'Manage and organize research publications in the admin portal',
})

const store = usePublicationStore()
const deviceCookie = useCookie('device_id')
const deviceId = deviceCookie.value
const { index, getFilterOptions, show, detelePub } = store

// State
const loading = ref(false)
const viewLoading = ref(false)
const filtersVisible = ref(false)
const viewDialogVisible = ref(false)
const viewPublicationData = ref(null)
const publications = ref({ data: [], total: 0, from: 0, to: 0 })
const currentPage = ref(1)
const perPage = ref(10)
const filterOptions = ref({
  years: [],
  types: [],
  badges: [],
  journals: [],
  publishers: [],
  citations_stats: { min: 0, max: 0, avg: 0 },
})
const stats = ref({
  total_publications: 0,
  total_citations: 0,
  featured_count: 0,
  avg_citations: 0,
})

// Filters
const filters = reactive({
  search: '',
  type: '',
  badge: '',
  year: '',
  yearRange: [null, null],
  minCitations: null,
  maxCitations: null,
  isFeatured: false,
  hasDoi: false,
  hasPdf: false,
  journal: '',
  publisher: '',
  author: '',
  sortBy: 'date',
  sortOrder: 'desc',
})

// Computed
const minYear = computed(() => {
  const years = filterOptions.value.years
  return years.length > 0 ? Math.min(...years) : 2000
})

const maxYear = computed(() => {
  const years = filterOptions.value.years
  return years.length > 0 ? Math.max(...years) : new Date().getFullYear()
})

const yearMarks = computed(() => {
  const marks = {}
  const min = minYear.value
  const max = maxYear.value

  for (let year = min; year <= max; year += 5) {
    marks[year] = year.toString()
  }
  return marks
})

const hasActiveFilters = computed(() => {
  return Object.keys(filters).some((key) => {
    if (key === 'yearRange') {
      return filters.yearRange[0] || filters.yearRange[1]
    }
    if (key === 'search') return filters.search && filters.search.length > 0
    if (typeof filters[key] === 'boolean') return filters[key] === true
    return filters[key] && filters[key] !== '' && filters[key] !== null
  })
})

const activeFiltersCount = computed(() => {
  return activeFiltersList.value.length
})

const activeFiltersList = computed(() => {
  const list = []

  if (filters.search)
    list.push({ key: 'search', label: 'Search', value: filters.search })
  if (filters.type)
    list.push({ key: 'type', label: 'Type', value: getTypeLabel(filters.type) })
  if (filters.badge)
    list.push({ key: 'badge', label: 'Badge', value: filters.badge })
  if (filters.year)
    list.push({ key: 'year', label: 'Year', value: filters.year })
  if (filters.yearRange[0] || filters.yearRange[1]) {
    const start = filters.yearRange[0] || minYear.value
    const end = filters.yearRange[1] || maxYear.value
    list.push({
      key: 'yearRange',
      label: 'Year Range',
      value: `${start} - ${end}`,
    })
  }
  if (filters.minCitations)
    list.push({
      key: 'minCitations',
      label: 'Min Citations',
      value: filters.minCitations,
    })
  if (filters.maxCitations)
    list.push({
      key: 'maxCitations',
      label: 'Max Citations',
      value: filters.maxCitations,
    })
  if (filters.isFeatured)
    list.push({ key: 'isFeatured', label: 'Featured', value: 'Only Featured' })
  if (filters.hasDoi)
    list.push({ key: 'hasDoi', label: 'DOI', value: 'Has DOI' })
  if (filters.hasPdf)
    list.push({ key: 'hasPdf', label: 'PDF', value: 'Has PDF' })
  if (filters.journal)
    list.push({ key: 'journal', label: 'Journal', value: filters.journal })
  if (filters.publisher)
    list.push({
      key: 'publisher',
      label: 'Publisher',
      value: filters.publisher,
    })
  if (filters.author)
    list.push({ key: 'author', label: 'Author', value: filters.author })

  return list
})

// Methods
const toggleFilters = () => {
  filtersVisible.value = !filtersVisible.value
  localStorage.setItem('publication_filters_visible', filtersVisible.value)
}

const setQuickFilter = (type, value) => {
  switch (type) {
    case 'year':
      filters.year = value
      filters.yearRange = [null, null]
      break
    case 'highCitations':
      filters.minCitations = 100
      filters.maxCitations = null
      break
    case 'recent':
      const currentYear = new Date().getFullYear()
      filters.yearRange = [currentYear - 5, currentYear]
      filters.year = ''
      break
  }
  applyFilters()
}

const fetchFilterOptions = async () => {
  try {
    const response = await getFilterOptions()
    const data = response || {}

    filterOptions.value = {
      years: data.years || [],
      types: data.types || [],
      badges: data.badges || [],
      journals: data.journals || [],
      publishers: data.publishers || [],
      citations_stats: data.citations_stats || { min: 0, max: 0, avg: 0 },
    }

    stats.value = {
      total_publications: data.total_publications || 0,
      total_citations: data.total_citations || 0,
      featured_count: data.featured_count || 0,
      avg_citations: data.avg_citations || 0,
    }
  } catch (error) {
    console.error('Failed to fetch filter options:', error)
    filterOptions.value = {
      years: [],
      types: [],
      badges: [],
      journals: [],
      publishers: [],
      citations_stats: { min: 0, max: 0, avg: 0 },
    }
  }
}

const fetchPublications = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: perPage.value,
      ...filters,
    }

    Object.keys(params).forEach((key) => {
      if (params[key] === '' || params[key] === null || params[key] === false) {
        delete params[key]
      }
      if (key === 'yearRange' && !params[key][0] && !params[key][1]) {
        delete params[key]
      }
    })

    const { all, filters_metadata } = await index(params)
    publications.value = all
    stats.value = filters_metadata
    stats.value.avg_citations = filterOptions.value.citations_stats.avg
  } catch (error) {
    ElMessage.error('Failed to fetch publications')
  } finally {
    loading.value = false
  }
}

const viewPublication = async (id) => {
  viewLoading.value = true
  viewDialogVisible.value = true
  try {
    // Fetch full publication details
    const publication = await show(id)
    viewPublicationData.value = publication

    // Parse keywords if it's a string
    if (viewPublicationData.value.keywords && typeof viewPublicationData.value.keywords === 'string') {
      viewPublicationData.value.keywords = viewPublicationData.value.keywords.split(',').map(k => k.trim())
    }

    // Parse authors if needed
    if (viewPublicationData.value.authors && typeof viewPublicationData.value.authors === 'string') {
      try {
        viewPublicationData.value.authors = JSON.parse(viewPublicationData.value.authors)
      } catch {
        viewPublicationData.value.authors = []
      }
    }
  } catch (error) {
    ElMessage.error('Failed to load publication details')
    viewDialogVisible.value = false
  } finally {
    viewLoading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchPublications()
}

const resetFilters = () => {
  Object.keys(filters).forEach((key) => {
    if (key === 'yearRange') {
      filters[key] = [null, null]
    } else if (typeof filters[key] === 'boolean') {
      filters[key] = false
    } else {
      filters[key] = ''
    }
  })
  applyFilters()
}

watch(() => filters.year, (newVal) => {
  if (newVal) {
    filters.yearRange = [null, null]
  }
})

watch(() => filters.yearRange, (newVal) => {
  if (newVal[0] || newVal[1]) {
    filters.year = ''
  }
})

const removeFilter = (key) => {
  if (key === 'yearRange') {
    filters.yearRange = [null, null]
  } else if (key === 'isFeatured' || key === 'hasDoi' || key === 'hasPdf') {
    filters[key] = false
  } else {
    filters[key] = ''
  }
  applyFilters()
}

const getTypeLabel = (type) => {
  const types = {
    journal: 'Journal',
    conference: 'Conference',
    chapter: 'Book Chapter',
    book: 'Book',
  }
  return types[type] || type
}

const getTypeTagType = (type) => {
  const types = {
    journal: 'primary',
    conference: 'success',
    chapter: 'warning',
    book: 'info',
  }
  return types[type] || ''
}

const getBadgeType = (badge) => {
  if (badge && badge.includes('International')) return 'primary'
  if (badge && badge.includes('Domestic')) return 'success'
  return 'info'
}

const formatAuthors = (authors) => {
  if (!authors || authors.length === 0) return 'N/A'
  if (authors.length > 3) {
    return `${authors
      .slice(0, 3)
      .map((a) => a.author_name)
      .join(', ')} et al.`
  }
  return authors.map((a) => a.author_name).join(', ')
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const navigateToCreate = () => {
  navigateTo(`/portal/${deviceId}/publication/create`)
}

const editPublication = (id) => {
  viewDialogVisible.value = false
  navigateTo(`/portal/${deviceId}/publication/${id}`)
}

const deletePublication = async (id) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this publication?',
      'Warning',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      },
    )

    await detelePub(id)
    ElMessage.success('Publication deleted successfully')
    viewDialogVisible.value = false
    fetchPublications()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete publication')
    }
  }
}

const deleteFromDialog = async (id) => {
  await deletePublication(id)
}

const downloadPdf = (pdfUrl) => {
  window.open(pdfUrl, '_blank')
}

const viewPdf = (pdfUrl) => {
  window.open(pdfUrl, '_blank')
}

// Debounce search
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

watch(
  () => filters.search,
  () => {
    debouncedSearch()
  },
)

// Lifecycle
onMounted(() => {
  const saved = localStorage.getItem('publication_filters_visible')
  if (saved !== null) {
    filtersVisible.value = saved === 'true'
  }

  fetchFilterOptions()
  fetchPublications()
})
</script>

<style scoped>
.year-range-slider {
  padding: 10px 5px;
  width: 100%;
}

.year-range-slider :deep(.el-slider) {
  width: 100%;
  margin: 15px 0;
}

.year-range-slider :deep(.el-slider__runway) {
  height: 6px;
  margin: 20px 0;
}

.year-range-slider :deep(.el-slider__bar) {
  height: 6px;
}

.year-range-slider :deep(.el-slider__button) {
  width: 18px;
  height: 18px;
  border: 2px solid #409eff;
}

.year-range-slider :deep(.el-slider__marks-text) {
  font-size: 11px;
  white-space: nowrap;
  margin-top: 8px;
}

@media (min-width: 1200px) {
  .year-range-slider {
    padding: 10px 15px;
  }
}

.publications-manager {
  padding: 20px;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-card__header) {
  background: #fafafa;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-collapse-transition) {
  transition: all 0.3s ease;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

/* Dialog Styles */
.publication-view-dialog :deep(.el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px;
}

.publication-details {
  font-size: 14px;
}

.abstract-text {
  line-height: 1.6;
  color: #606266;
  white-space: pre-wrap;
}

.authors-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.author-item {
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.author-name {
  font-weight: 600;
  margin-right: 12px;
}

.orcid-id {
  margin-right: 12px;
}

.author-email {
  color: #909399;
  font-size: 12px;
}

.pdf-section {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .publications-manager {
    padding: 10px;
  }

  :deep(.el-card__body) {
    padding: 15px;
  }

  .publication-view-dialog :deep(.el-dialog) {
    width: 95% !important;
  }
}
</style>
