import {
  ActionTypes,
  SET_DOC,
  SET_FOCUS,
  SET_GRAPH,
  SET_HOVER,
  SET_USER,
} from "./actions";
import { IAppState } from "./model";

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
  focus: { reference: { kind: "document", documentId: "db" } },
  hover: { docPart: null },
  user: {
    username: null,
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
