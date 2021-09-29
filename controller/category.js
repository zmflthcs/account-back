const {Category, User, Record} = require('../models');

exports.get_all_categories = async (req,res,next) => {
    try{
        const userKey = res.locals.userKey;
        const categories = await Category.findAll({
            attributes: ['id', 'text', 'type'],
            where: {fk_user: userKey}
        });
        console.log('category result', categories);
        res.status(200).json({
            count: categories.length,
            categories: categories.map(category=>{
                return {
                    id: category.id,
                    text: category.text,
                    type: category.type,
                }
            })

        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
}

exports.delete_category = async(req,res,next) => {
    try{
        console.log('delete category router');
        const userKey = res.locals.userKey;
        const categoryId = req.params.categoryId;
        console.log(categoryId);
        const records = await Record.findAll({
            where: {fk_category: categoryId}
        });
        console.log('record in category', records);
        if(records.length>0){
            return res.status(409).json({
                message: 'Have records in category. Delete all records before delete category'
            })
        }
        const result = await Category.destroy({where: {id: categoryId, fk_user: userKey}});
        console.log('destroyed category', result);

        res.status(200).json({
            message: 'category deleted'
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}

exports.create_category = async(req,res,next) => {
    try{
        const text = req.body.text;
        const userKey = res.locals.userKey;
        const type = req.body.type;

        const result = await Category.create({
            text: text,
            type: type,
            fk_user: userKey,
        });
        res.status(201).json({
            message: `Category ${text} created successfully`,
            createdCategory: {
                text: text,
                type: type,
                id: result.id
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }

}
