import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getLessonAndMathZoneConceptDetails } from "../../api";
import {
  addConceptListEnglish,
  addToStore,
} from "../../redux/features/ConceptDetailsRedux";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { MATHCOURSE } from "../../constants";
import { getLessonAndMathZoneConceptDetailsEnglish } from "../../api/englishApi";

interface LessonAndMathZoneEffectProps {
  liveClassId: number;
}

function LessonAndMathZoneEffect({
  liveClassId,
}: LessonAndMathZoneEffectProps) {
  const { course } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (course.toString() === MATHCOURSE) {
      getLessonAndMathZoneConceptDetails({ live_class_id: `${liveClassId}` })
        .then((res) => {
          if (res.data.status) {
            dispatch(addToStore(res.data || {}));
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      getLessonAndMathZoneConceptDetailsEnglish({
        live_class_id: `${liveClassId}`,
      })
        .then((res) => {
          if (res.data.status) {
            dispatch(addConceptListEnglish(res.data || {}));
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [liveClassId]);

  return null;
}

export default LessonAndMathZoneEffect;
