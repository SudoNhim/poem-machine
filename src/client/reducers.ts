import {
  ActionTypes,
  SET_ANNOTATION,
  SET_DOC,
  SET_FOCUS,
  SET_GRAPH,
  SET_HOVER,
  SET_NAV_PANE_OPEN,
  SET_SCROLLED,
  SET_SEARCH,
} from "./actions";
import { IAppState } from "./model";

const initialState: IAppState = {
  docs: {
    graph: {
      db: {
        title: "Database Root",
        kind: "group",
        children: [],
      },
    },
    cache: {},
  },
  focus: {},
  hover: {},
  search: {
    term: null,
    hits: [],
    previews: [],
  },
  ui: {
    navPaneOpen: false,
  },
};

function rootReducer(state = initialState, action: ActionTypes): IAppState {
  switch (action.type) {
    case SET_DOC:
      return {
        ...state,
        docs: {
          ...state.docs,
          cache: {
            ...state.docs.cache,
            [action.payload.id]: action.payload.doc,
          },
        },
      };
    case SET_ANNOTATION:
      return {
        ...state,
        docs: {
          ...state.docs,
          cache: {
            ...state.docs.cache,
            [action.payload.docId]: {
              ...state.docs.cache[action.payload.docId],
              annotations: [
                ...(state.docs.cache[action.payload.docId].annotations || []),
                action.payload.annotation,
              ],
            },
          },
        },
      };
    case SET_GRAPH:
      return {
        ...state,
        docs: {
          ...state.docs,
          graph: action.payload,
        },
      };
    case SET_SEARCH:
      return {
        ...state,
        search: action.payload,
      };
    case SET_FOCUS:
      return {
        ...state,
        focus: action.payload,
      };
    case SET_HOVER:
      return {
        ...state,
        hover: action.payload,
      };
    case SET_SCROLLED:
      return {
        ...state,
        focus: {
          ...state.focus,
          waitingToScroll: false,
        },
      };
    case SET_NAV_PANE_OPEN:
      return {
        ...state,
        ui: {
          navPaneOpen: action.payload,
        },
      };
    default:
      return state;
  }
}

export default rootReducer;
