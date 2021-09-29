module.exports = (sequelize, DataTypes) => {
    return sequelize.define('record',{
        content: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true    
            }
        },
        cost:{
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
        },
        memo:{
            type: DataTypes.TEXT,
            alloNull: true,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    },{
        charset: "utf8", // 한국어 설정
        collate: "utf8_general_ci", // 한국어 설정
        timestamps: true, // createAt & updateAt 활성화
        paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
      })
}