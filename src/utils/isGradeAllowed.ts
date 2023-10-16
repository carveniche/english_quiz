export const isGradeAllowed=(val:string)=>{
    let allowedGrade= ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "UKG"]
    return allowedGrade.includes(String(val).trim())
}