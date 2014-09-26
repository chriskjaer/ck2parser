# Crusader Kings 2 Savegame Parser
A CK2 Savegame to JSON parser for the Paradox Game: [http://www.crusaderkings.com/](Crusader Kings 2).


## Features
Takes the path to an uncompressed savegame and returns a promise which resolves
to a json object.


## Usage
Install package with npm. `npm install ck2parser --save`

```
var parse = require('ck2parser');
var SAVEGAME = '../path/to/you/savefile.ck2';

parse(SAVEGAME)
  .then(console.log)
  .catch(console.error)
```


## Author

**Chris Kjær Sørensen**

+ [http://twitter.com/ckjaer](http://twitter.com/ckjaer)
+ [http://github.com/chriskjaer](http://github.com/chriskjaer)


## Copyright and license
Copyright Chris Kjær Sørensen

[License.md](LICENSE-MIT)
