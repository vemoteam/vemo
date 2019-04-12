
module.exports = async (event, ctx) => {
    console.log(event)
    console.log(ctx.request.body)
    console.log(ctx.request.query)
    return ctx.request.body
};