import { file, readdir, traverse } from '../src/fs';
import { expect } from 'chai';
import path from 'path';

describe('fs', () => {
  let mocha;

  before(function () { mocha = this; });

  describe('readdir', () => {
    it('should return the contents of the directory', () => {
      readdir(__dirname + '/data').
        subscribe(contents => {
          expect(contents).to.deep.equal(['bar.js', 'foo.js']);
        });
    });
  });

  describe('file', () => {
    it('should return a file info object', () => {
      file(__dirname + '/data/foo.js').
        subscribe(fileinfo => {
          console.log(fileinfo);
        });
    });
  });

  describe('traverse', () => {
    it('should traverse', done => {
      mocha.timeout(0);

      const startpath = process.env.PROJECT_DIR;

      traverse(startpath).
        take(10).
        // concatMap(info =>
          // info.
          // contents.
          // map(contents => `# ${info.filename}\n${contents}`)
        // ).
        subscribe(
          info => console.log(info.filename),
          null,
          done
        );
    });
  });
});
