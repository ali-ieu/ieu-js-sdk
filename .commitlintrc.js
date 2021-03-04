module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [0, 'always', ['release', 'build', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']],
    },
}
