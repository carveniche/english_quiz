export default function newTypeQuestionChecker(val){
    let arr=["horizontal_fill_ups","horizontal","vertical","matchobjectsvertical","randomarrangementdragdrop","place_value_chart","compare_drag_operator","comparison_of_images","matchobjectshorizontal","base_block_images","horizontalnotsymbols","options_multiple_pictures","horizontalpicture","place_value_table_select","countontenframes","count_tenframes_multiple","tenframes",
    "questiontextoptions","verticalwithsymbols","long_multiplication",
    "questiontextimages","logical_table_kg","horizontalpreviewclick","hundreds_chart","countofobjectsyesno","number_bond","horizontal_fill_ups_multi_row"]
    return arr.includes(String(val?.trim()))
}
