// * TData = "Whatever type you need for this specific API call"
export interface ApiResult<TData> {
  success: boolean;
  data: TData | null;
  error: string | null;
}