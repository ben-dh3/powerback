import { useCallback, useReducer, useMemo } from 'react';
import { PolsOnParade, HouseMember, RepState } from '@Interfaces';
import { shuffle } from '@Utils';

type Action = {
  type: string;
  payload?: HouseMember[] | HouseMember | RepState | string;
};

interface Handlers {
  setPolsOnParade: (houseMembers: HouseMember[]) => void;
  searchPolsByName: (selectedItem: HouseMember) => void;
  searchPolsByState: (selectedItem: RepState) => void;
  searchPolsByLocation: (ocd_id: string) => void;
  // filterPolsByCosponsors: (cosponsors) => void;
  // resetPolsOnParade: () => void;
  restorePolsOnParade: () => void;
}

export default function useParade(): [PolsOnParade, Handlers] {
  // selectedPol: string
  const reducer = useCallback(
    (state: PolsOnParade, action: Action) => {
      switch (action.type) {
        case 'INIT':
          state = {
            ...state,
            houseMembers: shuffle(action.payload),
          };
          return (state = {
            ...state,
            applied: state.houseMembers,
          });
        case 'NAME':
          return (state = {
            ...state,
            applied: [action.payload as HouseMember] as HouseMember[],
          });
        case 'STATE':
          const collator = new Intl.Collator([], { numeric: true });
          return (state = {
            ...state,
            applied: state.houseMembers
              .filter(
                (pol: HouseMember) =>
                  pol.roles[0].state ===
                  ((action.payload as RepState).abbrev !== ''
                    ? (action.payload as RepState).abbrev
                    : pol.roles[0].state)
                // not to be confused with "50 stars for 50 states" 'STATE' or [Object].'state'
              )
              .sort((a: HouseMember, b: HouseMember) =>
                collator.compare(a.roles[0].district, b.roles[0].district)
              ),
          });
        case 'DISTRICT':
          return (state = {
            ...state,
            applied: state.houseMembers.filter(
              (pol: HouseMember) => pol.roles[0].ocd_id === action.payload
            ),
          });
        // case 'COSPONSORS':
        //   return (state = {
        //     ...state,
        //     applied: state.applied.filter(
        //       (pol: HouseMember) => pol.isCosponsor
        //     ),
        //   });
        case 'RESTORE':
          return (state = {
            ...state,
            applied: state.houseMembers,
          });
        // case 'RESET':
        //   return (state = {
        //     ...state,
        //     applied: selectedPol
        //       ? state.houseMembers.filter(
        //           (pol: HouseMember) => pol.id === selectedPol
        //         )
        //       : state.houseMembers,
        //   });
        default:
          throw new Error();
      }
    },
    [
      // selectedPol
    ]
  );

  const [state, dispatch] = useReducer(reducer, {
    applied: [],
    houseMembers: [],
  } as PolsOnParade);

  const handlers = useMemo<Handlers>(
    () => ({
      setPolsOnParade: (houseMembers) => {
        dispatch({ type: 'INIT', payload: houseMembers });
      },
      searchPolsByName: (selectedItem) => {
        dispatch({ type: 'NAME', payload: selectedItem });
      },
      searchPolsByState: (selectedItem) => {
        dispatch({ type: 'STATE', payload: selectedItem });
      },
      searchPolsByLocation: (ocd_id) => {
        dispatch({ type: 'DISTRICT', payload: ocd_id });
      },
      // filterPolsByCosponsors: (cosponsors) => {
      //   dispatch({ type: 'COSPONSORS', payload: cosponsors });
      // },
      restorePolsOnParade: () => {
        dispatch({ type: 'RESTORE' });
      },
      // resetPolsOnParade: () => {
      //   dispatch({ type: 'RESET' });
      // },
    }),
    []
  );
  return [state, handlers];
}
