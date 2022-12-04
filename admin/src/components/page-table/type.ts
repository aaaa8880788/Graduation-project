export interface ITableOption {
  prop?: string;
  label: string;
  minWidth?: string;
  slotName?: string;
  align?: string;
}
export interface ITable {
  propList: ITableOption[];
  showIndexColumn?: boolean;
  showSelectColumn?: boolean;
}
