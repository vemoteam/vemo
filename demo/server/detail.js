
module.exports = async (event, ctx) => {
    let result = await ctx.render('detail', {
        name: 'pretty'
    })
    return result
};