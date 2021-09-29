const { Record, Category, User } = require("../models");
const { Op } = require("sequelize");
exports.get_record = async (req,res,next) => {
    try{
        const record = await Record.findOne({
            where: {
                id: req.params.id,
            },
            include: [{
                model: Category,
                attribute: ['text', 'type', 'fk_user'],
                required: true,
            }]
        });
        if (record.category.fk_user === res.locals.userKey) {
            res.status(200).json(record);
        }else{
            throw new Error('no data');
        }
    }catch(err){
        console.log(err);

        res.status(500).json({
            error: err.messagewhere
        })
    }
}

exports.create_record = async (req,res,next) => {
    let incomeList = req.body.income;
    let expenseList = req.body.expense;
    const date = req.body.date;
    
    incomeList=incomeList.map(income=> ({...income, date: date, fk_category: income.category}));
    expenseList = expenseList.map(expense=> ({...expense, date: date,fk_category: expense.category}));

    newRecords = incomeList.concat(expenseList);
    try{
        const result = await Record.bulkCreate(newRecords);
        res.status(200).json({message: 'success create records',
        createdRecord: result
        });
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'failed to create records'});
    }   
}

exports.get_records_condition  = async (req,res,next) => {
    try{
    const date={};
    console.log('this is query',req.query);
    if(req.query.startDate){
        date[Op.gte] = req.query.startDate
    }
    if(req.query.endDate){
        date[Op.lte] = req.query.endDate
    }
   

    const records = await Record.findAll({
        nest: true,
        where: {
            ...(req.query.startDate||req.query.endDate) && {date: date},
            ...(req.query.category) && {fk_category: req.query.category},
        },
        include: {
            model:Category,
            where: {
                fk_user: res.locals.userKey
            },
            attributes: ['text', 'type'],
            ...(req.query.type) && {where: {type: req.query.type}}
        },
        order: [
            ['date', 'DESC']
        ]
    });

    res.json({
        records: records
    });
    
    }catch(err){
        console.log(err)
        res.status(500).send('error in query record');

    }
}


exports.change_record = async (req,res,next) => {
    try{
        const recordId = req.params.id;
        const updateOps = {};
        const possibleColumn = ['content', 'cost', 'memo', 'date'];

        for(const ops of req.body){
            if(possibleColumn.includes(ops.propName)){
                updateOps[ops.propName] = ops.value
            }
        }
        const record = await Record.findOne({
            where: {
                id: req.params.id,
            },
            include: [{
                model: Category,
                attribute: ['text', 'type', 'fk_user'],
                required: true,
            }]
        });
        
        if(record && record.category.fk_user === res.locals.userKey ){
            const result = await Record.update(updateOps, {where: {id: recordId}})
           console.log(result);
            return res.status(200).json({
                message: 'Record updated successfully'
            });
        }else{
            res.status(403).json({
                error: 'no right to access'
            });
        }
    } catch(err){
        console.log(err);
        res.status(500).json({
            error: 'failed to change record'
        })

    }

}

exports.delete_record = async (req,res,next) => {
    try{
        const recordId = req.params.id;
        const userKey = res.locals.userKey;

        const result = await Record.findOne({where: {id: recordId}, include: {
            model: Category,
            required: true,
            where: {
                fk_user: userKey+1
            }
        }});
        
        if(result){
            await Record.Destroy({
                where: {id: recordId}
            });
            res.status(200).json({
                message: 'record deleted successfully'
            })
        }else{
            throw Error('failed delete record');
        }
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
}