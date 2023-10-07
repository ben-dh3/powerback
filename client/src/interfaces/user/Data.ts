import { Celebration } from '@Types';
import { Payment } from '../celebrations';
import { Settings } from './Settings';
import { ObjectId } from 'mongodb';

export interface UserData {
  id: ObjectId | '';
  donations: Celebration[];
  settings: Settings;
  payment: Payment;
  isCompliant?: boolean;
  understands: boolean;
  isEmployed: boolean;
  phoneNumber: string;
  occupation: string;
  firstName: string;
  employer: string;
  lastName: string;
  passport: string;
  username: string;
  address: string;
  country: string;
  credits: object;
  email: string;
  state: string;
  city: string;
  zip: string;
}
