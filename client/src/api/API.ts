import axios from 'axios';
import { ObjectId } from 'mongodb';
import { Celebration } from '@Types';
import { JsonWebKeyInput } from 'crypto';
import { Credentials, Passwords, Intent, Donor } from './types';
import { UserEntryForm, ContactInfo, UserData } from '@Interfaces';

axios.defaults.baseURL = 'https://api.powerback.me/api/';

const API = {
  // auth
  refreshToken: (refreshToken: JsonWebKeyInput) => {
    return axios.get('users/refresh', {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },
  // users
  updateUser: (userId: ObjectId, userData: ContactInfo) => {
    return axios.put('users/update/' + userId, userData);
  },
  changePassword: (userId: ObjectId, passwords: Passwords) => {
    return axios.put('users/change/' + userId, passwords);
  },
  resetPassword: (credentials: Credentials) => {
    return axios.put('users/reset', credentials);
  },
  confirmResetPasswordHash: (hash: string) => {
    return axios.get('users/reset/' + hash);
  },
  confirmActivationHash: (hash: string) => {
    return axios.get('users/activate/' + hash);
  },
  deleteUser: (userId: ObjectId) => {
    return axios.delete('users/delete/' + userId);
  },
  login: (userData: UserData) => {
    return axios.post('users/login', userData);
  },
  checkPrivilege: (userId: ObjectId) => {
    return axios.get('/users/privilege/' + userId);
  },
  givePrivilege: (userId: ObjectId) => {
    return axios.patch('/users/privilege/' + userId);
  },
  checkDonor: (userId: ObjectId) => {
    return axios.get('/users/promote/' + userId);
  },
  promoteDonor: (userId: ObjectId) => {
    return axios.patch('/users/promote/' + userId);
  },
  getUser: (userId: ObjectId) => {
    return axios.get('users/get/' + userId);
  },
  getUserData: (userId: ObjectId) => {
    return axios.get('users/data/' + userId);
  },
  forgotPassword: (email: string) => {
    return axios.put('users/forgot', email);
  },
  createUser: (userData: UserEntryForm) => {
    return axios.post('users', userData);
  },
  logout: () => {
    return axios.get('users/logout');
  },
  // donations
  saveDonation: (donationData: Celebration) => {
    return axios.post('donations', donationData);
  },
  getDonationsByUserId: (userId: ObjectId) => {
    return axios.get('donations/user/' + userId);
  },
  resolveDonation: (donationId: ObjectId) => {
    return axios.patch('donations/' + donationId);
  },
  sendReceipt: (body: Celebration) => {
    return axios.post('donations/receipt', body);
  },
  getWhatPolsHaveInEscrow: () => {
    return axios.get('donations/escrow');
  },
  // pols
  getPolsByIds: async (ids: string[]) => {
    return await axios
      .put('congress/pols', ids)
      .catch((err) => console.error(err.response.data));
  },
  getPol: (id: string) => {
    return axios.get('congress/pols/' + id);
  },
  getBill: (id: string) => {
    return axios.get('congress/bills/' + id);
  },
  getCosponsors: (billSlug: string) => {
    return axios.get('congress/cosponsors/' + billSlug);
  },
  // payment [stripe]
  sendPayment: (customer_id: string, body: Celebration) => {
    return axios.post('payments/donations/' + customer_id, body);
  },
  setupIntent: (id: string, body: Intent) => {
    return axios.post('payments/intents/' + id, body);
  },
  setPaymentMethod: (id: string, body: Intent) => {
    return axios.post('payments/donors/' + id, body);
  },
  getNewDonor: (body: Donor) => {
    return axios.post('payments/donors', body);
  },
  // search by location [google civics]
  getPolsByLocation: (address: string) => {
    return axios.put('civics', { address });
  },
  // system
  notifyImgErr: (pol: string) => {
    return axios.put('sys/errors/img/' + pol);
  },
  getConstants: () => {
    return axios.get('sys/constants');
  },
};

export default API;
