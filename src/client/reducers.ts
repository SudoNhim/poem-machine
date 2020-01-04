import { IAppState, IFocusStateArray, IFocusState } from "./model";
import {
  ActionTypes,
  SET_DOC,
  SET_GRAPH,
  SET_SEARCH,
  SET_FOCUS,
  SET_SCROLLED
} from "./actions";
import { SerializeDocRef } from "../shared/util";

const initialState: IAppState = {
  docs: {
    graph: {
      db: {
        title: "Database Root",
        kind: "group",
        children: []
      }
    },
    cache: {}
  },
  focus: {
    frames: [
      {
        docRef: {
          docId: "db"
        }
      }
    ],
    index: 0
  },
  search: {
    term: null,
    hits: [],
    previews: []
  }
};

function focusEqual(a: IFocusState, b: IFocusState): Boolean {
  return (
    SerializeDocRef(a.docRef) === SerializeDocRef(b.docRef) &&
    a.search === b.search
  );
}

// Handles a route
function reduceFocusState(
  current: IFocusStateArray,
  target: IFocusState
): IFocusStateArray {
  // New focus same as current, no change
  const active = current.frames[current.index];
  if (focusEqual(active, target)) return current;

  // Shift back to previous frame
  const prev = current.frames[current.index - 1];
  if (prev && focusEqual(prev, target))
    return {
      frames: current.frames,
      index: current.index - 1
    };

  // Shift to next frame
  const next = current.frames[current.index + 1];
  if (next && focusEqual(next, target))
    return {
      frames: current.frames,
      index: current.index + 1
    };
  
  // New frame - destroy all frames after the current index
  // and then add the new one
  return {
      frames: [
          ...current.frames.slice(0, current.index + 1),
          target
      ],
      index: current.index + 1
  };
}

function rootReducer(state = initialState, action: ActionTypes): IAppState {
  switch (action.type) {
    case SET_DOC:
      return {
        ...state,
        docs: {
          ...state.docs,
          cache: {
            ...state.docs.cache,
            [action.payload.id]: action.payload.doc
          }
        }
      };
    case SET_GRAPH:
      return {
        ...state,
        docs: {
          ...state.docs,
          graph: action.payload
        }
      };
    case SET_SEARCH:
      return {
        ...state,
        search: action.payload
      };
    case SET_FOCUS:
      return {
        ...state,
        focus: reduceFocusState(state.focus, action.payload)
      };
    case SET_SCROLLED:
      return {
        ...state,
        focus: {
          ...state.focus,
          waitingToScroll: false
        }
      };
    default:
      return state;
  }
}

export default rootReducer;
