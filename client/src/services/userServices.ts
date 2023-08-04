import { CurrentUser } from '@/types/User';

const key = 'currentUser';

function get() {
  return localStorage.getItem(key) as string;
}

function save(user: CurrentUser) {
  return localStorage.setItem(key, JSON.stringify(user));
}

function remove() {
  return localStorage.removeItem(key);
}

export const userService = { get, save, remove };
