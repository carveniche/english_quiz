import React from 'react'

export default function ActivityInstruction() {
    const instruction={
        checkIn:{
            feelingChart:[
                ` Goodmorning. Let us see How are you are feeling today? There are
            some feeling on your screen. Please pick a feeling that you can
            relate to at this point of time. For example, if you are feeling
            ‘happy’ then take that feeling and put it in the empty box that see
            in your screen.`,
            `<h2 className={styles.heading}>How Are You Feeling?</h2> Pick a feeling from the given feelings on your screen and drag it in the empty box.`
            
        ],
            Affirmation:[
                "Our thoughts have a lot of power. It defines how we feel about ourselves. So let us start our session with some positive thoughts. Here are two options on your screen. Which positive thought would you pick today?",
                "Let us start our session with some positive thoughts. Here are two options on your screen. Which positive thought would you pick today?"
            ]
        },
        checkOut:{
            feelingChart:[
                `check out Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Doloremque facere magni similique commodi. Sapiente, adipisci. Qui,
                mollitia. Vitae aut nulla ratione! Repellendus ut sapiente
                temporibus eligendi atque ab sequi reprehenderit?`,
                `<h2 className={styles.heading}>How Are You Feeling?</h2> Pick a feeling from the given feelings on your screen and drag it in the empty box.`

            ],
            Affirmation:[
                "Today, at the start of our session, you had talked about the power of positive thoughts and you had picked a positive  thought (Self-affirmation picked) I would want you to believe in this thought",
                "This is your self-affirmation OR the positive thought.",
            ]
        }
    }
  return (
    <div>ActivityInstruction</div>
  )
}
