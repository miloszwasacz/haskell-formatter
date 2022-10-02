# Haskell formatter

VS Code formatter for Haskell extending [hindent](https://github.com/mihaimaruseac/hindent) & [stylish-haskell](https://github.com/haskell/stylish-haskell).

<!--TODO ## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow. -->

## Requirements

This extension depends on [hindent](https://hackage.haskell.org/package/hindent) & [stylish-haskell](https://hackage.haskell.org/package/stylish-haskell) that you can install via stack:
```shell
stack install hindent
stack install stylish-haskell
```
or cabal:
```shell
cabal install hindent
cabal install stylish-haskell
```

<!--TODO hindent & stylish-haskell args -->
<!-- ## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something. -->

## Known Issues

### Misidentifying `=` in guards
Example:
```haskell
foo :: String -> String -> Double
foo a b
  | c == "Foo = 3" = 3.0
  | c == "BarBaz = 2" = 2.0
  where
    c = a ++ b
```
Workaround:
```haskell
foo' :: String -> String -> Double
foo' a b
  | c == "Foo " ++ "=" ++ " 3" = 3.0
  | c == "BarBaz " ++ "=" ++ " 2" = 2.0
  where
    c = a ++ b
```

## Release Notes
For detailed change list see _[CHANGELOG](CHANGELOG.md)_.

### 1.0.1
Minor bug fixes.

### 1.0.0
Initial release of Haskell Formatter.

---

## Inspiration
This extension is based on [stylish-hindent](https://github.com/CameronDiver/vscode-stylish-hindent) extension.
