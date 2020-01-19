const util = require('util')
const exec = util.promisify(require('child_process').exec)

class CodeToVoice {
  constructor(plugin) {
    this.plugin = plugin
    this.nvim   = plugin.nvim

    plugin.registerCommand('ListenChar', [this, this.ListenChar], {sync: false, range: '', nargs: '*'})
    plugin.registerCommand('ListenWord', [this, this.ListenWord], {sync: false, range: '', nargs: '*'})
    plugin.registerCommand('ListenLine', [this, this.ListenLine], {sync: false, range: '', nargs: '*'})
    plugin.registerCommand('ListenFilePath', [this, this.ListenFilePath], {sync: false, range: '', nargs: '*'})
    plugin.registerCommand('ListenFileName', [this, this.ListenFileName], {sync: false, range: '', nargs: '*'})
    plugin.registerCommand('ListenFileDirectory', [this, this.ListenFileDirectory], {sync: false, range: '', nargs: '*'})
    plugin.registerCommand('ListenFullFile', [this, this.ListenFullFile], {sync: false, range: '', nargs: '*'})
    plugin.registerCommand('ListenCurLine', [this, this.ListenCurLine], {sync: false, range: '', nargs: '*'})
    plugin.registerAutocmd('BufEnter', [this, this.onBufferEnter], { sync: true, pattern: '*.js', eval: 'expand("<afile>")' })
  }

  translate(token) {
    return token
      .replace(/\s/g, ' espacio ')
      .replace(/\t/g, ' tabulación ')
      .replace(/\|/g, ' páip ')
      .replace(/:/g,  ' dos puntos ')
      .replace(/,/g,  ' coma ')
      .replace(/;/g,  ' punto coma ')
      .replace(/-/g,  ' guión ')
      .replace(/_/g,  ' guión bajo ')
      .replace(/#/g,  ' numeral ')
      .replace(/&/g,  ' ámpersand ')
      .replace(/\$/g, ' dólar ')
      .replace(/=/g,  ' igual ')
      .replace(/\//g, ' barra ')
      .replace(/\(/g, ' abre paréntesis ')
      .replace(/\)/g, ' cierra paréntesis ')
      .replace(/\./g, ' punto ')
      .replace(/\{/g, ' abre llave ')
      .replace(/\}/g, ' cierra llave ')
      .replace(/\[/g, ' abre corchete ')
      .replace(/\]/g, ' cierra corchete ')
      .replace(/\`/g, ' tílde invertida ')
      .replace(/\´/g, ' tílde ')
      .replace(/\*/g, ' asterísco ')
      .replace(/\^/g, ' gorro ')
      .replace(/\'/g, ' comilla simple ')
      .replace(/\"/g, ' comilla doble ')
      .replace(/\\/g, ' barra invertida ')
      .replace(/\</g, ' menor que ')
      .replace(/\>/g, ' mayor que ')
      .replace(/¿/g,  ' abre interrogación ')
      .replace(/¡/g,  ' abre exclamación ')
      .replace(/!/g,  ' cierra exclamación ')
      .replace(/%/g,  ' porcentaje ')
  }

  async speak(text, rate = '--rate=140') {
    const { stdout, stderr } = await exec(`say ${rate} "${text}"`)
    console.log('stdout:', stdout)
    console.error('stderr:', stderr)
  }

  async registerShortcut(shortcut, fn) {
    const normal = `nmap <leader>${shortcut} :${fn}<CR>`
    const visual = `vmap <leader>${shortcut} :${fn}<CR>`

    await this.nvim.command(normal)
    await this.nvim.command(visual)
  }

  async ListenFullFile(args, range) {
    const fullFile = await this.nvim.eval(`join(getline(1, '$'), "\n")`)
    await this.speak(fullFile)
  }

  async ListenCurLine(args, range) {
    const curLine = await this.nvim.eval(`line('.')`)
    await this.speak(curLine)
  }

  async ListenFilePath(args, range) {
    const currentFile = this.translate(await this.nvim.eval(`expand("%:p")`))
    await this.speak(`La ruta es: ${currentFile}`, '--rate=135')
  }

  async ListenFileName(args, range) {
    const currentFile = this.translate(await this.nvim.eval(`expand("%:t")`))
    await this.speak(`El archivo es: ${currentFile}`)
  }

  async ListenFileDirectory(args, range) {
    const currentDir = this.translate(await this.nvim.eval(`expand("%:p:h:t")`))
    await this.speak(`El directorio es: ${currentDir}`)
  }

  async ListenChar(args, range) {
    const currentChar = this.translate(await this.nvim.eval("strcharpart(getline('.')[col('.') - 1:], 0, 1)"))
    await this.speak(`${currentChar}`)
  }

  async ListenWord(args, range) {
    const currentWord = this.translate(await this.nvim.eval('expand("<cword>")'))
    await this.speak(`${currentWord}`)
  }

  async ListenLine(args, range) {
    const currentLine = this.translate(await this.nvim.eval('getline(".")'))
    await this.speak(`${currentLine}`, '--rate=130')
  }

  async onBufferEnter() {
    const nvim = this.plugin.nvim

    this.registerShortcut('lfl', 'ListenCurLine')
    this.registerShortcut('lff', 'ListenFullFile')
    this.registerShortcut('lfp', 'ListenFilePath')
    this.registerShortcut('lfn', 'ListenFileName')
    this.registerShortcut('lfd', 'ListenFileDirectory')
    this.registerShortcut('lc', 'ListenChar')
    this.registerShortcut('lw', 'ListenWord')
    this.registerShortcut('ll', 'ListenLine')
  }
}

module.exports = CodeToVoice

