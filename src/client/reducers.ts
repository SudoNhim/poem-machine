import { IAppState } from './model';
import { ActionTypes, SET_DOC, SET_GRAPH, SET_SEARCH, SET_FOCUS } from './actions';

const initialState: IAppState = {
    docs: {
        graph: {
            db: {
                title: "Database Root",
                kind: "root"
            }
        },
        cache: {}
    },
    focus: {},
    search: {
        term: null,
        hits: []
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
        default:
            return state;
    }
}

export default rootReducer;