const fsbx = require('fuse-box')

// utils
const isDevelopment = process.env.NODE_ENV === 'development'
const name = isDevelopment ? 'build/bundle' : 'build/dist.min'

// plugins
const plugins = [fsbx.BabelPlugin()]

if (!isDevelopment) {
  plugins.push(fsbx.UglifyJSPlugin())
}

// config
const fuse = fsbx.FuseBox.init({
  homeDir: 'src',
  output: 'static/$name.js',
  debug: isDevelopment,
  log: isDevelopment,
  sourceMaps: isDevelopment,
  plugins
})

// start dev server
if (isDevelopment) {
  fuse.dev({
    open: true,
    root: 'static'
  })
}

// bundle
const bundler = fuse
  .bundle(name)  
  .instructions('>main.js')  

if (isDevelopment) {
  bundler
    .watch('src/**')
    .hmr()
}

fuse.run()
