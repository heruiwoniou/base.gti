var total = 10;
module.exports = {
    types() {
        return this.render.json([
            { id: 1, name: '海大新闻' },
            { id: 2, name: '院系动态' },
            { id: 3, name: '部处通知' },
            { id: 4, name: '校内信息' },
            { id: 5, name: '会议通知' }
        ]);
    },
    article(query) {
        var type = query.type || "模块";
        var count = query.count || 20;
        var result = []
        for (var i = 0; i < count; i++) {
            result.push({
                head: type + ':中国海洋大学举办第五届中俄北极论坛' + i,
                img: 'dist/style/images/new_' + (i % 4) + '.jpg',
                content: '第五届中俄北极论坛于10月31日在青岛举行。本届论坛由中国海洋大学主办，论坛议题是“中俄北极合作：障碍与前景”。中国海洋大学党委副书记、副校长陈锐致欢迎辞，法政学院院长刘惠荣教授致开幕词。 　　陈锐在致辞中代表学校对从事北极问题研究的中外学者代表在青岛聚首表示热烈欢迎，他预祝第五届中俄北极论坛顺利召开，并希望中俄两国学者在学术上广泛交流，推动中俄两国合作取得更大突破。刘惠荣院长在致辞中指出，随着全球气候的变化和国际政治格局的变动，北极相关议题日益走进人们的视野，特别是中国加入北极理事会后，北极地区更是与中国的切身利益息息相关。俄罗斯作为最大的北极国家，与中国在北极问题上有着诸多共同利益。',
                date: '2016/09/13',
                href: 'http://www.baidu.com'
            })
        }
        return this.render.json(result);
    }
}