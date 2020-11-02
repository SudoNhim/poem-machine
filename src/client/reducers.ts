import {
  ActionTypes,
  SET_DOC,
  SET_FOCUS,
  SET_GRAPH,
  SET_HOVER,
  SET_SIDEBAR_OPEN,
  SET_USER,
} from "./actions";
import { IAppState, SideBarOpen } from "./model";

const initialState: IAppState = {
  docs: {
    cache: {},
    graph: {
      db: {
        title: "Database Root",
        kind: "group",
        children: [],
      },
    },
  },
  focus: { docId: "db", docPart: null },
  hover: { docPart: null },
  ui: {
    sideBarOpen: SideBarOpen.none,
  },
  user: {
    username: null,
  },
};

function rootReducer(state = initialState, action: ActionTypes): IAppState {
  console.log(action);
  switch (action.type) {
    case SET_DOC:
      return {
        ...state,
        docs: {
          ...state.docs,
          cache: {
            ...state.docs.cache,
            [action.payload.docId]: action.payload.doc,
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
    case SET_SIDEBAR_OPEN:
      return {
        ...state,
        ui: {
          sideBarOpen: action.payload,
        },
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

export default rootReducer;
