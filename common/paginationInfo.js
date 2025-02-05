export default function paginationInfo(totalItems, limit, page) {
  const noPages = Math.ceil(totalItems / limit);
return { totalItems, itemsPerPage: parseInt(limit) , noPages, hasNext: page < noPages, hasPrev: page > 1};
}
