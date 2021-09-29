module.exports = (sequelize, DataTypes) => {
    return sequelize.define('category',{
       text: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                isIn: [['expense', 'income']]
            }
        },

    },{
        charset: "utf8", // 한국어 설정
        collate: "utf8_general_ci", // 한국어 설정
        tableName: "categories", // 테이블 이름
        timestamps: true, // createAt & updateAt 활성화
        paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
      })
}