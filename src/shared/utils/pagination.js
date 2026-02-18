export const paginate = async ({
  model,
  filter = {},
  projection,
  sort,
  populate,
  page = 1,
  limit = 10,
}) => {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const query = model
    .find(filter)
    .skip(skip)
    .limit(limitNumber);

  if (projection) {
    query.select(projection);
  }

  if (sort) {
    query.sort(sort);
  }

  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((p) => query.populate(p));
    } else {
      query.populate(populate);
    }
  }

  const [items, total] = await Promise.all([
    query,
    model.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(total / limitNumber),
  };
};
