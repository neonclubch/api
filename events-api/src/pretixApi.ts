import axios, { AxiosRequestConfig } from "axios";

const pretixApi = axios.create({
  baseURL: "https://pretix.eu/api/v1/organizers/neon",
  headers: { Authorization: `Token ${process.env['PRETIX_TOKEN']}` }
});

export async function getEvents(query: AxiosRequestConfig["params"] = {}) {
  const response = await pretixApi.get<Response<Event[]>>("/events", { params: query });
  return response;
}

interface Response<T> {
  count: number;
  next: unknown | null;
  previous: unknown | null;
  results: T;
}

interface LocalizedString {
  en: string;
  [locale: string]: string;
}

interface Event {
  name: LocalizedString;
  slug: string;
  live: boolean;
  testmode: boolean;
  currency: string;
  date_from: string;
  date_to: string;
  date_admission: string | null;
  is_public: boolean;
  presale_start: string | null;
  presale_end: string | null;
  location: LocalizedString;
  geo_lat: number;
  geo_lon: number;
  has_subevents: boolean;
  meta_data: unknown;
  seating_plan: unknown;
  plugins: unknown;
  seat_category_mapping: unknown;
  timezone: string;
  item_meta_properties: unknown;
  all_sales_channels: boolean;
  limit_sales_channels: unknown;
  public_url: string;
  sales_channels: unknown;
}
