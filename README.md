# Neovim to Voice (MacOS only)

Very simple neovim plugin that uses MacOS voice synthesizer to convert buffer contents to voice.


## Requirements

- NodeJS >=8
- MacOS voice synthesizer, installed by default

## How to install

Copy the `CodeToVoice.js` file to `~/.config/nvim/rplugin/node/`

Open `neovim` and run `:UpdateRemotePlugins`, then restart `neovim`

## Capabilities

|Action   |Key shortcut   |
|---|---|
|Read char  |`<leader>lc`   |
|Read word   |`<leader>lw`   |
|Read line   |`<leader>ll`   |
|Read file name   |`<leader>lfn`   |
|Read file directory   |`<leader>lfd`   |
|Read file path   |`<leader>lfp`   |
|Read full file content   |`<leader>lff`   |
|Read current line number   |`<leader>lfl`   |
