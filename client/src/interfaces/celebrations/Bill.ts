import { ObjectId } from 'mongodb';

interface Version {
  congressdotgov_url: URL;
  status: string;
  title: string;
  url: URL;
}

interface Action {
  id: number;
  chamber: 'House' | 'Senate' | undefined;
  description: string;
  datetime: string;
  action_type:
    | 'IntroReferral'
    | 'Calendars'
    | 'Committee'
    | 'Floor'
    | string
    | undefined;
}

interface Vote {
  chamber: 'House' | 'Senate' | undefined;
  result: string | 'Passed' | undefined;
  total_not_voting: number;
  roll_call: number;
  total_yes: number;
  question: string;
  total_no: number;
  api_url: URL;
  date: string;
  time: string;
}

interface Statement {
  veto_threat: string | undefined;
  position: string | undefined;
  date: string | undefined;
  would_sign: boolean;
  url: URL;
}

export interface Bill {
  senate_passage_vote: string | undefined | null;
  house_passage_vote: string | undefined | null;
  cbo_estimate_url: string | undefined | null;
  senate_passage: string | undefined | null;
  house_passage: string | undefined | null;
  last_vote: string | undefined | null;
  presidential_statements: Statement[];
  enacted: string | undefined | null;
  vetoed: string | undefined | null;
  latest_major_action_date: string;
  gpo_pdf_uri: URL | undefined;
  subcommittee_codes: string[];
  withdrawn_cosponsors: number;
  latest_major_action: string;
  committee_codes: string[];
  congressdotgov_url: URL;
  cosponsors_by_party: {
    D: number | undefined;
    I: number | undefined;
    L: number | undefined;
    R: number | undefined;
  };
  introduced_date: string;
  primary_subject: string;
  sponsor_party: string;
  sponsor_state: string;
  sponsor_title: string;
  summary_short: string;
  short_title: string;
  committees: string;
  cosponsors: number;
  sponsor_id: string;
  version: Version[];
  actions: Action[];
  bill_slug: string;
  bill_type: string;
  govtrack_url: URL;
  congress: number;
  sponsor_uri: URL;
  active: boolean;
  bill_id: string;
  createdAt: Date;
  sponsor: string;
  summary: string;
  updatedAt: Date;
  number: string;
  _id: ObjectId;
  bill_uri: URL;
  title: string;
  votes: Vote[];
  bill: string;
}
