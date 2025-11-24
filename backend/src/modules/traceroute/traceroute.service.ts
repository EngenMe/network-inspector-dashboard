import { execAsync } from '../../utils/exec';
import type {TracerouteQuery} from './traceroute.schema';
import type {TracerouteResult} from './traceroute.types';

export class TracerouteService {
    static async run(query: TracerouteQuery): Promise<TracerouteResult> {
        return { hops: [], totalHops: 0 };
    }
}
