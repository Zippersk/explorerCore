import IndexStore from "../indexes/indexStore";
import QueryPlanner from "../planners/queryPlanner";

export default class BaseQuery<T> {
    protected queryPlanner: QueryPlanner;

    public async all() {
        return await this.queryPlanner.getAll();
    }

    public async first() {
        return await this.queryPlanner.getFirst();
    }

    public async skip(skip: number) {
        this.queryPlanner.skip = skip;
        return this;
    }

    public async take(limit: number) {
        return await this.queryPlanner.take(limit);
    }

    public async paginate(perPage: number) {
        return await this.queryPlanner.paginate(perPage);
    }

    public async iterate() {
        return this.queryPlanner.iterate();
    }
}
