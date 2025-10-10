import { getFactories, getRetailers, getUsers } from "@/lib/api/server";

export async function getFactoryOptions() {
  const factories = await getFactories({
    'is_active': 'true', 
    'has_onsite': 'true',
    'page_size': '999999',
    'page': '1'
  });
  
  return factories.results.map(factory => ({
    value: factory.factory_code,
    label: factory.factory_name
  }));
}

export async function getRetailerOptions() {
  const retailers = await getRetailers({
    'page_size': '999999',
    'page': '1' 
  });
  
  return retailers.results.map(retailer => ({
    value: retailer.id,
    label: retailer.name
  }));
}

export async function getUserOptions() {
  const users = await getUsers({
    'department__name__in': 'KTC,KTW,KVN,TT',
    'role__name__in': 'technician',
    'page_size': '999999',
    'page': '1'
  });
  
  return users.results.map(user => ({
    value: user.id,
    label: user.username
  }));
}

export function getStateTypeOptions() {
  return [
    { value: 'pending_approve', label: 'Pending Approve' },
    { value: 'analyze', label: 'Analyze' },
    { value: 'working', label: 'Working' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'start', label: 'Start' },
    { value: 'denied', label: 'Denied' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'closed', label: 'Closed' },
    { value: 'static', label: 'Static'}
  ];
}

export function getDepartmentOptions() {
  return [
    { value: 'KTW', label: 'KTW' },
    { value: 'KTC', label: 'KTC' },
    { value: 'KVN', label: 'KVN' },
    { value: 'TT', label: 'TT' },
  ];
}

export const MONTH_OPTIONS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];