import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"

export const exampleFilterConfig: PageFilterConfig = {
  showResetButton: true,
  defaultValues: {
    status: 'active',
    categories: ['tech'],
  },
  filters: [
    // 1. MULTISELECT - Multiple checkbox-style selections
    {
      id: 'categories',
      type: 'multiselect',
      label: 'Categories',
      placeholder: 'Select categories...',
      options: [
        { value: 'tech', label: 'Technology' },
        { value: 'design', label: 'Design & UI/UX' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'business', label: 'Business Strategy' },
        { value: 'finance', label: 'Finance & Accounting' },
        { value: 'hr', label: 'Human Resources' }
      ]
    },

    // 2. COMBOBOX - Single selection with search
    {
      id: 'author',
      type: 'combobox',
      label: 'Author',
      placeholder: 'Select an author...',
      options: [
        { 
          value: 'john-doe', 
          label: 'John Doe', 
          searchValue: 'John Doe john developer frontend' // Enhanced search terms
        },
        { 
          value: 'jane-smith', 
          label: 'Jane Smith', 
          searchValue: 'Jane Smith jane designer ui ux' 
        },
        { 
          value: 'mike-johnson', 
          label: 'Mike Johnson', 
          searchValue: 'Mike Johnson mike backend api' 
        },
        { 
          value: 'sarah-wilson', 
          label: 'Sarah Wilson', 
          searchValue: 'Sarah Wilson sarah product manager pm' 
        }
      ]
    },

    // 3. SELECT - Single dropdown selection
    {
      id: 'status',
      type: 'select',
      label: 'Status',
      placeholder: 'Select status...',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
        { value: 'pending', label: 'Pending Review' },
        { value: 'rejected', label: 'Rejected' }
      ]
    },

    // 4. SEARCH - Text input with search icon
    {
      id: 'title',
      type: 'search',
      label: 'Title',
      placeholder: 'Search by title...'
    },

    // 5. DATE-RANGE - From/To date picker
    {
      id: 'created_date',
      type: 'date-range',
      label: 'Created Date'
    },

    // 6. DAY-RANGE - Numeric day range (1-31)
    {
      id: 'day_of_month',
      type: 'day-range',
      label: 'Day of Month',
      min: 1,
      max: 31
    },

    // 7. SORT - Multi-column sort with ascending/descending
    {
      id: 'sort',
      type: 'sort',
      label: 'Sort Options',
      placeholder: 'Select sort fields...',
      sortFields: [
        { value: 'created_at', label: 'Created Date' },
        { value: 'updated_at', label: 'Updated Date' },
        { value: 'title', label: 'Title' },
        { value: 'author', label: 'Author' },
        { value: 'views', label: 'View Count' },
        { value: 'comments', label: 'Comment Count' }
      ]
    }
  ]
};

// Blog/Article specific configuration
export const blogFilterConfig: PageFilterConfig = {
  filters: [
    {
      id: 'search',
      type: 'search',
      label: 'Search Articles',
      placeholder: 'Search by title, content, or tags...'
    },
    {
      id: 'category',
      type: 'multiselect',
      label: 'Categories',
      placeholder: 'Filter by categories...',
      options: [
        { value: 'tutorial', label: 'Tutorials' },
        { value: 'news', label: 'News & Updates' },
        { value: 'review', label: 'Reviews' },
        { value: 'guide', label: 'How-to Guides' }
      ]
    },
    {
      id: 'author',
      type: 'combobox',
      label: 'Author',
      placeholder: 'Select author...',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' },
        { value: 'contributor', label: 'Contributor' }
      ]
    },
    {
      id: 'published_date',
      type: 'date-range',
      label: 'Published Date'
    },
    {
      id: 'sort',
      type: 'sort',
      label: 'Sort By',
      sortFields: [
        { value: 'published_at', label: 'Published Date' },
        { value: 'title', label: 'Title' },
        { value: 'views', label: 'Views' }
      ]
    }
  ]
};

