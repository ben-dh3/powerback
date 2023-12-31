export type Role = {
  votes_against_party_pct: number;
  leadership_role: string | null;
  votes_with_party_pct: number;
  contact_form: string | null;
  dw_nominate: string | null;
  ideal_point: string | null;
  bills_cosponsored: number;
  chamber: 'House | Senate';
  fec_candidate_id: string;
  missed_votes_pct: number;
  bills_sponsored: number;
  cook_pvi: string | null;
  title: 'Representative';
  next_election: string;
  total_present: number;
  missed_votes: number;
  senate_class: string;
  short_title: 'Rep.';
  total_votes: number;
  fax: string | null;
  start_date: string;
  state_rank: string;
  at_large: boolean;
  seniority: string;
  congress: string;
  district: string;
  end_date: string;
  lis_id: string;
  ocd_id: string;
  office: string;
  party: string;
  phone: string;
  state: string;
  committees: object[];
  subcommittees: object[];
};
