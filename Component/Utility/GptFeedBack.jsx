import styles from "../QuizQuestion/english_mathzone.module.css";
import SpeakPlainText from "./SpeakPlainText";
export default function GptFeedback({ chatGptResponse }) {

    return (
        <div className={styles.gpt_feedback_box}>
            <h4 className="header_title_s"> AI Feedback</h4>
            <div className={styles.audioWithText}>
                <SpeakPlainText readText={chatGptResponse} />

                <p className="para_text">
                    {chatGptResponse || "No AI Feedback available"}
                </p>
            </div>

        </div>
    );
}