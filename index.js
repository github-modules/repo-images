const github = require('gh-got')
const pify = require('pify')
const URL = require('url')
const imagePattern = /\.(png|gif|jpg|svg|bmp|icns|ico|sketch)$/i

function repoImages (repo, opts, callback) {
  if (!callback) {
    callback = opts
    opts = {}
  }

  opts.token = opts.token ||
    process.env.GITHUB_ACCESS_TOKEN ||
    opts.access_token

  opts.branch = opts.branch || 'master'

  const url = URL.format({
    protocol: 'https:',
    hostname: 'api.github.com',
    pathname: `repos/${repo}/git/trees/${opts.branch}`,
    query: {
      recursive: '1'
    }
  })

  github(url, opts)
    .then(response => {
      var images = []
      if (response && response.body && response.body.tree) {
        images = response.body.tree
          .filter(image => !!image.path.match(imagePattern))
          .map(image => {
            image.rawgit = URL.format({
              protocol: 'https:',
              hostname: 'cdn.rawgit.com',
              pathname: `${repo}/${opts.branch}/${image.path}`
            })
            return image
          })
      }
      return callback(null, images)
    })
    .catch(err => {
      return callback(err)
    })
}

module.exports = pify(repoImages)
