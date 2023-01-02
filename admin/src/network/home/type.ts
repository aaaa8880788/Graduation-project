type UserId = number | string;
type PlaceId = number | string; 
type ActiveId = number | string;
type ArticleId = number | string;
type FacultyId = number | string;
type GiftId = number | string;
type OrganizationId = number | string;
type PracticeId = number | string;
interface findType {
  pageSize?: number;
  page?: number;
  queryInfo?:object
}
export type { 
  findType,
  UserId,
  PlaceId,
  ActiveId,
  ArticleId,
  FacultyId,
  GiftId,
  OrganizationId,
  PracticeId
};
