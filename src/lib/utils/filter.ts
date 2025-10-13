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

export function getProcessPrefixOptions() {
  return [
    { value: 'SP', label: 'Báo Mẫu' },
    { value: 'DR', label: 'BC hằng ngày' },
    { value: 'TA', label: 'Điều động' }
  ];
}