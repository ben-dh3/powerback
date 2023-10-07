import { ObjectId } from 'mongodb';

export type Donor = {
  name: string;
  email: string;
  userId: ObjectId;
  idempotencyKey: string;
};
