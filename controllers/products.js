const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({})
    .select('name price')
    .limit(10)
    .skip()
    res.status(200).json({products, nbHits: products.length})
}

const getAllProducts = async (req, res) => {
    const {feature, company, name, sort, fields} = req.query
    const queryObject = {}
    
    if(feature) {
        queryObject.feature = feature === 'true' ? true : false
    } 
    if(company) {
        queryObject.company = company
    }
    if(name) {
        queryObject.name = {$regex: name, $options: 'i'}
    }
    console.log(queryObject)
    let result = await Product.find(queryObject)

    //sort
    if(sort) {
        let sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } 

    //fields
    if(fields) {
        let fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = Number(page - 1) * limit
    const products = await result
    res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}