# Pattern Data Plugin

This is a PatternLab plugin for utilizing other pattern's data in a pattern
data.

## Installation

Add the following section info the `patternlab-config.json` file.

```json
{
  "plugins": {
	  "plugin-pattern-data": {
		  "enabled": true
	  }
  }
}
```

Ensure the plugin is available to NPM.

`npm link source/_plugins/plugin-pattern-data`

## Usage

In a pattern's data file, data may be referenced from another pattern.

```yaml
# Shorthand syntax referencing the menu pattern by its "patternPartial", which
# can be found as the "p" parameter in the URL when browsing the PatternLab UI.
menu: 'patternData@organisms-menu'

# Shorthand syntax referencing the call to action pattern by "verbosePartial".
#  This is the file path of the twig or yaml file relative to the
# source/_patterns directory, omitting the extension.
call_to_action: 'patternData@02-organisms/call-to-action/call-to-action~exclaim'
```

Additionally, a long-form syntax is available. In the future, it may be
possible to utilize additional data or configurations from within plugin.

One idea here is that we'd be able to "extend" the other pattern's data with
data provided here. Other behaviors or functionality may also be possible.

```yaml
# Long form syntax referencing the menu pattern by its "patternPartial".
menu:
  patternData: 'organisms-menu'

# Long form syntax referencing the call to action pattern by its
# "patternPartial".
call_to_action:
  patternData: '02-organisms/call-to-action/call-to-action~exclaim'
```
