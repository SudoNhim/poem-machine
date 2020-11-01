import {
  ActionTypes,
  SET_ANNOTATION,
  SET_FOCUS,
  SET_GRAPH,
  SET_HOVER,
  SET_SCROLLED,
  SET_SIDEBAR_OPEN,
  SET_USER,
} from "./actions";
import { IAppState, SideBarOpen } from "./model";

const initialState: IAppState = {
  docs: {
    graph: {
      db: {
        title: "Database Root",
        kind: "group",
        children: [],
      },
    },
  },
  focus: { annotations: [] },
  hover: {},
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
    case SET_ANNOTATION:
      return {
        ...state,
        docs: {
          ...state.docs,
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
    case SET_SCROLLED:
      return {
        ...state,
        focus: {
          ...state.focus,
          waitingToScroll: false,
        },
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
