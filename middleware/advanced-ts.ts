import { Request, Response, NextFunction } from "express";
import { Model, Document } from "mongoose";

interface AdvancedResults {
  success: boolean;
  total: number;
  count: number;
  pagination: {
    next?: {
      page: number;
      limit: number;
    };
    prev?: {
      page: number;
      limit: number;
    };
  };
  data: Document[];
}

interface AdvancedResultsResponse extends Response {
  advancedResults: AdvancedResults;
}

interface QueryString {
  select?: string;
  sort?: string;
  page?: string;
  limit?: string;
  [key: string]: any;
}

const advancedResults =
  (model: Model<any>, populate?: string | object) =>
  async (
    req: Request,
    res: AdvancedResultsResponse,
    next: NextFunction
  ): Promise<void> => {
    let query;

    // Copy req.query
    const reqQuery: QueryString = { ...req.query };

    // Fields to exclude
    const removeFields: string[] = ["select", "sort", "page", "limit"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryString: string = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, $lt, $lte, $in)
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    query = model.find(JSON.parse(queryString)).populate("courses");

    // Select fields
    if (req.query.select) {
      const fields: string = req.query.select.toString().split(",").join(" ");
      query = query.select(fields);
    }

    // Sort fields
    if (req.query.sort) {
      const sortBy: string = req.query.sort.toString().split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 2;
    const startIndex: number = (page - 1) * limit;
    const endIndex: number = page * limit;
    const total: number = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
      query = query.populate(populate);
    }

    // Executing query
    const results: Document[] = await query;

    // Pagination result
    const pagination: {
      next?: { page: number; limit: number };
      prev?: { page: number; limit: number };
    } = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.advancedResults = {
      success: true,
      total,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  };

export default advancedResults;
