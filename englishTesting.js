export default function jsonDataTesting() {
  let obj = {
    group_type: "Listening",
    group_data: {
      group_type: "Listening",
      question_text:
        '{"question_text":[{"node":"text","value":"What is the audio talking about?","inNewLine":false}],"resources":[{"type":"audio","url":"https://begalileo-new-questions.s3.ap-south-1.amazonaws.com/ENG_R_S02/FemaleVoiceAdventuremp3.mp3"}]}',
    },
    question_data: [
      {
        question_type: "Multiple choice",
        question_data: `{\"questionName\":[{\"node\":\"img\",\"value\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png\",\"inNewLine\":false},{\"node\":\"text\",\"value\":\"dddddd\",\"inNewLine\":false}],\"choices\":[{\"correct\":false,\"value\":\"dddd\",\"choice_image\":\"\"},{\"correct\":true,\"value\":\"\",\"choice_image\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01Mirrorimages/CT_15.png\"}],\"solutionModel\":[{\"text\":\"\",\"images\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01DecompositionStrategy/DS_01.png\"},{\"text\":\"            dddfdf\",\"images\":\"\"}]}`,
      },
      {
        question_type: "Fill in the blanks",
        question_data:
          '{"questionName":[{"node":"text","value":"this test question for fill in the blanks","inNewLine":false}],"choices":[{"correct":false,"value":"choices"},{"correct":true,"value":"isMissed1"}]}',
      },
      {
        question_type: "Multiple choice",
        question_data: `{\"questionName\":[{\"node\":\"img\",\"value\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png\",\"inNewLine\":false},{\"node\":\"text\",\"value\":\"dddddd\",\"inNewLine\":false}],\"choices\":[{\"correct\":false,\"value\":\"dddd\",\"choice_image\":\"\"},{\"correct\":true,\"value\":\"\",\"choice_image\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01Mirrorimages/CT_15.png\"}],\"solutionModel\":[{\"text\":\"\",\"images\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01DecompositionStrategy/DS_01.png\"},{\"text\":\"            dddfdf\",\"images\":\"\"}]}`,
      },
      {
        question_type: "Multiple choice",
        question_data: `{\"questionName\":[{\"node\":\"img\",\"value\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png\",\"inNewLine\":false},{\"node\":\"text\",\"value\":\"dddddd\",\"inNewLine\":false}],\"choices\":[{\"correct\":false,\"value\":\"dddd\",\"choice_image\":\"\"},{\"correct\":true,\"value\":\"\",\"choice_image\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01Mirrorimages/CT_15.png\"}],\"solutionModel\":[{\"text\":\"\",\"images\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01DecompositionStrategy/DS_01.png\"},{\"text\":\"            dddfdf\",\"images\":\"\"}]}`,
      },
      {
        question_type: "Multiple choice",
        question_data: `{\"questionName\":[{\"node\":\"img\",\"value\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png\",\"inNewLine\":false},{\"node\":\"text\",\"value\":\"dddddd\",\"inNewLine\":false}],\"choices\":[{\"correct\":false,\"value\":\"dddd\",\"choice_image\":\"\"},{\"correct\":true,\"value\":\"\",\"choice_image\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01Mirrorimages/CT_15.png\"}],\"solutionModel\":[{\"text\":\"\",\"images\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01DecompositionStrategy/DS_01.png\"},{\"text\":\"            dddfdf\",\"images\":\"\"}]}`,
      },
    ],
  };
  let obj2 = {
    group_type: "Reading Comprehension",
    group_data: {
      group_type: "Reading Comprehension",
      question_text:
        '[[{"node":"text","value":"dfdf","inNewLine":false,"style":[]},{"node":"text","value":"","inNewLine":true}],[{"node":"text","value":"dfdf","inNewLine":false,"style":[]},{"node":"text","value":"","inNewLine":true}],[{"node":"text","value":"dfdfdf","inNewLine":false,"style":[]},{"node":"text","value":"","inNewLine":true}]]',
    },
    question_data: [
      {
        question_data: `{"questionName":[{"node":"text","value":"n n  nnnmnmn                     n mnn n","inNewLine":false,"style":[]},{"node":"text","value":"","inNewLine":true}],"question_content":[{"correct":false,"value":"nkjnn","num_value":"nkjjj","type":"text"},{"correct":true,"value":"klklmmmmmmmmm","num_value":"https://begalileo-new-questions.s3.ap-south-1.amazonaws.com/ENG_R_S01/103png.png","type":"image"}],"resources":[],"choices":["nkjnn","klklmmmmmmmmm"]}`,
        question_type: "Math the Following",
      },
      {
        question_data:
          '{"questionName":[{"node":"text","value":"Arrange the lines of this limerick in the correct order.","inNewLine":false}],"questionContent":["There once was a cat from the city,","Who loved to dance and act witty.","In the light of the sun,","She twirled and she spun,","With a purr that was sweet and pretty."],"resources":[],"solutionModel":[]}',
        question_type: "Vertical Ordering",
      },
      {
        question_data:
          '{"questionName":[{"node":"text","value":"What do you see in this picture? Write a sentence or two about it.","inNewLine":false,"style":[]},{"node":"text","value":"","inNewLine":true},{"node":"img","value":"https://begalileo-new-questions.s3.ap-south-1.amazonaws.com/W/peopleonthestreet1jpg.png","inNewLine":false}],"prompt_text":"Provide 2 as the score if the text contains descriptions of people walking on the street, mentions of a dog, etc. Provide 1 as the score if there is no description or mention of people, dog,  man, woman, etc. Provide 0 as the score if the two conditions are not met.","resources":[],"solutionModel":[]}',
        question_type: "Writing ChatGpt",
      },
      {
        question_type: "Fill in the blanks",
        question_data:
          '{"questionName":[{"node":"text","value":"Name of a place is a ____","inNewLine":false}],"choices":[{"correct":true,"value":"n"},{"correct":false,"value":"o"},{"correct":true,"value":"u"},{"correct":false,"value":"n"}],"solutionModel":[]}',
      },
      {
        question_type: "Writing ChatGpt",
        question_data: `{\"questionName\":[{\"node\":\"img\",\"value\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png\",\"inNewLine\":false},{\"node\":\"text\",\"value\":\"dddddd\",\"inNewLine\":false}],\"choices\":[{\"correct\":false,\"value\":\"dddd\",\"choice_image\":\"\"},{\"correct\":true,\"value\":\"\",\"choice_image\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01Mirrorimages/CT_15.png\"}],\"solutionModel\":[{\"text\":\"\",\"images\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01DecompositionStrategy/DS_01.png\"},{\"text\":\"            dddfdf\",\"images\":\"\"}]}`,
      },
      {
        question_type: "Multiple choice",
        question_data: `{"questionName":[{"node":"text","value":"Listen to the word and identify it.","inNewLine":false}],"choices":[{"correct":false,"value":"dasgree","choice_image":""},{"correct":false,"value":"tisagree","choice_image":""},{"correct":true,"value":"disagree","choice_image":""},{"correct":false,"value":"disabree","choice_image":""}],"resources":[{"type":"audio","url":"https://begalileo-new-questions.s3.ap-south-1.amazonaws.com/R/disagreemp3.mp3"}],"solutionModel":[]}`,
      },
      {
        question_type: "Fill in the blanks",
        question_data:
          '{"questionName":[{"node":"text","value":"this test question for fill in the blanks","inNewLine":false}],"choices":[{"correct":false,"value":"choices"},{"correct":true,"value":"isMissed1"}]}',
      },
      {
        question_type: "Multiple choice",
        question_data: `{\"questionName\":[{\"node\":\"img\",\"value\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png\",\"inNewLine\":false},{\"node\":\"text\",\"value\":\"dddddd\",\"inNewLine\":false}],\"choices\":[{\"correct\":false,\"value\":\"dddd\",\"choice_image\":\"\"},{\"correct\":true,\"value\":\"\",\"choice_image\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01Mirrorimages/CT_15.png\"}],\"solutionModel\":[{\"text\":\"\",\"images\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01DecompositionStrategy/DS_01.png\"},{\"text\":\"            dddfdf\",\"images\":\"\"}]}`,
      },
      {
        question_type: "Multiple choice",
        question_data: `{\"questionName\":[{\"node\":\"img\",\"value\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png\",\"inNewLine\":false},{\"node\":\"text\",\"value\":\"dddddd\",\"inNewLine\":false}],\"choices\":[{\"correct\":false,\"value\":\"dddd\",\"choice_image\":\"\"},{\"correct\":true,\"value\":\"\",\"choice_image\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01Mirrorimages/CT_15.png\"}],\"solutionModel\":[{\"text\":\"\",\"images\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01DecompositionStrategy/DS_01.png\"},{\"text\":\"            dddfdf\",\"images\":\"\"}]}`,
      },
      {
        question_type: "Multiple choice",
        question_data: `{\"questionName\":[{\"node\":\"img\",\"value\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png\",\"inNewLine\":false},{\"node\":\"text\",\"value\":\"dddddd\",\"inNewLine\":false}],\"choices\":[{\"correct\":false,\"value\":\"dddd\",\"choice_image\":\"\"},{\"correct\":true,\"value\":\"\",\"choice_image\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01Mirrorimages/CT_15.png\"}],\"solutionModel\":[{\"text\":\"\",\"images\":\"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01DecompositionStrategy/DS_01.png\"},{\"text\":\"            dddfdf\",\"images\":\"\"}]}`,
      },
    ],
  };

  return { ...obj2 };
}

// question_text:
//         '[[{"node":"img","value":"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":false},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true},{"node":"text","value":"dddddd ddd d d d d d d d  d d d d d dd","inNewLine":true}],[{"node":"img","value":"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png","inNewLine":false},{"node":"text","value":"dddddd","inNewLine":false}],[{"node":"img","value":"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png","inNewLine":false},{"node":"text","value":"dddddd","inNewLine":false}],[{"node":"img","value":"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png","inNewLine":false},{"node":"text","value":"dddddd","inNewLine":false}],[{"node":"img","value":"https://s3.ap-south-1.amazonaws.com/begalileo-assets/01BarGraph/BG_02.png","inNewLine":false},{"node":"text","value":"dddddd","inNewLine":false}]]',
