const fs = require('fs');

const res = fs.readFileSync('CHANGELOG.md', {
    encoding: 'utf-8'
});

fs.writeFileSync('CHANGELOG.md', res.replace(/g\.hz\.netease\.com:22222/g, 'g.hz.netease.com'), {
    encoding: 'utf-8'
});