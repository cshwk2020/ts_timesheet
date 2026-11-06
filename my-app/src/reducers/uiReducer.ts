import type { UiAction } from "../actions/uiActions"

export type UiState = {
  viewMode: "day" | "week",
  editor: {
	open: boolean,
	date?: string,
	hour?: number,
	recordId?: string,
	cellRect?: DOMRect | { top: number; left: number; width: number; height: number
	}
  }
}

const initialState: UiState = {
  viewMode: "week",
  editor: {
	open: false
  }
}

export const uiReducer = (
  state = initialState,
  action: UiAction
): UiState => {

  switch (action.type) {
	
    case "UI_SET_VIEW_MODE":
  	return {
    	...state,
    	viewMode: action.payload.viewMode
  	}
	
    case "UI_OPEN_EDITOR":
  	return {
    	...state,
    	editor: {
      	open: true,
      	...action.payload
    	}
  	}
	
    case "UI_CLOSE_EDITOR":
  	return {
    	...state,
    	editor: {
      	open: false
    	}
  	}
	
    default:
  	return state
  }
}