// E-commerce Product filtering
export const productFilterConfig: PageFilterConfig = {
  defaultValues: {
    availability: ['in-stock']
  },
  filters: [
    {
      id: 'search',
      type: 'search',
      label: 'Search Products',
      placeholder: 'Search by name, brand, or SKU...'
    },
    {
      id: 'category',
      type: 'multiselect',
      label: 'Categories',
      placeholder: 'Select categories...',
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing & Fashion' },
        { value: 'home', label: 'Home & Garden' },
        { value: 'sports', label: 'Sports & Outdoors' },
        { value: 'books', label: 'Books & Media' }
      ]
    },
    {
      id: 'brand',
      type: 'combobox',
      label: 'Brand',
      placeholder: 'Select brand...',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'samsung', label: 'Samsung' },
        { value: 'nike', label: 'Nike' },
        { value: 'adidas', label: 'Adidas' }
      ]
    },
    {
      id: 'availability',
      type: 'multiselect',
      label: 'Availability',
      options: [
        { value: 'in-stock', label: 'In Stock' },
        { value: 'out-of-stock', label: 'Out of Stock' },
        { value: 'pre-order', label: 'Pre-order' },
        { value: 'discontinued', label: 'Discontinued' }
      ]
    },
    {
      id: 'price_range',
      type: 'select',
      label: 'Price Range',
      placeholder: 'Select price range...',
      options: [
        { value: '0-25', label: '$0 - $25' },
        { value: '25-50', label: '$25 - $50' },
        { value: '50-100', label: '$50 - $100' },
        { value: '100-500', label: '$100 - $500' },
        { value: '500+', label: '$500+' }
      ]
    },
    {
      id: 'sort',
      type: 'sort',
      label: 'Sort Products',
      sortFields: [
        { value: 'price', label: 'Price' },
        { value: 'name', label: 'Product Name' },
        { value: 'rating', label: 'Customer Rating' },
        { value: 'created_at', label: 'Date Added' }
      ]
    }
  ]
};

// User Management filtering
export const userFilterConfig: PageFilterConfig = {
  filters: [
    {
      id: 'search',
      type: 'search',
      label: 'Search Users',
      placeholder: 'Search by name, email, or ID...'
    },
    {
      id: 'role',
      type: 'multiselect',
      label: 'User Roles',
      placeholder: 'Filter by roles...',
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'editor', label: 'Editor' },
        { value: 'author', label: 'Author' },
        { value: 'subscriber', label: 'Subscriber' },
        { value: 'customer', label: 'Customer' }
      ]
    },
    {
      id: 'status',
      type: 'select',
      label: 'Account Status',
      placeholder: 'Select status...',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'pending', label: 'Pending Verification' }
      ]
    },
    {
      id: 'registration_date',
      type: 'date-range',
      label: 'Registration Date'
    },
    {
      id: 'sort',
      type: 'sort',
      label: 'Sort Users',
      sortFields: [
        { value: 'name', label: 'Name' },
        { value: 'email', label: 'Email' },
        { value: 'created_at', label: 'Registration Date' },
        { value: 'last_login', label: 'Last Login' }
      ]
    }
  ]
};

// Event/Calendar filtering
export const eventFilterConfig: PageFilterConfig = {
  defaultValues: {
    status: 'upcoming'
  },
  filters: [
    {
      id: 'search',
      type: 'search',
      label: 'Search Events',
      placeholder: 'Search by event name or description...'
    },
    {
      id: 'category',
      type: 'multiselect',
      label: 'Event Categories',
      placeholder: 'Select categories...',
      options: [
        { value: 'conference', label: 'Conference' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'webinar', label: 'Webinar' },
        { value: 'networking', label: 'Networking' },
        { value: 'social', label: 'Social Event' }
      ]
    },
    {
      id: 'location',
      type: 'combobox',
      label: 'Location',
      placeholder: 'Select location...',
      options: [
        { value: 'online', label: 'Online/Virtual' },
        { value: 'new-york', label: 'New York, NY' },
        { value: 'los-angeles', label: 'Los Angeles, CA' },
        { value: 'chicago', label: 'Chicago, IL' },
        { value: 'san-francisco', label: 'San Francisco, CA' }
      ]
    },
    {
      id: 'status',
      type: 'select',
      label: 'Event Status',
      options: [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    {
      id: 'event_date',
      type: 'date-range',
      label: 'Event Date Range'
    },
    {
      id: 'day_filter',
      type: 'day-range',
      label: 'Day of Month',
      min: 1,
      max: 31
    },
    {
      id: 'sort',
      type: 'sort',
      label: 'Sort Events',
      sortFields: [
        { value: 'start_date', label: 'Event Date' },
        { value: 'title', label: 'Event Title' },
        { value: 'location', label: 'Location' },
        { value: 'created_at', label: 'Date Created' }
      ]
    }
  ]
};

export default function WarehouseTempPage() {
  return (
    <SidebarProvider>
      <RightSidebarProvider>
        <div className="flex flex-1 min-w-0">
          <div className="flex items-center gap-2 lg:hidden p-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
          </div>
          
          <div className="flex-1 min-w-0 p-6">
            <h1 className="text-2xl font-bold mb-6">Warehouse Aging Report</h1>
            {/* Your page content */}
          </div>
          
          <SidebarRight filterConfig={exampleFilterConfig} />
        </div>
      </RightSidebarProvider>
    </SidebarProvider>
  )
}