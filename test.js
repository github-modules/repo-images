const test = require('tape')
const repoImages = require('.')

test('repoImages', function (t) {
  repoImages('ummoji/ummoji-desktop').then(images => {
    t.ok(Array.isArray(images), 'is an array')

    t.comment('each image')
    t.ok(images.every(image => image && typeof image === 'object'), 'is an object')
    t.ok(images.every(image => image.path.length > 1), 'has a path')
    t.ok(images.every(image => image.rawgit.length > 1), 'has a rawgit URL')
    t.end()
  })
})
