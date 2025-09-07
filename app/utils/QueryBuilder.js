import { excludeFields } from "../constant/index.js";

export class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    filter() {
        const filter = { ...this.query };

        for (const field of excludeFields) {
            delete filter[field];
        }
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }

    sort() {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    fieldFilter() {
        const fields = this.query.fields?.split(",").join(" ") || "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }

    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    populate(fields) {
        this.modelQuery = this.modelQuery.populate(fields)
        return this
    }

    build() {
        return this.modelQuery;
    }

    async getMeta() {
        const totalDocuments = await this.modelQuery.model.countDocuments();

        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const totalPage = Math.ceil(totalDocuments / limit);

        return {
            page,
            limit,
            total: totalDocuments,
            totalPage
        };
    }
}
