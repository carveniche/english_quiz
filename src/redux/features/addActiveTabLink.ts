import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CICO,
  IFRAMENEWCODING,
  MAXIMUMACTIVETAB,
  ROUTERKEYCONST,
} from "../../constants";
import defaultRouter from "../../Router/defaultRouter";
export interface ActiveTabParams {
  path: string;
  key: string;
  name: string;
  icon: string;
  extraParams?: object;
}
export interface activeTabStateReducer {
  activeTabArray: ActiveTabParams[];
  currentSelectedRouter: string;
  currentSelectedIndex: number;
  currentSelectedKey: string;
}

const initialState: activeTabStateReducer = {
  activeTabArray: [
    {
      path: defaultRouter.path,
      key: defaultRouter.key,
      name: defaultRouter.name,
      icon: defaultRouter.icon,
      extraParams: {},
    },
  ],
  currentSelectedRouter: ROUTERKEYCONST.allScreen,
  currentSelectedIndex: 0,
  currentSelectedKey: ROUTERKEYCONST.allScreen,
};
const activeTabReducer = createSlice({
  name: "addToActiveTab",
  initialState,
  reducers: {
    addToActiveTab: (state, action: PayloadAction<ActiveTabParams>) => {
      const { activeTabArray } = state;
      let notIncluded = false;
      state.currentSelectedRouter = action.payload.path;
      state.currentSelectedKey = action.payload.key;
      let index = 0;
      for (let item of activeTabArray) {
        if (item.key === action.payload.key) {
          notIncluded = true;
          break;
        }
        index++;
      }
      state.currentSelectedIndex = index;
      if (!notIncluded) {
        if (activeTabArray.length === MAXIMUMACTIVETAB) {
          activeTabArray.shift();
        }

        activeTabArray.push({ ...action.payload });

        state.currentSelectedIndex = activeTabArray.length - 1;
      } else if (action.payload.key === ROUTERKEYCONST.mathzone) {
        if (activeTabArray[index].path !== action.payload.path) {
          activeTabArray[index] = action.payload;
        }
      } else if (
        action.payload.key === ROUTERKEYCONST.mathvideolesson ||
        action.payload.key === CICO.key
      ) {
        activeTabArray[index] = action.payload;
      } else if (action.payload.key === ROUTERKEYCONST.speedmath) {
        activeTabArray[index] = action.payload;
      } else if (action.payload.key === ROUTERKEYCONST.miscellaneous.key) {
        activeTabArray[index] = action.payload;
      } else if (action.payload.key === IFRAMENEWCODING.key) {
        activeTabArray[index] = action.payload;
      }
    },
    deleteFromActiveTab: (state, action: PayloadAction<string>) => {
      let { activeTabArray } = state;
      // const navigate=useNavigate()

      activeTabArray = activeTabArray.filter((item) => {
        return item.key !== action.payload;
      });
      let currentTab: string = state.currentSelectedRouter;
      let currentSelectedKey = state.currentSelectedKey;

      if (!activeTabArray.length) {
        const { path, key, icon, name } = defaultRouter;
        activeTabArray = [
          {
            path,
            key,
            icon,
            name,
            extraParams: {},
          },
        ];
        currentTab = path;
      } else {
        if (action.payload == state.currentSelectedKey) {
          currentTab = state.activeTabArray[activeTabArray.length - 1].path;
          currentSelectedKey =
            state.activeTabArray[activeTabArray.length - 1].key;
        }

        // navigate(`${currentTab}?${getQueryParams()}`)
      }
      let i = 0;
      for (let item of activeTabArray) {
        if (item.path === currentTab) {
          break;
        }
        i++;
      }

      return {
        ...state,
        activeTabArray,
        currentSelectedRouter: currentTab,
        currentSelectedIndex: i,
        currentSelectedKey,
      };
    },
  },
});
export const { addToActiveTab, deleteFromActiveTab } = activeTabReducer.actions;
export default activeTabReducer.reducer;
