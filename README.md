# Rework Import

[Rework](https://npmjs.org/package/rework) plugin for allowing CSS files to
import other CSS files.

## Usage

To properly use the import plugin you should make sure it's the first you call
use on. This allows your other plugins to do their work on the imported CSS.

**Notice:** this module does not use "native" CSS `@import url()` style syntax.
If you want that, look at this [module](https://github.com/jxson/rework-import)
that I totally missed when I did my first search for an import module.

```javascript
var rework = require('rework');
var imprt  = require('rework-import');
var fs     = require('fs');

// Not recommended way of loading styles...
rework(fs.readFileSync('style.css'), 'utf-8')
  .use(imprt(opts)) // opts described below
  .use(another-plugin)
  .use(another-plugin)
  .toString();
```

_style.css_

```css
@import {
  file: myFirstCSSFile.css;
  file: mySecondCSSFile.css
}
```

_myFirstCSSFile.css_

```css
body {
  background: #000;
}
```

_myFirstCSSFile.css_

```css
h1 {
  font-size: 200px;
}
```

_Resulting CSS_

```css
body {
  background: #000;
}

h1 {
  font-size: 200px;
}
```

## Options

Available options are:

* **path**, required option. Path to the base directory, all imports will be
relative to this path.
* **whitespace**, set to true if you want to use [significant
whitespace](https://npmjs.org/package/css-whitespace) in your imported files.
* **encoding**, if your CSS is anything other then UTF-8 encoded.

## Syntax

The syntax might look a bit odd, but that's because we need Rework to parse it
like CSS to get it into the inital AST.

## Nesting

Imported CSS can import other CSS. There's no check for circular imports at the
moment though, so don't be stupid. Mm kay?

## Known issues

* Imports currently, probably, only work at the "top level" stylesheet. Not
inside `@keyframes` or `@media` declarations.`

## License

MIT

