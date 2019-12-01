import { IAppState } from './model';
import { ActionTypes, SET_DOC, SET_GRAPH, SET_SEARCH, SET_FOCUS, SET_SCROLLED } from './actions';

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
    focus: {},
    search: {
        term: null,
        hits: [],
        previews: []
    }
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
                focus: action.payload
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