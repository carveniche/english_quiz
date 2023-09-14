import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getLessonAndMathZoneConceptDetails } from "../../api";
import { addToStore } from "../../redux/features/ConceptDetailsRedux";

interface LessonAndMathZoneEffectProps {
  liveClassId: number;
}

function LessonAndMathZoneEffect({
  liveClassId,
}: LessonAndMathZoneEffectProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    getLessonAndMathZoneConceptDetails({ live_class_id: `${liveClassId}` })
      .then((res) => {
        if (res.data.status) {
          dispatch(addToStore(res.data || {}));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [liveClassId]);

  return null;
}

export default LessonAndMathZoneEffect;
