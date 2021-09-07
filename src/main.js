const { program } = require('commander')
const { version } = require('./constants')
const path = require('path')

const mapActions = {
    transform: {
        alias: 't',
        description: 'transform rpx to px',
        example: ['edu-rpx2px transform <project-path>']
    },
    '*': {
        alias: '',
        description: 'command no found',
        example: []
    }
}

Reflect.ownKeys(mapActions).forEach(action => {
    program
        .command(action)
        .alias(mapActions[action].alias)
        .description(mapActions[action].description)
        .action(() => {
            if (action == '*') {
                return console.log(mapActions[action].description)
            } else {
                require(path.resolve(__dirname, action))(...process.argv.slice(3))
            }
        })
})

program.on('--help', () => {
    console.log('\nExample:')

    Reflect.ownKeys(mapActions).forEach(action => {
        mapActions[action].example.forEach(example => {
            console.log(action + '|' + mapActions[action].alias + ' ' + example)
        })
    })
})

program.version(version).parse(process.argv)