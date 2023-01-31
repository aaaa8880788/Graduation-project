type UserId = number | string;
type PlaceId = number | string; 
type ActiveId = number | string;
type ArticleId = number | string;
type FacultyId = number | string;
type GiftId = number | string;
type OrganizationId = number | string;
type PracticeId = number | string;
type VedioId = number | string;
type SchoolId = number | string;
type RoleId = number | string;
type ClassId = number | string;
type CommentId = number | string;
type OrderId = number | string;
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
  CommentId,
  ArticleId,
  FacultyId,
  GiftId,
  OrderId,
  OrganizationId,
  PracticeId,
  VedioId,
  SchoolId,
  RoleId,
  ClassId
};
