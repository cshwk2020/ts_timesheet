export type UiAction =
  | {
  	type: "UI_SET_VIEW_MODE"
  	payload: {
    	viewMode: "day" | "week"
  	}
	}
  | {
  	type: "UI_OPEN_EDITOR"
  	payload: {
    	date: string
    	hour: number
    	recordId?: string
  	}
	}
  | {
  	type: "UI_CLOSE_EDITOR"
	}
