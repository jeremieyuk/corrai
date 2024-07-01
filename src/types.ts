export interface FoctorIndicator {
  foctor:string;
  foctor_sourse : string[];
  symbol:string;
  id: string;
  label: string;
  payload: any;
}

export interface HighchartComponentProps {
  symbol: string;
  foctors: {
    symbol: string;
    foctor_id: string;
    foctor_sourse: string[];
    foctor: string;
    foctor_indicator?: FoctorIndicator[];
  }[];
  setfoctors: React.Dispatch<React.SetStateAction<{
    foctor_id: string;
    symbol: string;
    foctor_sourse: string[];
    foctor: string;
    foctor_indicator?: FoctorIndicator[];
  }[]>>;
  newFactorAdded: boolean;
  setNewFactorAdded: (newFactorAdded: boolean) => void;
  newNewIndicator: boolean;
  setnewNewIndicator: (newFactorAdded: boolean) => void;
  setfoctorsIndicator: (
    foctors: { foctor_id?: string; symbol: string; foctor_sourse: string[]; foctor: string }
  ) => void;
  foctorsIndicator: { foctor_id?: string; symbol?: string; foctor_sourse?: string[]; foctor?: string };
}

export interface BtsSideBarProps {
  symbol: string;
  foctors: {
    symbol: string;
    foctor_id: string;
    foctor_sourse: string[];
    foctor: string;
    foctor_indicator?: FoctorIndicator[];
  }[];
  setfoctors: React.Dispatch<React.SetStateAction<{
    foctor_id: string;
    symbol: string;
    foctor_sourse: string[];
    foctor: string;
    foctor_indicator?: FoctorIndicator[];
  }[]>>;
  newFactorAdded: boolean;
  setNewFactorAdded: (newFactorAdded: boolean) => void;
  newNewIndicator: boolean;
  setnewNewIndicator: (newFactorAdded: boolean) => void;
  setfoctorsIndicator: (
    foctors: { foctor_id: string; symbol: string; foctor_sourse: string[]; foctor: string }
  ) => void;
  foctorsIndicator: { foctor_id?: string; symbol?: string; foctor_sourse?: string[]; foctor?: string };
}

export interface ChooseBarProps {
  symbol: string;
  foctors: {
    symbol: string;
    foctor_id: string;
    foctor_sourse: string[];
    foctor: string;
    foctor_indicator?: FoctorIndicator[];
  }[];
  setfoctors: React.Dispatch<React.SetStateAction<{
    foctor_id: string;
    symbol: string;
    foctor_sourse: string[];
    foctor: string;
    foctor_indicator?: FoctorIndicator[];
  }[]>>;
}
