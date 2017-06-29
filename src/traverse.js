import { Observable } from 'rxjs';
import { anyPass, curryN, test, unary } from 'ramda';
import { node } from 'util/fs';

const { empty, of } = Observable;

const DEFAULTS = {
  directories: false,
  exclude: []
};

const isDirectory = node => node.stats.isDirectory();
const isFile      = node => node.stats.isFile();

export default curryN(2, (opts = {}, filepath) => {
  const { exclude, directories } = { ...DEFAULTS, ...opts };

  const isExcluded = anyPass(exclude.map(unary(test)));

  const mapFile = filenode =>
    filenode.
      content.
      map(content => ({ ...filenode, content }));

  const mapDirectory = dirnode =>
    // parent first
    (directories ? of(dirnode) : empty()).
      concat(
        // then files in that directory
        dirnode.
        content.
        filter(isFile).
        concat(
          // followed by other directories
          dirnode.
          content.
          filter(isDirectory)
        ).
        concatMap(node => mapNode(node))
      );

  const mapNode = (node) => 
    isExcluded(node.filename) ?
      empty() :
      isDirectory(node) ?
        mapDirectory(node) :
        isFile(node) ?
          mapFile(node) :
          empty();

  return node(filepath).
    concatMap(mapNode);
});
