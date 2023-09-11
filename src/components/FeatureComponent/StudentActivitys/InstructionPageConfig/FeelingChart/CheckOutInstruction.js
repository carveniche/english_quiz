export  function TeacherCheckOutInstruction() {
  let obj= {
       instruction1:`We have completed our class for today. 
 <br />If you remember, before the class started, you were feeling`,
       instruction2:`How are you feeling now? `,
       instruction3:` On your screen you will find the same set of feelings. <br />Pick the one that you can relate to and put it in the empty box.
       `
   }
 return (
  obj
 )
}

export function StudentCheckOutInstruction() {
   let obj= {
       instruction1:`You were feeling.`,
       instruction2:`How are you feeling now? `,
       instruction3:`Pick a feeling from the given feelings on your screen and drag it in the empty box.`,

   }
  return (
   obj
  )
}
