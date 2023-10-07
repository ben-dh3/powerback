import { ObjectId } from 'mongodb';

export interface Celebration {
  _id: ObjectId;
  donatedBy: ObjectId;
  idempotencyKey?: string;
  twitter: string | null;
  payment_intent: string;
  resolved: boolean;
  defunct: boolean;
  donation: number;
  pol_name: string;
  bill_id: string;
  createdAt: Date;
  updatedAt: Date;
  FEC_id: string;
  pol_id: string;
  fee: number;
  tip: number;
}
