# Trist Text

[Site](https://trystal.net/) |
[Docs](https://trystal.net/) |
[Wiki](https://github.com/trystal/trist-text/wiki "Changelog, Roadmap, etc.") |
[Code of Conduct](https://jquery.org/conduct/) |
[Twitter](https://twitter.com/trystalnet) |
[Chat](https://gitter.im/trystal/trystal)

## Trist Text?
This is a library of tools for converting plain text documents into the 'trist' format used by Trystal and other products.

This initial release is fairly crude -- it does a bit of analysis on the text to find leading spaces or tabs and uses 
those to set the identation levels for each line.

It also imposes an ~25 child limit per line in order to prevent massively flat structures which would defeat the purpose 
of using trists and bog down the browser client for trystal.net.

   
