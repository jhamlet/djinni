import { Observable } from 'rxjs';
const { of } = Observable;

export const traverse = node =>
  (node.stats.isDirectory() ?
    node.content.concatMap(traverse) :
    of(node)).
    publishReplay().
    refCount();

export default traverse;
