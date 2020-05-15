# Welcome to LastingType!

LastingType is a cross-browser extension that lets you store all your blog posts in the blockchain.

## For content creators

We made LastingType for content creators who want to:

- Make sure their content is **safe**
- Regain **full ownership** of what they write
- Protect their **intellectual property**
- Be resilient to **censorship**

Write your blog posts on Medium, WordPress, Blogger or your favourite blogging platform and let LastingType mirror all your content to the blockchain. They will then last forever.

## 🚀 Quick Start

LastingType is not yet ready for the production and it is not available in your browser extensions, however, you can test it out in development mode.

### Supported browsers

| [![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](/) | [![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](/) | [![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png)](/) | [![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](/) | [![Yandex](https://raw.github.com/alrra/browser-logos/master/src/yandex/yandex_48x48.png)](/) | [![Brave](https://raw.github.com/alrra/browser-logos/master/src/brave/brave_48x48.png)](/) | [![vivaldi](https://raw.github.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png)](/) |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 49 & later ✔                                                                                  | 52 & later ✔                                                                                     | 36 & later ✔                                                                               | 79 & later ✔                                                                            | Latest ✔                                                                                      | Latest ✔                                                                                   | Latest ✔                                                                                         |

### Test LastingType in development mode

- `yarn install` to install dependencies.

- #### Chrome

  - `yarn run dev:chrome`
  - Go to the browser address bar and type `chrome://extensions`
  - Check the `Developer Mode` button to enable it.
  - Click on the `Load Unpacked Extension…` button.
  - Select your extension’s extracted directory.

- #### Firefox

  - `yarn run dev:firefox`
  - Load the Add-on via `about:debugging` as temporary Add-on.
  - Choose the `manifest.json` file in the extracted directory

- #### Opera
  - `yarn run dev:opera`
  - Load the extension via `opera:extensions`
  - Check the `Developer Mode` and load as unpacked from the extension’s extracted directory.
