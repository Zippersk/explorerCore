import BaseQuery from "./baseQuery";
import PropertyCondition from "../conditions/propertyCondition";
import QueryPlanner from "../planners/queryPlanner";
import DatabaseInstance from "../database/databaseInstance";
import Database from "../database/databaseStore";
import BTree from "../../BTree/BTree";
import { Comparator, KeyGetter } from "../../BTree/types";
import { deflate, Serialize, inflate } from "serialazy";
import JsonType from "serialazy/lib/dist/types/json_type";

type indexes = {
    primary: string,
    indexes: {
        [property: string]: {
            property: string,
            branching: number,
            comparator: Comparator<any>,
            keyGetter: KeyGetter<any, any>;
        };
    },
};

export default class Queriable<T> extends BaseQuery<T> {
    public __TABLE_NAME__: string;
    public __INDEXES__: indexes;

    constructor()
    {
        super();
        this.queryPlanner = new QueryPlanner(this.__TABLE_NAME__);
    }

    public where(propertyNameOrNestedQuery): PropertyCondition
    {
        if (typeof propertyNameOrNestedQuery === "string")
        {
            const whereCondition = new PropertyCondition(
                propertyNameOrNestedQuery,
                this.queryPlanner
            );
            this.queryPlanner.addAndCondition(whereCondition);
            return whereCondition;
        }
    }

    public async save(): Promise<void>
    {
        return await Database.selectedDatabase.create(this);
    }

    public toJson(): JsonType
    {
        const res = {};
        for (const property in this)
        {
            if (this.hasOwnProperty(property))
            {
                res[property as string] = this[property];
            }
        }
        return res;
    }
}
