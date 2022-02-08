module.exports = {
    base: '/ieu-js-sdk/',
    title: 'IeuSDK',
    description: 'Ieu js sdk, 三方登录服务组件，社交分享组件，ejoysdk',
    evergreen: true,
    smoothScroll: true,
    themeConfig: {
        label: '简体中文',
        selectText: '选择语言',
        ariaLabel: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        sidebar: {
            '/third-party/': [
                {
                    title: '第三方登录',
                    collapsable: false,
                    sidebarDepth: 3,
                    children: ['', 'lingxi', 'airline', 'weixin', 'bilibili'],
                },
            ],
            '/social-share/': [
                {
                    title: '社交分享',
                    sidebarDepth: 3,
                    collapsable: false,
                    children: ['', 'facebook', 'twitter', 'weixin', 'qq', 'weibo'],
                },
            ],
        },
        nav: [
            {
                text: '第三方登录',
                link: '/third-party/',
            },
            {
                text: '社交分享',
                link: '/social-share/',
            },
            {
                text: 'Changelog',
                link: 'https://github.com/ali-ieu/ieu-js-sdk/blob/master/CHANGELOG.md',
            },
        ],
    },
}
